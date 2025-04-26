import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';

function TaskModal({ show, onHide, onSave, initialTask = null }) {
    const [task, setTask] = useState({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        due_date: '',
        project: null,
        assignees: []
    });
    const [projects, setProjects] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (initialTask) {
            setTask({
                ...initialTask,
                due_date: initialTask.due_date ? new Date(initialTask.due_date).toISOString().split('T')[0] : '',
                project: initialTask.project || null,
                assignees: initialTask.assignees || []
            });
            if (initialTask.project) {
                fetchProjectMembers(initialTask.project);
            }
        } else {
            setTask({
                title: '',
                description: '',
                status: 'TODO',
                priority: 'MEDIUM',
                due_date: '',
                project: null,
                assignees: []
            });
        }
    }, [initialTask]);

    const fetchProjects = async () => {
        try {
            const response = await projectService.getAll();
            setProjects(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch projects');
            setLoading(false);
        }
    };

    const fetchProjectMembers = async (projectId) => {
        if (!projectId) {
            setProjectMembers([]);
            return;
        }
        try {
            const response = await projectService.getProjectMembers(projectId);
            setProjectMembers(response.data);
        } catch (err) {
            setError('Failed to fetch project members');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(task);
    };

    const handleProjectChange = (e) => {
        const projectId = e.target.value;
        setTask({ ...task, project: projectId });
        fetchProjectMembers(projectId);
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {initialTask ? 'Edit Task' : 'New Task'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="mb-3">
                                <label htmlFor="taskTitle" className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="taskTitle"
                                    value={task.title}
                                    onChange={(e) => setTask({ ...task, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="taskDescription" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    id="taskDescription"
                                    value={task.description}
                                    onChange={(e) => setTask({ ...task, description: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="taskStatus" className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        id="taskStatus"
                                        value={task.status}
                                        onChange={(e) => setTask({ ...task, status: e.target.value })}
                                    >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                                <div className="col">
                                    <label htmlFor="taskPriority" className="form-label">Priority</label>
                                    <select
                                        className="form-select"
                                        id="taskPriority"
                                        value={task.priority}
                                        onChange={(e) => setTask({ ...task, priority: e.target.value })}
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="taskProject" className="form-label">Project</label>
                                <select
                                    className="form-select"
                                    id="taskProject"
                                    value={task.project || ''}
                                    onChange={handleProjectChange}
                                >
                                    <option value="">No Project</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="taskAssignees" className="form-label">Assignees</label>
                                <select
                                    className="form-select"
                                    id="taskAssignees"
                                    value={task.assignees}
                                    onChange={(e) => {
                                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                        setTask({ ...task, assignees: selectedOptions });
                                    }}
                                    multiple
                                >
                                    {projectMembers.map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.username}
                                        </option>
                                    ))}
                                </select>
                                <small className="form-text text-muted">
                                    Hold Ctrl (Windows) or Command (Mac) to select multiple assignees
                                </small>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="taskDueDate" className="form-label">Due Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="taskDueDate"
                                    value={task.due_date}
                                    onChange={(e) => setTask({ ...task, due_date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onHide}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {initialTask ? 'Save Changes' : 'Create Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TaskModal;