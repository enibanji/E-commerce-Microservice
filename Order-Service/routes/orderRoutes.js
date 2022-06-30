const express = require("express");
const Router = express.Router();
const isAuthenticated = require('../middlewares/isauth')

const {createOrder} = require('../controllers/orderController')




Router.route('/create').post(createOrder)


module.exports = Router