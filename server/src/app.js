require("dotenv").config();

const express = require('express');
const path = require("path");
const app = express();
const cors = require("cors")

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");


app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
    res.json({
        message: "Backend Runing"
    })
})

app.use("/store", productRoutes);
app.use("/category", categoryRoutes);


module.exports = app;