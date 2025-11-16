// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const taskRoutes = require("./routes/tasks"); 
const usageRoutes = require("./routes/Usage"); 
const habitRoutes = require("./routes/habitRoutes");// ✅ new import
const authRoutes = require("./routes/auth");
const app = express();
app.use(cors());
app.use(express.json());

// ---- Connect to MongoDB ----
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ---- Test Route ----
app.get("/", (req, res) => {
  res.send("Backend is running ");
});

// ---- Routes ----
app.use("/api/tasks", taskRoutes);
app.use("/api/usage", usageRoutes); // ✅ new route added safely
app.use("/api/habits", habitRoutes);
app.use("/api/auth", authRoutes);

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
