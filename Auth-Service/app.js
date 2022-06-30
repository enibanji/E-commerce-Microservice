require('dotenv').config()
require('express-async-errors')

const express = require("express");
const app = express();
//routers
const authRouter = require('./routes/authRoutes')

//connect database
const connectDB = require('./db/connect')

//middlewares
const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')

app.use(express.json())

//routes
app.use('/auth', authRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const PORT = process.env.PORT_ONE || 7070;
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
