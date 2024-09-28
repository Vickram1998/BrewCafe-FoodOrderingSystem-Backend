require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const itemRoutes = require("./Routes/Items");
const orderRoutes = require("./Routes/Order");
const userRoutes = require("./Routes/Auth");

const app = express();


app.use(cors());
app.use(express.json());


app.use('/Upload/Images', express.static(path.join(__dirname, 'Upload/Images')));

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err.message);
});



app.use("/api/items", itemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
