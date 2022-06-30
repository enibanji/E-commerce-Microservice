require('dotenv').config()
const jwt = require('jsonwebtoken')

const isAuthenticated = async (req,res,next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid')        
    }

    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        const  {userID,name} = payload
        req.user = {userID,name}
        next()
        
    } catch (error) {
        return res.json({message: error})
    }
}

module.exports = isAuthenticated
