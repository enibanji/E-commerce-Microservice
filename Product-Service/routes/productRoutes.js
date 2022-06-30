const express = require("express");
const Router = express.Router();
const isAuthenticated = require('../middlewares/isauth')

const {createProduct,buyProduct} = require('../controllers/productController')




Router.route('/create').post(isAuthenticated,createProduct)
Router.route('/buy').post(isAuthenticated,buyProduct)

module.exports = Router