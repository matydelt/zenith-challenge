const mongoose = require("mongoose");

exports.connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error("Unexpected error conecting to MongoDB:", error);
        process.exit(1);
    }
}

const orderSchema = new mongoose.Schema({
    orderId: String,
    userId: String,
    products: [
        {
            productId: String,
            quantity: Number
        }
    ],
    status: String
});

exports.Order = mongoose.model("Order", orderSchema);