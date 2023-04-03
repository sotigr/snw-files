
import { FileArray, FileList, setChonkyDefaults, defineFileAction, ChonkyActions, FileNavbar, FileToolbar, FileContextMenu, FileBrowser } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Modal } from '@mui/material';
import axios from 'axios';
import NewFolderForm from '../NewFolderForm';
import DeleteForm from '../DeleteForm';
import UploadForm from '../UploadForm';
import PreviewModal from '../PreviewModal';
import MediaModal from '../MediaModal';
import UrlForm from '../UrlForm';
import { WindowContext } from '../Window';
import Image from "next/image"
export type File = {
  name: string,
  fullName: string,
  size?:string,
  contentType?: string,
  modified?: string
}

export type Directory = {
  files: File[],
  folders: File[]
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

let imagePreviewExtensions = [
  ".png", ".jpg", ".jpeg", ".webp",
  ".gif", ".ico"
]
imagePreviewExtensions = imagePreviewExtensions.concat(imagePreviewExtensions.map(e => e.toUpperCase()))

let videoPreviewExtensions = [
  ".mp4"
]
videoPreviewExtensions = videoPreviewExtensions.concat(videoPreviewExtensions.map(e => e.toUpperCase()))

let textPreviewExtensions = [
  ".txt", ".json"
]
textPreviewExtensions = textPreviewExtensions.concat(textPreviewExtensions.map(e => e.toUpperCase()))


export default function FileExplorer() {

  const router = useRouter()
  const [newFolder, setNewFolder] = useState(false)
  const [mDelete, setMDelete] = useState(null)
  const [upload, setUpload] = useState(false)
  const [url, setUrl] = useState(false)
  const [directory, setDirectory] = useState<Directory>(null)
  const [previewText, setPreviewText] = useState(null)
  const [previewMedia, setPreviewMedia] = useState(null)
  const [previewMediaType, setPreviewMediaType] = useState("")


  let files: FileArray = useMemo(() => {
    if (!directory) return []
    return directory.folders.map(i => {
      return {
        id: i.name + "dir",
        name: i.name,
        isDir: true,
        path: i.fullName,
        fullPath: i.fullName
      } as any
    }).concat(directory.files.map(i => {
      // let type = getFileMediaType(i.name)
      // if (type == "image") { filesToPreview.push(i.fullName) }
      const size = parseInt(i.size)
      const sizeMb = size * Math.pow(10, -6)
      console.log(i.name, sizeMb)
      return {
        id: i.name + "file",
        name: i.name,
        isDir: false,
        path: i.fullName,
        fullPath: i.fullName, 
        sizeMb: sizeMb,
        size: size
      } as any
    }))
  }, [directory]);
 
  let filesToPreview = useMemo(()=> {
    return files.filter(f=>f.isDir == false && getFileMediaType(f.name) == "image").map(f=>f.fullPath)
  }, [files])

  let path: string = ""
  if (router.query.p) {
    path = router.query.p as string
  }

  if (path.startsWith("/")) {
    path = path.substring(1)
  }

  if (!path.endsWith("/") && path != "") {
    path = path + "/"
  }

  const folderChain: FileArray = useMemo(() => {
    return [
      {
        id: "0chain",
        name: "Home",
        openable: true,
        path: "",
        fullPath: "",
        droppable: true

      },
      ...path.split("/").filter(p => p.trim() != "").map((p, i) => {

        return {
          id: `${i + 1}chain`,
          name: p,
          path: path.substring(0, path.lastIndexOf(p) + p.length) + "/",
          fullPath: path.substring(0, path.lastIndexOf(p) + p.length) + "/",
          openable: true,
          droppable: true

        }
      })
    ] 
  }, [directory])




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


  const folderAction = defineFileAction({
    id: 'new_folder',
    button: {
      name: 'New Folder',
      toolbar: true,
      contextMenu: true,
      group: 'New',
    },
  })
  const urlAction = defineFileAction({
    id: 'new_url',
    button: {
      name: 'New Url',
      toolbar: true,
      contextMenu: true,
      group: 'New',
    },
  })
  const uploadAction = defineFileAction({
    id: 'upload',
    button: {
      name: 'Upload',
      toolbar: true,
      contextMenu: true,
      group: 'New',
    },
  })
  const deleteAction = defineFileAction({
    id: 'delete',
    button: {
      name: 'Delete',
      toolbar: false,
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
  const renameAction = defineFileAction({
    id: 'rename',
    button: {
      name: 'Rename',
      toolbar: false,
      contextMenu: true,
      group: 'Options',
    },
  })




  function getFileMediaType(fileName: string) {
    for (let ext of imagePreviewExtensions) {
      if (fileName.endsWith(ext)) {
        return "image"
      }
    }
    for (let ext of videoPreviewExtensions) {
      if (fileName.endsWith(ext)) {
        return "video"
      }
    }

    for (let ext of textPreviewExtensions) {
      if (fileName.endsWith(ext)) {
        return "text"
      }
    }
    return "other"
  }

  path.split("/").map((p, i) => {
    return {
      id: i,
      name: p,
      openable: true
    }
  })


  // const windowCtx = useContext(WindowContext)
  console.log(previewMedia)
  return (
    <>
      <div style={{ height: "100vh", width: "100%" }}>
        {/* <Button onClick={windowCtx.close}>
          close
        </Button> */}
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
            renameAction,
            deleteAction,
            ChonkyActions.EnableGridView,
            ChonkyActions.EnableListView,
          ]}
          thumbnailGenerator={(file: any) => {  
            if (getFileMediaType(file.fullPath) == "image" && file.sizeMb <= 8) {
              // return null
              return "/api/read?path=" + file.fullPath + "&thumb=true"
            } else {
              return null
            }
          }
          }
          onFileAction={async (e) => {

            if (e.id == "open_files") {
              if (e.payload.targetFile.isDir || e.payload.targetFile.id.includes("chain")) {
                router.push("/?p=" + e.payload.targetFile.path)
              } else {
                const file = e.payload.targetFile.path
                let type = getFileMediaType(file)
                if (type == "image") {
                  setPreviewMediaType("image")
                  setPreviewMedia("/api/read?path=" + file)
                  return
                }  
                else if (type == "video") {
                  setPreviewMediaType("video")
                  setPreviewMedia("/api/read?path=" + file)
                  return
                }

                if (type == "text") {
                  let text = await axios.get("/api/read?path=" + file, { responseType: "text" });
                  setPreviewText(text.data)
                  return
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
            } else if (e.id == "move_files") {
              const from = e.payload.draggedFile.fullPath
              const to = e.payload.destination.fullPath + e.payload.draggedFile.name
              await axios.post("/api/move", {
                from, to
              });
              getDirectory()
            } else if (e.id as string == "rename") {
              const fileName = e.state.selectedFilesForAction[0].name
              const newName = prompt("Rename", fileName);
              if (!newName) return
              const from = e.state.selectedFilesForAction[0].fullPath
              const to = from.substring(0, from.length - fileName.length) + newName

              await axios.post("/api/move", {
                from, to
              });
              getDirectory()
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
      <MediaModal open={previewMedia ? true : false}
        mediaPath={previewMedia}
        mediaType={previewMediaType}
        onClose={() => setPreviewMedia(null)}
        onPrevious={() => {
          let nextFileIndex = 0
          for (let f of filesToPreview) {
            if (previewMedia.endsWith(f)) {
              break;
            }
            nextFileIndex += 1
          }
          nextFileIndex -= 1
          if (nextFileIndex < 0) {
            nextFileIndex = filesToPreview.length - 1
          }

          setPreviewMedia("/api/read?path=" + filesToPreview[nextFileIndex])
        }}
        onNext={() => {
          let nextFileIndex = 0
          for (let f of filesToPreview) {
            if (previewMedia.endsWith(f)) {
              break;
            }
            nextFileIndex += 1
          }
          nextFileIndex += 1
          if (nextFileIndex > filesToPreview.length - 1) {
            nextFileIndex = 0
          }

          setPreviewMedia("/api/read?path=" + filesToPreview[nextFileIndex])
        }}

      />


    </>
  );
}
