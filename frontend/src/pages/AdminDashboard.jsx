import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/admin.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/admin/users");
      setUsers(data.users);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await API.delete(`/admin/deleteUser/${id}`);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const makeAdmin = async (id) => {
    try {
      await API.patch(`/admin/makeAdmin/${id}`);
      await fetchUsers(); // refresh list after role update
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user role");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-buttons">
          <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>
            My Tasks
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="empty">No users found</div>
      ) : (
        <div className="user-list">
          {users.map((user) => (
            <div className="user-card" key={user._id}>
              <div className="user-info">
                <div className="user-avatar">{user.name[0]}</div>
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p className="role">Role: {user.role}</p>
                </div>
              </div>

              {/* Show Make Admin button only if user is not already admin */}

              <div className="admin-buttons">
                {user.role !== "admin" && (
                  <button
                    className="dashboard-btn"
                    onClick={() => makeAdmin(user._id)}
                  >
                    Make Admin
                  </button>
                )}
                 <button className="delete-btn" onClick={() => deleteUser(user._id)}>
                    Delete User
                  </button>
              </div>  

              <div className="task-section">
                {user.tasks && user.tasks.length > 0 ? (
                  <>
                    <p className="task-title">Tasks:</p>
                    <ul className="task-list">
                      {user.tasks.map((task) => (
                        <li key={task._id}>{task.title}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="no-tasks">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
