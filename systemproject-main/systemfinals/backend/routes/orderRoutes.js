const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const router = express.Router();
const mongoose = require('mongoose');
const PickupSchedule = require('../models/pickupSchedule');

router.post('/checkout', async (req, res) => {
    try {

        console.log("Request body:", req.body);

        const { userId, productIds, pickupScheduleId, quantities, totalPrice } = req.body;

        if (!userId || !productIds || !pickupScheduleId || !quantities || !totalPrice) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        console.log("Validated fields:", { userId, productIds, pickupScheduleId, quantities, totalPrice });

        // Create new ObjectId instances properly
        const orderData = {
            userId: new mongoose.Types.ObjectId(userId),
            productIds: productIds.map(id => new mongoose.Types.ObjectId(id)),
            pickupScheduleId: new mongoose.Types.ObjectId(pickupScheduleId),
            quantity: quantities.reduce((acc, qty) => acc + qty, 0),
            totalPrice,
            datePlaced: new Date(), // Set the order date explicitly if needed
        };

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();

        // Update stock for each product
        await Promise.all(
            productIds.map(async (productId, index) => {
                const product = await Product.findById(productId);
                if (product) {
                    product.stock -= quantities[index]; // Deduct the quantity ordered from stock
                    if (product.stock < 0) {
                        throw new Error(`Not enough stock for product ${product.name}`);
                    }
                    await product.save(); // Save the updated product
                } else {
                    throw new Error(`Product not found: ${productId}`);
                }
            })
        );

        // Update the pickup schedule slots
        const schedule = await PickupSchedule.findById(pickupScheduleId);
        if (schedule) {
            if (schedule.slots <= 0) {
                throw new Error(`No available slots for the selected date.`);
            }
            schedule.slots -= 1; // Deduct one slot
            await schedule.save(); // Save the updated schedule
        } else {
            throw new Error(`Pickup schedule not found: ${pickupScheduleId}`);
        }

        res.status(201).json({ message: 'Order placed successfully', orderId: savedOrder._id });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: 'Failed to place order', errorMessage: error.message });
    }
});

module.exports = router;
