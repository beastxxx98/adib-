// src/ProductivityPage.js
import React, { useState } from "react";
import "./ProductivityPage.css";

export default function ProductivityPage({ totalTasks, completedTasks, pendingTasks }) {
  // States for app usage input
  const [youtubeTime, setYoutubeTime] = useState(0);
  const [facebookTime, setFacebookTime] = useState(0);
  const [instagramTime, setInstagramTime] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  // Healthy limits (minutes per day)
  const LIMITS = {
    youtube: 60,
    facebook: 30,
    instagram: 30,
  };

  // Analyze usage and generate suggestions
  const analyzeUsage = () => {
    const newSuggestions = [];

    if (youtubeTime > LIMITS.youtube) {
      newSuggestions.push("⚠️ YouTube overuse may affect your productivity.");
    } else {
      newSuggestions.push("✅ Great! YouTube usage is healthy.");
    }

    if (facebookTime > LIMITS.facebook) {
      newSuggestions.push("⚠️ Too much Facebook today. Try limiting scrolling.");
    } else {
      newSuggestions.push("✅ Facebook usage is under control.");
    }

    if (instagramTime > LIMITS.instagram) {
      newSuggestions.push("⚠️ Instagram usage exceeded healthy limits.");
    } else {
      newSuggestions.push("✅ Instagram usage is balanced.");
    }

    setSuggestions(newSuggestions);
  };

  const apps = [
    { name: "YouTube", value: youtubeTime, setter: setYoutubeTime, color: "#ff4c4c" },
    { name: "Facebook", value: facebookTime, setter: setFacebookTime, color: "#3b5998" },
    { name: "Instagram", value: instagramTime, setter: setInstagramTime, color: "#e1306c" },
  ];

  return (
    <div className="productivity-page">
      <h2>📊 Productivity Insights</h2>

      {/* Task Stats */}
      <div className="stats">
        <p>Total Tasks: {totalTasks}</p>
        <p>✅ Completed Tasks: {completedTasks}</p>
        <p>⌛ Pending Tasks: {pendingTasks}</p>
      </div>

      {/* App Usage Input */}
      <div className="usage-form">
        <h3>📱 Track App Usage (minutes)</h3>
        {apps.map((app) => (
          <input
            key={app.name}
            type="number"
            placeholder={`${app.name} minutes`}
            value={app.value}
            onChange={(e) => app.setter(Number(e.target.value))}
          />
        ))}
        <button onClick={analyzeUsage}>Analyze</button>
      </div>

      {/* Custom Bars */}
      <div className="chart-box">
        {apps.map((app) => (
          <div key={app.name} className="bar-container">
            <div
              className="bar-fill"
              style={{ height: `${Math.min(app.value, 120)}px`, background: app.color }}
            ></div>
            <p>{app.name}</p>
            <p>{app.value} min</p>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="suggestions">
        <h3>💡 Suggestions</h3>
        <ul>
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
