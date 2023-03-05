


module.exports = async function (req, res) {
    res.cookie('auth', req.body.password, {
        maxAge: 2 * 60 * 60 * 1000 /* 2 hours */,
        httpOnly: true
    });

    res.end("ok")
} 