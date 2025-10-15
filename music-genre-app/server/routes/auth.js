const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// SIGNUP route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Check user
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ Login success
    res.status(200).json({
      message: "Login successful",
      redirect: "/predict", // tell frontend where to go
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});


module.exports = router;
