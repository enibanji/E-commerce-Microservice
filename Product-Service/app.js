require('dotenv').config()
require('express-async-errors')

const express = require("express");
const app = express();
const amqp = require('amqplib')
//routers
const productRouter = require('./routes/productRoutes')

//connect database
const connectDB = require('./db/connect')

//middlewares
const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')

app.use(express.json())

//routes
app.use('/product', productRouter)

var channel, connection;
async function connect () {
    const amqpServer = "amqp://localhost:5672"
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT");
}

connect();



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const PORT = process.env.PORT_ONE || 8080;
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
