const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please input name']
    },
    description:{
        type: String,
    },
    price: {
        type: Number
      },
}, {timestamps:true})




module.exports = mongoose.model('Product', ProductSchema)