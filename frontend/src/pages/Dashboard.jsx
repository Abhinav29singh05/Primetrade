import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("to-do"); // 👈 track new task status
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/tasks");
      setTasks(data.tasks);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await API.get("/users/me"); 
      setUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUser(); 
  }, []);

  const addTask = async () => {
    try {
      if (!newTask.trim()) return;
      await API.post("/tasks", { title: newTask, description: newDescription, status: newStatus });
      setNewTask("");
      setNewDescription("");
      setNewStatus("to-do");
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <div className="dashboard-buttons">
          {user?.role === "admin" && (
            <button className="dashboard-btn" onClick={() => navigate("/admin")}>
              Go to Admin
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Add New Task */}
      <div className="task-input">
        <input
          className="task-input-field"
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task..."
        />
        <input
          className="task-input-field"
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Enter description..."
        />
        <select   className="status-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty">No tasks yet. Add your first task!</div>
      ) : (
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t._id} className="task-item">
              <div className="task-content">
                <div className="task-title">{t.title}</div>
                {t.description && <div className="task-description">{t.description}</div>}

                {/* Status dropdown */}
                <select
                  className="status-select"
                  value={t.status}
                  onChange={(e) => updateStatus(t._id, e.target.value)}
                >
                  <option value="to-do">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button className="delete-btn" onClick={() => deleteTask(t._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
