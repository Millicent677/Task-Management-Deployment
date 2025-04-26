import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import ProjectModal from '../components/ProjectModal';
import TeamManagement from '../components/TeamManagement';
import ProjectTasksView from '../components/ProjectTasksView';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [showTasksModal, setShowTasksModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

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

    const handleCreateProject = async (projectData) => {
        try {
            await projectService.create(projectData);
            fetchProjects();
            setShowProjectModal(false);
        } catch (err) {
            setError('Failed to create project');
        }
    };

    const handleEditProject = async (projectData) => {
        try {
            await projectService.update(selectedProject.id, projectData);
            fetchProjects();
            setShowProjectModal(false);
            setSelectedProject(null);
        } catch (err) {
            setError('Failed to update project');
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.delete(projectId);
                fetchProjects();
            } catch (err) {
                setError('Failed to delete project');
            }
        }
    };

    const handleProjectTeam = (project) => {
        setSelectedProject(project);
        setShowTeamModal(true);
    };

    const handleProjectTasks = (project) => {
        setSelectedProject(project);
        setShowTasksModal(true);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Projects</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        setSelectedProject(null);
                        setShowProjectModal(true);
                    }}
                >
                    <i className="bi bi-plus"></i> New Project
                </button>
            </div>

            <div className="project-grid">
                {projects.map(project => (
                    <div key={project.id} className="project-card" data-priority={project.priority?.toLowerCase()}>
                        <div className="project-card-header">
                            <h4>{project.name}</h4>
                            <div className="dropdown">
                                <button className="btn btn-link" data-bs-toggle="dropdown">
                                    <i className="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button 
                                            className="dropdown-item"
                                            onClick={() => {
                                                setSelectedProject(project);
                                                setShowProjectModal(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className="dropdown-item text-danger"
                                            onClick={() => handleDeleteProject(project.id)}
                                        >
                                            Delete
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="project-card-body">
                            <p>{project.description}</p>
                            <div className="project-meta">
                                <span><i className="bi bi-calendar"></i> {new Date(project.created_at).toLocaleDateString()}</span>
                                <span><i className="bi bi-people"></i> {project.member_count || 0} members</span>
                            </div>
                            {project.status && (
                                <div className="mb-2">
                                    <span className={`badge bg-${
                                        project.status === 'COMPLETED' ? 'success' :
                                        project.status === 'IN_PROGRESS' ? 'primary' :
                                        project.status === 'ON_HOLD' ? 'warning' : 'secondary'
                                    }`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="project-card-actions">
                            <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleProjectTasks(project)}
                            >
                                <i className="bi bi-list-task"></i> Tasks
                            </button>
                            <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleProjectTeam(project)}
                            >
                                <i className="bi bi-people"></i> Team
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Project Modal */}
            <ProjectModal 
                show={showProjectModal}
                onHide={() => {
                    setShowProjectModal(false);
                    setSelectedProject(null);
                }}
                onSave={selectedProject ? handleEditProject : handleCreateProject}
                initialProject={selectedProject}
            />

            {/* Team Management Modal */}
            {showTeamModal && selectedProject && (
                <TeamManagement 
                    projectId={selectedProject.id}
                    onClose={() => {
                        setShowTeamModal(false);
                        setSelectedProject(null);
                        fetchProjects(); // Refresh project list to update member count
                    }}
                />
            )}

            {/* Project Tasks Modal */}
            {showTasksModal && selectedProject && (
                <ProjectTasksView
                    projectId={selectedProject.id}
                    onClose={() => {
                        setShowTasksModal(false);
                        setSelectedProject(null);
                        fetchProjects(); // Refresh project list to update tasks
                    }}
                />
            )}
        </div>
    );
}