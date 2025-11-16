import React, { useEffect, useState } from "react";
import "./HabitPage.css"; // reuse same styling

function HabitPage() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [editingHabitId, setEditingHabitId] = useState(null);

  // ✅ Fetch all habits
  useEffect(() => {
    fetch("http://localhost:5000/api/habits")
      .then((res) => res.json())
      .then((data) => setHabits(data))
      .catch((err) => console.error("Error fetching habits:", err));
  }, []);

  // ✅ Handle add / update habit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newHabit = { title, frequency };

    if (editingHabitId) {
      // Update existing habit
      fetch(`http://localhost:5000/api/habits/${editingHabitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHabit),
      })
        .then((res) => res.json())
        .then((updatedHabit) => {
          setHabits(habits.map((h) => (h._id === editingHabitId ? updatedHabit : h)));
          resetForm();
        })
        .catch((err) => console.error(err));
    } else {
      // Add new habit
      fetch("http://localhost:5000/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHabit),
      })
        .then((res) => res.json())
        .then((newHabit) => {
          setHabits([...habits, newHabit]);
          resetForm();
        })
        .catch((err) => console.error(err));
    }
  };

  const resetForm = () => {
    setTitle("");
    setFrequency("Daily");
    setEditingHabitId(null);
  };

  // ✅ Delete habit
  const deleteHabit = (id) => {
    fetch(`http://localhost:5000/api/habits/${id}`, { method: "DELETE" })
      .then(() => setHabits(habits.filter((h) => h._id !== id)))
      .catch((err) => console.error(err));
  };

  // ✅ Mark habit as completed (update streak)
  const toggleComplete = (id, completed) => {
    fetch(`http://localhost:5000/api/habits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((res) => res.json())
      .then((updatedHabit) =>
        setHabits(habits.map((h) => (h._id === id ? updatedHabit : h)))
      )
      .catch((err) => console.error(err));
  };

  // ✅ Edit habit
  const editHabit = (habit) => {
    setEditingHabitId(habit._id);
    setTitle(habit.title);
    setFrequency(habit.frequency || "Daily");
  };

  return (
    <div className="app-container">
      <header>
        <h1>🔥 Habit Tracker</h1>
      </header>

      {/* ✅ Form */}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Enter Habit Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="Daily">📅 Daily</option>
          <option value="Weekly">🗓 Weekly</option>
          <option value="Monthly">📆 Monthly</option>
        </select>
        <button type="submit">
          {editingHabitId ? "Update Habit" : "Add Habit"}
        </button>
      </form>

      {/* ✅ Habit List */}
      <div className="task-list">
        <h2>Your Habits</h2>
        {habits.length === 0 ? (
          <p className="no-tasks">✨ No habits yet</p>
        ) : (
          <ul>
            {habits.map((habit) => (
              <li key={habit._id} className={habit.completed ? "completed" : ""}>
                <div>
                  <strong>{habit.title}</strong>
                  <p>
                    Frequency: {habit.frequency} | 🔁 Streak: {habit.streak} | 🏆
                    Longest: {habit.longestStreak}
                  </p>
                </div>
                <div className="buttons">
                  <button
                    className="complete-btn"
                    onClick={() => toggleComplete(habit._id, habit.completed)}
                  >
                    {habit.completed ? "Undo" : "Complete"}
                  </button>
                  <button className="edit-btn" onClick={() => editHabit(habit)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteHabit(habit._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HabitPage;
