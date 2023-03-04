
const list = require("../storage/list")
module.exports = async function (req, res, next) {
    let path = req.query.path 

    let directory = await list(path)

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(directory))
}
