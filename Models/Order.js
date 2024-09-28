const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, 
    items: [{ type: Object, required: true }],
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
