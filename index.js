const express = require('express');
const next = require('next');

const cookieParser = require('cookie-parser');
const app = next({ dev: process.env.PROD != "true" })
const handle = app.getRequestHandler()
const bodyParser = require('body-parser');
const read = require('./storage/read');
const port = process.env.PORT? parseInt(process.env.PORT): 3000

async function main() {

  let password = JSON.parse(await read("auth.json")).password

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
      server.get("/api/read", authPolicy, require("./api/read"))

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

