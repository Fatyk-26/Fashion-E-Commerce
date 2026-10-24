
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: String,
    price: {
        type: Number,
        required: true,
        min: 0
    },
    sizes: [String],
    rating: Number,
    description: String,
    image: String,
    colors: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model("Product", productSchema);
