import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import TaskModal from '../components/TaskModal';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filter, setFilter] = useState({ status: 'all', project: 'all' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tasksResponse, projectsResponse] = await Promise.all([
                taskService.getAll(),
                projectService.getAll()
            ]);
            setTasks(tasksResponse.data);
            setProjects(projectsResponse.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            await taskService.create(taskData);
            fetchData();
            setShowModal(false);
        } catch (err) {
            setError('Failed to create task');
        }
    };

    const handleEditTask = async (taskData) => {
        try {
            await taskService.update(selectedTask.id, taskData);
            fetchData();
            setShowModal(false);
            setSelectedTask(null);
        } catch (err) {
            setError('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.delete(taskId);
                fetchData();
            } catch (err) {
                setError('Failed to delete task');
            }
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await taskService.updateStatus(taskId, newStatus);
            fetchData();
        } catch (err) {
            setError('Failed to update task status');
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter.status !== 'all' && task.status !== filter.status) return false;
        if (filter.project !== 'all' && task.project !== filter.project) return false;
        return true;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Tasks</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        setSelectedTask(null);
                        setShowModal(true);
                    }}
                >
                    <i className="bi bi-plus"></i> New Task
                </button>
            </div>

            {/* Filters */}
            <div className="task-filters mb-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <select 
                            className="form-select"
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        >
                            <option value="all">All Statuses</option>
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select 
                            className="form-select"
                            value={filter.project}
                            onChange={(e) => setFilter({ ...filter, project: e.target.value })}
                        >
                            <option value="all">All Projects</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="row">
                {filteredTasks.map(task => (
                    <div key={task.id} className="col-md-4 mb-3">
                        <div className="task-card" data-priority={task.priority?.toLowerCase()}>
                            <div className="task-card-header">
                                <h5>{task.title}</h5>
                                <div className="dropdown">
                                    <button className="btn btn-link" data-bs-toggle="dropdown">
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <button 
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Edit
                                            </button>
                                        </li>
                                        <li>
                                            <button 
                                                className="dropdown-item text-danger"
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="task-card-body">
                                <p>{task.description}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="badge bg-secondary">{projects.find(p => p.id === task.project)?.name || 'No Project'}</span>
                                    <select 
                                        className="form-select form-select-sm w-auto"
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                            </div>
                            {task.due_date && (
                                <div className="task-card-footer">
                                    <small className="text-muted">
                                        <i className="bi bi-calendar"></i> Due: {new Date(task.due_date).toLocaleDateString()}
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <TaskModal 
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setSelectedTask(null);
                }}
                onSave={selectedTask ? handleEditTask : handleCreateTask}
                initialTask={selectedTask}
                projects={projects}
            />
        </div>
    );
}