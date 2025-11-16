// backend/models/Usage.js
const mongoose = require("mongoose");

const UsageSchema = new mongoose.Schema({
  youtube: { type: Number, default: 0 },   // minutes
  facebook: { type: Number, default: 0 },
  instagram: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Usage", UsageSchema);
