import "../styles/globals.css"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import Head from "next/head";
import ResponsiveContext, { getResponsive } from "../context/responsive";

const isBrowser = typeof document !== 'undefined';

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that MUI styles are loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
function createEmotionCache() {
    let insertionPoint;

    if (isBrowser) {
        const emotionInsertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
        insertionPoint = emotionInsertionPoint ?? undefined;
    }

    return createCache({ key: 'mui-style', insertionPoint });
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export default function MyApp(props) {

    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    const responsive = getResponsive()

    return <CacheProvider value={emotionCache}>
        <ResponsiveContext.Provider value={responsive}>
            <ThemeProvider theme={darkTheme}> 
                <CssBaseline /> 
                <Component {...pageProps} />
            </ThemeProvider>
        </ResponsiveContext.Provider>
    </CacheProvider>
}