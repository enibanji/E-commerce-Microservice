const mongoose = require('mongoose')


const OrderSchema = new mongoose.Schema({
    products:[{
        product_id: String
    }],
    user:{
        type: String,
    },

    total_price: {
        type: Number
      },

    }, {timestamps:true})

 
   


module.exports = mongoose.model('Order', OrderSchema)