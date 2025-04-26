import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';

export default function MyTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            // Assuming the API filters by assigned user automatically based on auth token
            const response = await taskService.getAll();
            setTasks(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch your tasks');
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await taskService.updateStatus(taskId, newStatus);
            fetchMyTasks(); // Refresh the list
        } catch (err) {
            setError('Failed to update task status');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h2>My Tasks</h2>
            <div className="row mt-3">
                {tasks.map(task => (
                    <div key={task.id} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{task.title}</h5>
                                <p className="card-text">{task.description}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="badge bg-primary">{task.project_name}</span>
                                    <select 
                                        className="form-select form-select-sm w-50"
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="col-12">
                        <p className="text-center">You don't have any tasks assigned yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}