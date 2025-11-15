// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");          // ✅ User login/signup

const app = express();
app.use(cors());
app.use(express.json());

// ---- MongoDB Connection ----
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));


// ---- Test Route ----
app.get("/", (req, res) => {
  res.send("🎵 Music Genre Predictor Backend is running smoothly!");
});

// ---- Routes ----
app.use("/api/auth", authRoutes);        // 🔐 Signup/Login/Forgot/Logout      

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
