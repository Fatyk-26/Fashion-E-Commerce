
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");

async function seedProducts() {
    try {
        const dataPath = path.join(
            __dirname,
            "../js/data.js"
        );

        const data = fs.readFileSync(dataPath, "utf8");
        const context = {};
        vm.createContext(context);

        vm.runInContext(
            `${data}\nglobalThis.productsData = products;`,
            context
        );

        const products = JSON.parse(
            JSON.stringify(context.productsData)
        );

        await connectDB();

        for (const product of products) {
            await Product.findOneAndUpdate(
                { id: product.id },
                product,
                {
                    upsert: true,
                    new: true,
                    runValidators: true
                }
            );
        }

        console.log(
            `Successfully imported ${products.length} products.`
        );
    } catch (error) {
        console.error("Product import failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedProducts();
