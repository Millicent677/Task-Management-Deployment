import { useState, useEffect } from 'react';

function ProjectModal({ show, onHide, onSave, initialProject = null }) {
    const [project, setProject] = useState({
        name: '',
        description: '',
        start_date: '',
        due_date: '',
        status: 'NOT_STARTED',
        priority: 'MEDIUM'
    });

    useEffect(() => {
        if (initialProject) {
            setProject({
                ...initialProject,
                start_date: initialProject.start_date ? new Date(initialProject.start_date).toISOString().split('T')[0] : '',
                due_date: initialProject.due_date ? new Date(initialProject.due_date).toISOString().split('T')[0] : ''
            });
        } else {
            setProject({
                name: '',
                description: '',
                start_date: '',
                due_date: '',
                status: 'NOT_STARTED',
                priority: 'MEDIUM'
            });
        }
    }, [initialProject]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(project);
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {initialProject ? 'Edit Project' : 'New Project'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="projectName" className="form-label">Project Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="projectName"
                                    value={project.name}
                                    onChange={(e) => setProject({ ...project, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="projectDescription" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    id="projectDescription"
                                    value={project.description}
                                    onChange={(e) => setProject({ ...project, description: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="projectStatus" className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        id="projectStatus"
                                        value={project.status}
                                        onChange={(e) => setProject({ ...project, status: e.target.value })}
                                    >
                                        <option value="NOT_STARTED">Not Started</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="ON_HOLD">On Hold</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                                <div className="col">
                                    <label htmlFor="projectPriority" className="form-label">Priority</label>
                                    <select
                                        className="form-select"
                                        id="projectPriority"
                                        value={project.priority}
                                        onChange={(e) => setProject({ ...project, priority: e.target.value })}
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="projectStartDate" className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="projectStartDate"
                                        value={project.start_date}
                                        onChange={(e) => setProject({ ...project, start_date: e.target.value })}
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="projectDueDate" className="form-label">Due Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="projectDueDate"
                                        value={project.due_date}
                                        onChange={(e) => setProject({ ...project, due_date: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onHide}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {initialProject ? 'Save Changes' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProjectModal;