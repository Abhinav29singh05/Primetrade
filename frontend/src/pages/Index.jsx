import { useNavigate } from "react-router-dom";
import "../styles/pages.css";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="page-container ">
      <div className="content-box">
        <h1 className="title">Task Management System</h1>
        <p className="subtitle">
          A simple and clean dashboard to manage your tasks and users
        </p>
        <div className="button-group">
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
