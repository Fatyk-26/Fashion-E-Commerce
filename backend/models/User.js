
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },


  resetPasswordCode: {
    type: String,
    default: undefined
  },

  resetPasswordExpires: {
    type: Date,
    default: undefined
  },

  resetPasswordAttempts: {
    type: Number,
    default: 0
  },

  resetPasswordRequestedAt: {
    type: Date,
    default: undefined
  },

  tokenVersion: {
    type: Number,
    default: 0
  },

  phone: {
    type: String,
    trim: true,
    default: ""
  },

  address: {
    country: {
      type: String,
      default: "",
      trim: true
    },
    city: {
      type: String,
      default: "",
      trim: true
    },
    district: {
      type: String,
      default: "",
      trim: true
    },
    street: {
      type: String,
      default: "",
      trim: true
    },
    postalCode: {
      type: String,
      default: "",
      trim: true
    }
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
