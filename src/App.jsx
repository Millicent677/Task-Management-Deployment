import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import MyTasks from './pages/MyTasks'
import Tasks from './pages/Tasks'
import Projects from './pages/Projects'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import NotificationCenter from './components/NotificationCenter'
import { authService } from './services/authService'
import './App.css'

function App() {
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="dashboard-container">
                {/* Sidebar */}
                <div className="sidebar">
                  <div className="sidebar-header">
                    <h3>Task Manager</h3>
                  </div>
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/" end>
                        <i className="fas fa-home"></i>
                        Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/my-tasks">
                        <i className="fas fa-check-square"></i>
                        My Tasks
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/tasks">
                        <i className="fas fa-tasks"></i>
                        Tasks
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/projects">
                        <i className="fas fa-folder"></i>
                        Projects
                      </NavLink>
                    </li>
                  </ul>
                  <div className="sidebar-footer">
                    <button 
                      className="nav-link logout-btn" 
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="main-container">
                  <div className="main-header">
                    <div className="header-actions">
                      <NotificationCenter />
                      <div className="divider"></div>
                    </div>
                  </div>
                  <div className="main-content">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/my-tasks" element={<MyTasks />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/projects" element={<Projects />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
