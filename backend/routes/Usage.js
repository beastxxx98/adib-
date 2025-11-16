// backend/routes/usage.js
const express = require("express");
const router = express.Router();
const Usage = require("../models/Usage");

// ---- Save new usage record ----
router.post("/", async (req, res) => {
  try {
    const { youtube, facebook, instagram } = req.body;
    const usage = new Usage({ youtube, facebook, instagram });
    const saved = await usage.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: "Invalid usage data" });
  }
});

// ---- Get all usage records ----
router.get("/", async (req, res) => {
  try {
    const records = await Usage.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---- Get latest usage record ----
router.get("/latest", async (req, res) => {
  try {
    const latest = await Usage.findOne().sort({ createdAt: -1 });
    res.json(latest || {});
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
