import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../styles/pages.css";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Tried to access", location.pathname);
  }, [location.pathname]);

  return (
    <div className="page-container">
      <div className="content-box">
        <h1 className="title">404</h1>
        <p className="subtitle">Oops! Page not found</p>
        <a href="/" className="link">
          Return to Home
        </a>
      </div>
    </div>
  );
}
