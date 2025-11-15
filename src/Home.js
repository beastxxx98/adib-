import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") navigate("/");
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>🎵 Welcome to Music Genre App</h2>
    </div>
  );
}
