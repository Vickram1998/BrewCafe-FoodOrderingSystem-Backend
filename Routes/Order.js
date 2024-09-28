const express = require("express");
const Order = require("../Models/Order");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require('dotenv').config();

const router = express.Router();
const secretKey = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS   
    }
});

router.post("/", authenticateToken, async (req, res) => {
    const { cart, location } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ message: "Cart cannot be empty" });
    }

    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
        return res.status(400).json({ message: "Location data is required" });
    }

    try {
       
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const order = new Order({
            user: req.userId,  
            items: cart,
            location: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            createdAt: new Date()
        });

        await order.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Order Confirmation",
            text: `Hello ${user.username}, your order has been placed successfully.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Error sending email", error });
            }
            res.status(201).json({ message: "Order placed successfully", order });
        });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.get("/", authenticateToken, async (req, res) => {
    try {
        
        const orders = await Order.find({ user: req.userId });
        res.json(orders); 
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
