const express = require('express');
const next = require('next');

const cookieParser = require('cookie-parser');
const app = next({ dev: process.env.PROD != "true" })
const handle = app.getRequestHandler()
const bodyParser = require('body-parser');
const read = require('./storage/read');
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
const schedule = require('node-schedule');
const fs = require("fs")

const fileDir = "/tmp/files"
const thumbDir = "/tmp/thumbs"
async function main() {

  let password = JSON.parse(await read("auth.json")).password

  schedule.scheduleJob('0 * * * *', function(){
    fs.rmSync(fileDir, { recursive: true, force: true });
    console.log('Clearing temp files');
  });

  schedule.scheduleJob('0 */3 * * *', function(){
    fs.rmSync(thumbDir, { recursive: true, force: true });
    console.log('Clearing thumbnails');
  });

  app.prepare()
    .then(async () => {

      const server = express()
      server.use(cookieParser());

      server.use(bodyParser.json());
      server.use((req, res, next) => {
        req.password = password
        next()
      })
      server.use((req, res, next) => {
        if (req.password == req.cookies.auth) {
          req.auth = true
        } else {
          req.auth = false
        }
        next()
      })

      const authPolicy = (req, res, next) => {
        if (req.auth) {
          next()
        } else {
          res.statusCode = 401
          res.end("Unauthorized")
        }
      }

      server.post("/api/upload", authPolicy, ...require("./api/upload"))
      server.post("/api/folder", authPolicy, require("./api/folder"))
      server.post("/api/delete", authPolicy, require("./api/delete"))
      server.post("/api/move", authPolicy, require("./api/move"))
      server.get("/api/read", authPolicy, require("./api/read"))
      server.get("/api/list", authPolicy, require("./api/list"))
      server.get("/api/fetch-page", authPolicy, require("./api/fetch-page"))

      server.post("/api/login", require("./api/login"))

      server.get('*', (req, res) => {
        return handle(req, res)
      })

      server.listen(port, (err) => {
        if (err) throw err
        console.log('> Ready on http://localhost:' + port)
      })

    })
    .catch((ex) => {
      console.error(ex.stack)
      process.exit(1)
    })

}

main();

