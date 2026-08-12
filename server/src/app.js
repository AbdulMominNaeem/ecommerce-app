require("dotenv").config();

const path = require("path");
const express = require('express');
const app = express();
const cors = require("cors")

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");


app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Backend Runing"
    })
})

module.exports = app;