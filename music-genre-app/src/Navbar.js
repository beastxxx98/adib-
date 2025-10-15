import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px 30px", background: "#2b7bff", color: "white" }}>
      <h3>Music Genre App</h3>
      <button onClick={handleLogout} style={{ background: "white", color: "#2b7bff", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer" }}>
        Logout
      </button>
    </nav>
  );
}
