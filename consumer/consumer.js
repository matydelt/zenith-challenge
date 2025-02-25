require("dotenv").config();
const amqp = require("amqplib");
const { connectMongo, Order } = require("./database.provider");
const { productsValidator } = require("./utils");
const { redisConnection } = require("./redis.provider");
const { ESClient } = require("./elasticSearch.provider");


async function consumeMessages() {
  try {
    const eSClient = new ESClient()
    await connectMongo();
    const redis = redisConnection;
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME, { durable: true });

    console.log("📦 Waiting for messages");

    try {
      channel.consume(process.env.QUEUE_NAME, async (msg) => {
        if (msg !== null) {
          const content = JSON.parse(msg.content.toString());
  
          const order = await Order.findById(content.orderId).exec();
          if (!order || order.status !== "PROCESSING") {
            eSClient.register("Order not available or already processed", content.orderId);
            channel.ack(msg);
            return;
          } else {
            if (!order.userId || !order.products.length || !productsValidator(order.products)) {
              order.status = "FAILED";
            } else {
              order.status = "COMPLETED";
            }
            await order.save();
            await redis.del(`/orders/${content.orderId}`);
            eSClient.register(`Order processed successfully with status: ${order.status}`, content.orderId);
          }
          channel.ack(msg);
        }
      });
    } catch (error) {
      eSClient.register("Unexpected error procesing order", content.orderId);
      throw error
    }

  } catch (error) {
    console.error("Unexpected error consuming messages:", error);
    process.exit();
  }
}



consumeMessages();
