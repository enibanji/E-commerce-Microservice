require('dotenv').config()
require('express-async-errors')

const express = require("express");
const app = express();
const amqp = require('amqplib')
//routers
// const orderRouter = require('./routes/orderRoutes')

//connect database
const connectDB = require('./db/connect')

//middlewares
const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found');
const Order = require('./models/order');

app.use(express.json())

//routes
// app.use('/order', orderRouter)



function createOrder(products, userEmail) {
    let total = 0;
    for (let t=0; t<products.length; ++t){
        total += products[t].price;
    }
    const newOrder = new Order({
        products,
        user: userEmail,
        total_price:total 
    })
    newOrder.save();
    return newOrder
}

var channel, connection;
async function connect () {
    const amqpServer = "amqp://localhost:5672"
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER");
}

connect().then(() => {
    channel.consume("ORDER", (data) => {
        console.log("Consuming ORDER queue");
        const{ products, userEmail} = JSON.parse(data.content);
        // console.log(products)
        const newOrder = createOrder(products, userEmail);
        console.log(newOrder);
        channel.ack(data);
        channel.sendToQueue(
            "PRODUCT",
            Buffer.from(
                JSON.stringify({
                    newOrder,
                })
            )
        )
    })
    });



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const PORT = process.env.PORT_ONE || 9090;
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, ()=>{
            console.log(`server is listening on port: ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
   
}

start()
