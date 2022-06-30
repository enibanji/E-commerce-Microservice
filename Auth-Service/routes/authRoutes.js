const express = require("express");
const Router = express.Router();

const {registerUser,login} = require('../controllers/authController')




Router.route('/register').post(registerUser)
Router.route('/login').post(login)

module.exports = Router