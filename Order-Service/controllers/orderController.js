const Order = require('../models/order')
const amqp = require('amqplib')

var channel, connection;
async function connect () {
    const amqpServer = "amqp://localhost:5672"
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER");
}



const createOrder =  (products, userEmail) => {
    let total = 0;
    for (let t=0; t<products.length; ++t){
        total += products[t].price;
    }
    const newOrder = new Order({
        products,
        user: userEmail,
        total_price: total
    })
    newOrder.save();
    console.log(newOrder);
    return newOrder
}

connect().then(() => {
    channel.consume("ORDER", (data) => {
        console.log(JSON.parse(data.content));
        const{ products, userEmail} = JSON.parse(data.content);
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


module.exports = {createOrder}