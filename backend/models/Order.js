
const mongoose = require("mongoose");
const orderItemSchema = new mongoose.Schema({

    productId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    color: {
        type: String,
        default: ""
    },
    size: {
        type: String,
        default: ""
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: items => items.length > 0,
            message: "An order must contain at least one item."
        }
    },
    shippingAddress: {
        name: {
            type: String, 
            required: true },

        phone: { 
            type: String,
            required: true },

        address: { 
            type: String, 
            required: true },
            
        city: { 
            type: String, 
            required: true }
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    shippingCost: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "card"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    orderStatus: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
