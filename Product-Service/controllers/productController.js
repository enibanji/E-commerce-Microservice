const { StatusCodes } = require('http-status-codes')
const Product = require('../models/Product')
const amqp = require('amqplib')

const createProduct = async (req,res) => {
const {name, description, price} = req.body
const product = await Product.create({name, description, price})
res.status(StatusCodes.OK).json({product})
}

var order
var channel, connection;
async function connect () {
    const amqpServer = "amqp://localhost:5672"
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT");
}

connect();

const buyProduct = async (req,res) => {
    const {ids} = req.body
    const products =  await Product.find({ _id: {$in : ids}}); //finding all products with ids
    channel.sendToQueue(
        "ORDER",
        Buffer.from(
            JSON.stringify({
                products,
                userEmail: req.user.email,
            })
        )
    );
    channel.consume("PRODUCT", (data) => {
        console.log('Consuming product queue');
        console.log(JSON.parse(data.content));
        order = JSON.parse(data.content)
        channel.ack(data);
        return res.json(order)
    })
}

module.exports = {
    createProduct,
    buyProduct
}