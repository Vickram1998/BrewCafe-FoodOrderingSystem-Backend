const express = require("express");
const multer = require("multer");
const path = require("path");
const Item = require("../models/Item");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Upload/Images/'); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
const upload = multer({ storage });


router.get("/", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


router.post("/", upload.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!name || !description || !price || !imageUrl) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newItem = await Item.create({ name, description, price, imageUrl });
        res.status(201).json(newItem);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
