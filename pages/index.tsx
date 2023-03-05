
import { FileArray, FileList, setChonkyDefaults, defineFileAction, ChonkyActions, FileNavbar, FileToolbar, FileContextMenu, FileBrowser } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { Box, Modal } from '@mui/material';
import NewFolderForm from '../components/NewFolderForm';
import DeleteForm from '../components/DeleteForm';
import UploadForm from '../components/UploadForm';
import LoginForm from '../components/LoginForm';
import UrlForm from '../components/UrlForm';
import axios from 'axios';
import PreviewModal from '../components/PreviewModal';

export type File = {
  name: string,
  fullName: string
}

export type Directory = {
  files: File[],
  folders: File[]
}

interface Props {

  path: string
  auth: boolean
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "100%",
  maxWidth: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Home({ path, auth }: Props) {
  if (!auth) {
    return <LoginForm />
  }

  const router = useRouter()
  const [newFolder, setNewFolder] = useState(false)
  const [mDelete, setMDelete] = useState(null)
  const [upload, setUpload] = useState(false)
  const [url, setUrl] = useState(false)
  const [directory, setDirectory] = useState<Directory>(null)
  const [previewText, setPreviewText] = useState(null)

  setChonkyDefaults({ iconComponent: ChonkyIconFA });



  async function getDirectory() {
    const res = await axios.get("/api/list?path=" + (path == "/" ? "" : path))
    setDirectory(res.data)
  }

  useEffect(() => {
    getDirectory()
  }, [])


  useEffect(() => {
    getDirectory()
  }, [path])


  if (!directory) return null

  const deleteAction = defineFileAction({
    id: 'delete',
    button: {
      name: 'Delete',
      toolbar: false,
      contextMenu: true,
      group: 'Options',
    },
  })
  const folderAction = defineFileAction({
    id: 'new_folder',
    button: {
      name: 'New Folder',
      toolbar: true,
      contextMenu: true,
      group: 'Options',
    },
  })
  const urlAction = defineFileAction({
    id: 'new_url',
    button: {
      name: 'New Url',
      toolbar: true,
      contextMenu: true,
      group: 'Options',
    },
  })
  const uploadAction = defineFileAction({
    id: 'upload',
    button: {
      name: 'Upload',
      toolbar: true,
      contextMenu: true,
      group: 'Options',
    },
  })
  const downloadAction = defineFileAction({
    id: 'download',
    button: {
      name: 'Download',
      toolbar: false,
      contextMenu: true,
      group: 'Options',
    },
  })


  const folderChain = [
    {
      id: "0chain",
      name: "Home",
      openable: true,
      path: ""
    },
    ...path.split("/").filter(p => p.trim() != "").map((p, i) => {

      return {
        id: `${i + 1}chain`,
        name: p,
        path: path.substring(0, path.lastIndexOf(p) + p.length) + "/",
        openable: true
      }
    })
  ]


  path.split("/").map((p, i) => {
    return {
      id: i,
      name: p,
      openable: true
    }
  })

  let files: FileArray = directory.folders.map(i => {
    return {
      id: i.name + "dir",
      name: i.name,
      isDir: true,
      path: i.fullName,
      fullPath: i.fullName
    } as any
  }).concat(directory.files.map(i => {
    return {
      id: i.name + "dir",
      name: i.name,
      isDir: false,
      path: i.fullName,
      fullPath: i.fullName,

    } as any
  }))

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <div style={{ height: "100vh", width: "100%" }}>
        <FileBrowser

          darkMode
          disableDefaultFileActions={true}
          defaultFileViewActionId={ChonkyActions.EnableGridView.id}
          iconComponent={ChonkyIconFA}
          folderChain={folderChain}
          files={files}
          fileActions={[
            folderAction,
            urlAction,
            uploadAction,
            downloadAction,
            deleteAction,
            ChonkyActions.EnableGridView,
            ChonkyActions.EnableListView,
          ]}
          thumbnailGenerator={(file: any) => {

            const previewExtensions = [
              ".png", ".jpg", ".jpeg", ".webp",
              ".gif", ".ico"
            ]
            for (let ext of previewExtensions) {
              if (file.fullPath.endsWith(ext)) {
                return "/api/read?path=" + file.fullPath
              }
            }

            return null
          }
          }
          onFileAction={async (e) => {
            if (e.id == "open_files") {
              if (e.payload.targetFile.isDir || e.payload.targetFile.id.includes("chain")) {
                router.push("/?p=" + e.payload.targetFile.path)
              } else {
                const file = e.payload.targetFile.path
                const previewExts = [".txt", ".json"]
                for (let ext of previewExts) {
                  if (file.endsWith(ext)) {
                    let text = await axios.get("/api/read?path=" + file, { responseType: "text" });
                    setPreviewText(text.data)
                    return
                  }
                }

                if (file.endsWith(".url")) {
                  let url = await axios.get("/api/read?path=" + file);
                  window.open(url.data, '_blank');
                } else {
                  window.open("/api/read?path=" + file, '_blank');
                }
              }
            } else if (e.id as string == "new_folder") {
              setNewFolder(true)
            } else if (e.id as string == "delete") {
              setMDelete(e.state.selectedFilesForAction[0].fullPath)
            } else if (e.id as string == "upload") {
              setUpload(true)
            } else if (e.id as string == "new_url") {
              setUrl(true)
            } else if (e.id as string == "download") {
              window.open("/api/read?path=" + e.state.selectedFilesForAction[0].fullPath + "&download=true");
            }

          }}
        >
          <FileNavbar />
          <FileToolbar />
          <FileList />
          <FileContextMenu />
        </FileBrowser>
      </div>
      <Modal
        open={newFolder}
        onClose={() => setNewFolder(false)}
      >
        <Box sx={modalStyle}>
          <NewFolderForm path={path} onChange={() => { setNewFolder(false); getDirectory() }} />
        </Box>
      </Modal>
      <Modal
        open={mDelete}
        onClose={() => setMDelete(false)}
      >
        <Box sx={modalStyle}>
          <DeleteForm path={mDelete} onNo={() => setMDelete(false)} onChange={() => { setMDelete(false); getDirectory() }} />
        </Box>
      </Modal>
      <Modal
        open={upload}
        onClose={() => setUpload(false)}
      >
        <Box sx={modalStyle}>
          <UploadForm path={path} onChange={() => { setUpload(false); getDirectory() }} />
        </Box>
      </Modal>
      <Modal
        open={url}
        onClose={() => setUrl(false)}
      >
        <Box sx={modalStyle}>
          <UrlForm path={path} onChange={() => { setUrl(false); getDirectory() }} />
        </Box>
      </Modal>
      <PreviewModal open={previewText ? true : false} text={previewText} onClose={() => setPreviewText(null)} />
    </>
  );
}


export async function getServerSideProps(context: NextPageContext) {
  if ((context.req as any).auth == false) {
    return {
      props: { directory: null, path: null, auth: false }
    }
  }
  let path: string = ""
  if (context.query.p) {
    path = context.query.p as string
  }

  if (path.startsWith("/")) {
    path = path.substring(1)
  }

  if (!path.endsWith("/") && path != "") {
    path = path + "/"
  }

  return {
    props: { path, auth: true }, // will be passed to the page component as props
  }
}
