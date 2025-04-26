import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import NotificationCenter from '../components/NotificationCenter';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [projectsResponse, tasksResponse] = await Promise.all([
                projectService.getAll(),
                taskService.getAll()
            ]);
            
            setProjects(projectsResponse.data);
            setTasks(tasksResponse.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            setLoading(false);
        }
    };

    const calculateTaskStats = () => {
        const stats = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            acc.total++;
            return acc;
        }, { total: 0 });

        return {
            todo: stats['TODO'] || 0,
            inProgress: stats['IN_PROGRESS'] || 0,
            completed: stats['DONE'] || 0,
            total: stats.total,
            completionRate: stats.total ? Math.round((stats['DONE'] || 0) / stats.total * 100) : 0
        };
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner">
                    <i className="fas fa-circle-notch fa-spin"></i>
                </div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <ErrorMessage 
                    error={error}
                    onRetry={fetchDashboardData}
                />
            </div>
        );
    }

    const taskStats = calculateTaskStats();

    return (
        <div className="dashboard-wrapper">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h2>Dashboard</h2>
                    <p className="greeting">Welcome back! Here's your progress today</p>
                </div>
                <div className="header-actions">
                    <NotificationCenter />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="dashboard-stats">
                <div className="stat-card primary">
                    <div className="stat-icon">
                        <i className="fas fa-tasks"></i>
                    </div>
                    <div className="stat-details">
                        <h4>Total Tasks</h4>
                        <p>{taskStats.total}</p>
                        <div className="stat-progress">
                            <div className="progress">
                                <div 
                                    className="progress-bar" 
                                    style={{ width: `${taskStats.completionRate}%` }}
                                ></div>
                            </div>
                            <span>{taskStats.completionRate}% Complete</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card todo">
                    <div className="stat-icon">
                        <i className="fas fa-clipboard-list"></i>
                    </div>
                    <div className="stat-details">
                        <h4>To Do</h4>
                        <p>{taskStats.todo}</p>
                    </div>
                </div>

                <div className="stat-card in-progress">
                    <div className="stat-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-details">
                        <h4>In Progress</h4>
                        <p>{taskStats.inProgress}</p>
                    </div>
                </div>

                <div className="stat-card completed">
                    <div className="stat-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-details">
                        <h4>Completed</h4>
                        <p>{taskStats.completed}</p>
                    </div>
                </div>
            </div>

            {/* Recent Projects */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h3>
                        <i className="fas fa-folder"></i>
                        Recent Projects
                    </h3>
                    <a href="/projects" className="view-all">
                        View All <i className="fas fa-arrow-right"></i>
                    </a>
                </div>
                <div className="dashboard-grid">
                    {projects.slice(0, 3).map(project => (
                        <div key={project.id} className="project-card" data-priority={project.priority?.toLowerCase()}>
                            <div className="project-card-content">
                                <div className="project-header">
                                    <h4>{project.name}</h4>
                                    <span className={`status-badge ${project.status.toLowerCase()}`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="project-description">{project.description}</p>
                                <div className="project-meta">
                                    <span>
                                        <i className="fas fa-users"></i>
                                        {project.member_count} Members
                                    </span>
                                    <span>
                                        <i className="fas fa-tasks"></i>
                                        {project.task_count} Tasks
                                    </span>
                                </div>
                                <div className="project-progress">
                                    <div className="progress">
                                        <div 
                                            className="progress-bar"
                                            style={{ 
                                                width: `${(tasks.filter(t => 
                                                    t.project === project.id && 
                                                    t.status === 'DONE'
                                                ).length / (tasks.filter(t => 
                                                    t.project === project.id
                                                ).length || 1)) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Tasks */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h3>
                        <i className="fas fa-check-square"></i>
                        Recent Tasks
                    </h3>
                    <a href="/tasks" className="view-all">
                        View All <i className="fas fa-arrow-right"></i>
                    </a>
                </div>
                <div className="tasks-list">
                    {tasks.slice(0, 5).map(task => (
                        <div key={task.id} className="task-item" data-priority={task.priority?.toLowerCase()}>
                            <div className="task-content">
                                <div className="task-title">
                                    <h5>{task.title}</h5>
                                    <span className={`status-badge ${task.status.toLowerCase()}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <p className="task-project">
                                    <i className="fas fa-folder"></i>
                                    {task.project_name || 'No Project'}
                                </p>
                                {task.due_date && (
                                    <div className="task-due-date">
                                        <i className="fas fa-calendar"></i>
                                        Due: {new Date(task.due_date).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                            <div className="task-assignees">
                                {task.assignee_details?.map((assignee, index) => (
                                    <span 
                                        key={`${task.id}-${assignee.id}`}
                                        className="assignee-avatar"
                                        title={assignee.username}
                                        style={{ zIndex: 5 - index }}
                                    >
                                        {assignee.username[0].toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}