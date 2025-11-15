import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './Signup';
import Login from './login';
import Logout from './Logout';
import GenrePredict from './GenrePredict';
import './App.css';

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/logout">Logout</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <div className="music-icon">🎧</div>
                <h1>Welcome to Music Genre Predictor</h1>
                <p>
                  Discover the magic of sound — Enter your audio files then our  app tell you what genre it belongs to!
                </p>
                <button onClick={() => (window.location.href = '/login')}>
                  Get Started
                </button>
              </header>
            </div>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/predict" element={<GenrePredict />} />
      </Routes>
    </Router>
  );
}

export default App;
