require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const transporter = require("./config/mailer");

const app = express();

const PORT = 3000;

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Fashion Store Backend is running!");
});


app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Fashion Store - Email Test",
      text: "Email sending is working successfully!"
    });

    res.send("Test email sent successfully!");
  } catch (error) {
    console.error("Email error:", error.message);
    res.status(500).send("Failed to send test email. Check the server terminal.");
  }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});