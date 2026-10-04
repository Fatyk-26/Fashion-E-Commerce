const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();

const PORT = 3000;

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Fashion Store Backend is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});