import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import ProductivityPage from "./ProductivityPage";
import HabitPage from "./HabitPage";
import Login from "./Login";
import Signup from "./Signup";
import "./welcome.css"
function MainApp({ user, setUser }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [page, setPage] = useState("tasks");

  const navigate = useNavigate();

  // Fetch tasks when logged in
  useEffect(() => {
    if (user) {
      fetch("http://localhost:5000/api/tasks")
        .then((res) => res.json())
        .then((data) => setTasks(data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
    setEditingTaskId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = { title, description, dueDate, priority };

    if (editingTaskId) {
      fetch(`http://localhost:5000/api/tasks/${editingTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })
        .then((res) => res.json())
        .then((updatedTask) => {
          setTasks(tasks.map((t) => (t._id === editingTaskId ? updatedTask : t)));
          resetForm();
        })
        .catch((err) => console.error(err));
    } else {
      fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })
        .then((res) => res.json())
        .then((task) => {
          setTasks([...tasks, task]);
          resetForm();
        })
        .catch((err) => console.error(err));
    }
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter((t) => t._id !== id)))
      .catch((err) => console.error(err));
  };

  const toggleComplete = (id, completed) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) =>
        setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)))
      )
      .catch((err) => console.error(err));
  };

  const editTask = (task) => {
    setEditingTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate ? task.dueDate.slice(0, 16) : "");
    setPriority(task.priority || "Medium");
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="app-container">
      <header>
        <h1>📋 Task Manager</h1>
        <div className="nav-buttons">
          <button onClick={() => setPage("tasks")}>Tasks</button>
          <button onClick={() => setPage("productivity")}>Productivity</button>
          <button onClick={() => setPage("habits")}>Habits</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {page === "tasks" && (
        <>
          <form onSubmit={handleSubmit} className="task-form">
            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="description-box"
            />
            <div className="row">
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">⬇ Low</option>
                <option value="Medium">⬆ Medium</option>
                <option value="High">🔥 High</option>
              </select>
            </div>
            <button type="submit">{editingTaskId ? "Update Task" : "Add Task"}</button>
          </form>

          <div className="task-list">
            <h2>Tasks</h2>
            {tasks.length === 0 ? (
              <p className="no-tasks">✨ No tasks yet</p>
            ) : (
              <ul>
                {tasks.map((task) => (
                  <li key={task._id} className={task.completed ? "completed" : ""}>
                    <div>
                      <strong>{task.title}</strong> <br />
                      <small>🕒 {new Date(task.dueDate).toLocaleString()}</small>
                      <p>{task.description || "No description"}</p>
                      <span className={`priority ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="buttons">
                      <button
                        className={task.completed ? "undo-btn" : "complete-btn"}
                        onClick={() => toggleComplete(task._id, task.completed)}
                      >
                        {task.completed ? "Undo" : "Complete"}
                      </button>
                      <button className="edit-btn" onClick={() => editTask(task)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {page === "habits" && <HabitPage />}
      {page === "productivity" && (
        <ProductivityPage
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
        />
      )}
    </div>
  );
}

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <h1>Welcome to Task Manager</h1>
      <p>Organize your work and boost productivity 🚀</p>

      <button className="get-started-btn" onClick={() => navigate("/login")}>
        Get Started
      </button>
    </div>
  );
}

export default function AppWrapper() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <Router>
      <Routes>

        {/* 🌟 Default page: Welcome Screen */}
        <Route path="/" element={<WelcomePage />} />

        {/* Login & Signup */}
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected App */}
        <Route
          path="/app"
          element={
            user ? (
              <MainApp user={user} setUser={setUser} />
            ) : (
              <Login onLogin={setUser} />
            )
          }
        />

      </Routes>
    </Router>
  );
}
