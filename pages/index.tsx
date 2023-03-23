import Head from 'next/head';
import React from 'react';
import { NextPageContext } from 'next';
import LoginForm from '../components/LoginForm';
import Desktop from '../components/Desktop';
  
interface Props {

  path: string
  auth: boolean
} 

export default function Home({ auth }: Props) {
  if (!auth) {
    return <LoginForm />
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Desktop />
    </>
  )

}
 
export async function getServerSideProps(context: NextPageContext) {
  if ((context.req as any).auth == false) {
    return {
      props: { directory: null, path: null, auth: false }
    }
  } 

  return {
    props: { auth: true }, 
  }
}
