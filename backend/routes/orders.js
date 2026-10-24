
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty."
            });
        }

        if (
            !shippingAddress ||
            !shippingAddress.name ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city
        ) {
            return res.status(400).json({
                message: "Please provide a complete shipping address."
            });
        }

        if (!["cod", "card"].includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method."
            });
        }

        const orderItems = [];
        let subtotal = 0;

        for (const item of items) {
            const product = await Product.findOne({
                id: Number(item.productId ?? item.id)
            });

            if (!product) {
                return res.status(400).json({
                    message: `Product not found: ${item.productId ?? item.id}`
                });
            }

            const quantity = Number(item.quantity);

            if (
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > 99
            ) {
                return res.status(400).json({
                    message: "Invalid product quantity."
                });
            }

            
    const size = typeof item.size === "string" ? item.size.trim() : "";
    const color = typeof item.color === "string" ? item.color.trim() : "";


if (
    !color ||
    !Array.isArray(product.colors) ||
    !product.colors.some(
        productColor =>
            productColor &&
            typeof productColor.name === "string" &&
            productColor.name.toLowerCase() === color.toLowerCase()
    )
) {
    return res.status(400).json({
        message: "Please select a valid product color."
    });
}


if (
    Array.isArray(product.sizes) &&
    product.sizes.length > 0 &&
    !product.sizes.includes(size)
) {
    return res.status(400).json({
        message: "Please select a valid product size."
    });
}

if (
    (!Array.isArray(product.sizes) || product.sizes.length === 0) &&
    size
) {
    return res.status(400).json({
        message: "This product does not have size options."
    });
}




    const price = product.price;
    const itemTotal = price * quantity;

    subtotal += itemTotal;

    const selectedColor = product.colors.find(
        productColor => productColor.name.toLowerCase() === color.toLowerCase()
    );

    orderItems.push({
        productId: product.id,
        name: product.name,
        image: selectedColor.image,
        price,
        quantity,
        color,
        size,
    });
}

    const shippingCost = 0;
    const total = subtotal + shippingCost;
    const order = await Order.create({
        user: req.user.id,
        items: orderItems,
        shippingAddress,
        subtotal,
        shippingCost,
        total,
        paymentMethod,
        paymentStatus: "pending",
        orderStatus: "pending"
    });

    return res.status(201).json({
        message: "Order created successfully.",
        order
    });
} catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
        message: "Server error while creating order."
    });
}
});

router.get("/my-orders", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        return res.status(200).json({ orders });
    } catch (error) {
        console.error("Fetch orders error:", error);

        return res.status(500).json({
            message: "Server error while fetching orders."
        });
    }
});

module.exports = router;
