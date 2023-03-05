
const list = require("../storage/list")
const pathPrefix = require("./helpers/path-prefix")
module.exports = async function (req, res, next) {
    let path = pathPrefix() + req.query.path  
    let directory = await list(path)

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(directory))
}
