const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const header_cookie = req.headers.cookie
        token = header_cookie.substring(6)//removing token= from header cookie
        const decoded = jwt.verify(token, 'thisistrail')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user)
            throw new Error()
        req.token = token
        req.user = user
        next()
    } catch (e) {
            console.log(e)
            res.send("<h1>You will have to login first!!!</h1>")
    }
}

module.exports = auth