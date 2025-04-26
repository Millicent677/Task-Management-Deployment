import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import TaskModal from './TaskModal';

function ProjectTasksView({ projectId, onClose }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            const response = await taskService.getByProject(projectId);
            setTasks(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch project tasks');
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            await taskService.create({ ...taskData, project: projectId });
            fetchTasks();
            setShowTaskModal(false);
        } catch (err) {
            setError('Failed to create task');
        }
    };

    const handleEditTask = async (taskData) => {
        try {
            await taskService.update(selectedTask.id, taskData);
            fetchTasks();
            setShowTaskModal(false);
            setSelectedTask(null);
        } catch (err) {
            setError('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.delete(taskId);
                fetchTasks();
            } catch (err) {
                setError('Failed to delete task');
            }
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await taskService.updateStatus(taskId, newStatus);
            fetchTasks();
        } catch (err) {
            setError('Failed to update task status');
        }
    };

    if (!projectId) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Project Tasks</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="d-flex justify-content-between mb-3">
                            <h6>Tasks List</h6>
                            <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                    setSelectedTask(null);
                                    setShowTaskModal(true);
                                }}
                            >
                                <i className="bi bi-plus"></i> New Task
                            </button>
                        </div>

                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <div className="list-group">
                                {tasks.map(task => (
                                    <div key={task.id} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">{task.title}</h6>
                                                <p className="mb-1 text-muted small">{task.description}</p>
                                                <div className="task-meta">
                                                    <span className={`badge bg-${
                                                        task.priority === 'HIGH' ? 'danger' :
                                                        task.priority === 'MEDIUM' ? 'warning' : 'info'
                                                    } me-2`}>
                                                        {task.priority}
                                                    </span>
                                                    {task.due_date && (
                                                        <small className="text-muted">
                                                            Due: {new Date(task.due_date).toLocaleDateString()}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    style={{ width: 'auto' }}
                                                >
                                                    <option value="TODO">To Do</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="DONE">Done</option>
                                                </select>
                                                <div className="dropdown">
                                                    <button className="btn btn-link btn-sm" data-bs-toggle="dropdown">
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => {
                                                                    setSelectedTask(task);
                                                                    setShowTaskModal(true);
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
                                        </div>
                                    </div>
                                ))}
                                {tasks.length === 0 && (
                                    <div className="text-center text-muted py-3">
                                        No tasks found for this project
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Task Modal */}
            <TaskModal
                show={showTaskModal}
                onHide={() => {
                    setShowTaskModal(false);
                    setSelectedTask(null);
                }}
                onSave={selectedTask ? handleEditTask : handleCreateTask}
                initialTask={selectedTask}
            />
        </div>
    );
}

export default ProjectTasksView;