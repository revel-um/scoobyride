const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization
        const decode = jwt.verify(token, process.env.SECRET_JWT_KEY)
        req.userData = decode
        next()
    }catch(err){
        res.status(401).json({
            error: "Auth failed"
        })
    }
}