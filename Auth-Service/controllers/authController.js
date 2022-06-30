const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomErr = require('../errors')
const jwt = require('jsonwebtoken')

 const registerUser = async(req,res) => {
    const{email, password, name} = req.body;
    const isEmailExist = await User.findOne({email});
    if (isEmailExist) {
        throw new CustomErr.BadRequestError('email already exists')
    }
    const user = await User.create({name, email, password})

    res.status(StatusCodes.OK).json({user})

 }

 const login = async(req,res) => {
     const {email, password} = req.body;
     if (!email || !password){
        throw new CustomErr.BadRequestError('Please input email and password')
     }
     const user = await User.findOne({email})
     if (!user) {
        throw new CustomErr.UnauthenticatedError('Invalid Credentials')
     }
     const passwordCorrect = user.comparePassword(password)
     if (!passwordCorrect) {
        throw new CustomErr.UnauthenticatedError('Invalid Credentials')
     }
     const tokenUser = {name: user.name, userId:user._id}
     const token = jwt.sign(tokenUser,process.env.JWT_SECRET,{expiresIn: process.env.JWT_LIFETIME})
     res.status(StatusCodes.OK).json({token})

 }

 module.exports = {
     registerUser,
     login
 }