const move = require("../storage/move")
const pathPrefix = require("./helpers/path-prefix")

module.exports = async function (req, res) {
    const from = pathPrefix() + req.body.from
    const to = pathPrefix() + req.body.to

    await move(from, to)

    res.end("ok")
}
