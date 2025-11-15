import React from "react";
import "./logout.css";

export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="logout-container">
      <div className="logout-card">
        <h2>Logout</h2>
        <p>Are you sure you want to log out from Music Genre Predictor?</p>
        <button className="logout-button" onClick={handleLogout}>
          Confirm Logout
        </button>
        <div className="logout-footer">
        </div>
      </div>
    </div>
  );
}
