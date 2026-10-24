
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const crypto = require("crypto");
const transporter = require("../config/mailer");
const rateLimit = require("express-rate-limit");

router.post("/register", async (req, res) => {
const { name, password } = req.body;
const email = req.body.email?.trim().toLowerCase();

    if (!name || !email || !password) {
        return res.status(400).json({
          message: "All fields are required"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Please enter a valid email"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
    }

    const existingUser = await User.findOne({ email });

if (existingUser) {
    return res.status(409).json({
        message: "Email is already registered"
    });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
    name,
    email,
    password: hashedPassword
});

res.status(201).json({
    message: "User registered successfully"
});
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
              message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
              message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );


        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
          {
            id: user._id,
            tokenVersion: user.tokenVersion || 0
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Something went wrong. Please try again later."
        });
    }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const phone = req.body.phone?.trim() || "";

    if (!name) {
      return res.status(400).json({
        message: "Name is required."
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, phone } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      user
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Something went wrong."
    });
  }
});

router.put("/address", authMiddleware, async (req, res) => {
  try {
    const { country, city, district, street, postalCode } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          "address.country": country?.trim() || "",
          "address.city": city?.trim() || "",
          "address.street": street?.trim() || "",
          ...(typeof req.body.phone === "string"
  ? { phone: req.body.phone.trim() }
  : {}),

...(typeof district === "string"
  ? { "address.district": district.trim() }
  : {}),

...(typeof postalCode === "string"
  ? { "address.postalCode": postalCode.trim() }
  : {})
        }
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    res.status(200).json({
      message: "Shipping address saved successfully.",
      user
    });
  } catch (error) {
    console.error("Address update error:", error);
    res.status(500).json({
      message: "Something went wrong."
    });
  }
});


const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later."
  }
});

router.post( "/forgot-password", forgotPasswordLimiter, async (req, res) => {
  const genericMessage =
    "If an account exists with this email, a reset code will be sent.";

  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email is required."
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: genericMessage });
    }

    const cooldownMs = 60 * 1000;

    if (
      user.resetPasswordRequestedAt &&
      Date.now() - user.resetPasswordRequestedAt.getTime() < cooldownMs
    ) {
      return res.status(429).json({
        message: "Please wait 60 seconds before requesting another code."
      });
    }

    const code = crypto.randomInt(100000, 1000000).toString();

    const codeHash = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    
user.resetPasswordCode = codeHash;
user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
user.resetPasswordAttempts = 0;
user.resetPasswordRequestedAt = new Date();

await user.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Fashion Store - Password Reset",
        text: `Your password reset code is ${code}, It expires in 10 minutes. If you didn't request this, please ignore this email.`
      });
    } catch (emailError) {
  
      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;
      user.resetPasswordAttempts = 0;
      user.resetPasswordRequestedAt = undefined;

      await user.save();

      throw emailError;
    }

    return res.status(200).json({ message: genericMessage });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      message: "Unable to process your request right now."
    });
  }
});


router.post("/reset-password", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const code = String(req.body.code || "").trim();
    const password = req.body.password;

    if (!email || !code || !password) {
      return res.status(400).json({
        message: "Email, code, and new password are required."
      });
    }

    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({
        message: "Invalid or expired reset code."
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters."
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.resetPasswordCode) {
      return res.status(400).json({
        message: "Invalid or expired reset code."
      });
    }

    if (user.resetPasswordExpires <= new Date()) {
      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;
      user.resetPasswordAttempts = 0;
      await user.save();

      return res.status(400).json({
        message: "Invalid or expired reset code."
      });
    }

    if (user.resetPasswordAttempts >= 5) {
      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;
      user.resetPasswordAttempts = 0;
      await user.save();

      return res.status(400).json({
        message: "Too many attempts. Request a new code."
      });
    }

    const submittedHash = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    if (submittedHash !== user.resetPasswordCode) {
      user.resetPasswordAttempts += 1;
      await user.save();

      return res.status(400).json({
        message: "Invalid or expired reset code."
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordAttempts = 0;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully. Please log in."
    });
  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      message: "Something went wrong. Please try again."
    });
  }
});

router.put("/me/address", authMiddleware, async (req, res) => {
    try {
        const { phone, address } = req.body;

        if (
            typeof phone !== "string" ||
            !phone.trim() ||
            !address ||
            typeof address.street !== "string" ||
            !address.street.trim() ||
            typeof address.city !== "string" ||
            !address.city.trim()
        ) {
            return res.status(400).json({
                message: "Phone, street address, and city are required."
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    phone: phone.trim(),
                    "address.street": address.street.trim(),
                    "address.city": address.city.trim(),
                    "address.country": "Saudi Arabia"
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            message: "Shipping address saved successfully.",
            user
        });
    } catch (error) {
        console.error("Save address error:", error);

        return res.status(500).json({
            message: "Unable to save shipping address."
        });
    }
});



module.exports = router;