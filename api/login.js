
 

module.exports = async function (req, res) {
    res.cookie('auth', req.body.password, { maxAge: 900000, httpOnly: true });

    res.end("ok")
} 