const express = require("express");
const Habit = require("../models/Habit");
const router = express.Router();

// Get all habits
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new habit
router.post("/", async (req, res) => {
  const habit = new Habit(req.body);
  try {
    const newHabit = await habit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update habit (and handle streak logic)
router.put("/:id", async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // ✅ Handle completion streak
    if (req.body.completed === true) {
      const today = new Date();
      const lastDate = habit.lastCompletedDate ? new Date(habit.lastCompletedDate) : null;

      let streak = habit.streak;

      if (lastDate) {
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) streak += 1;
        else if (diffDays > 1) streak = 1;
      } else {
        streak = 1;
      }

      habit.streak = streak;
      habit.lastCompletedDate = today;
      if (streak > habit.longestStreak) habit.longestStreak = streak;
    }

    Object.assign(habit, req.body);
    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete habit
router.delete("/:id", async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
