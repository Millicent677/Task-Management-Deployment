import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';

function TeamManagement({ projectId, onClose }) {
    const [members, setMembers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const [membersResponse, usersResponse] = await Promise.all([
                projectService.getProjectMembers(projectId),
                projectService.getAvailableUsers()
            ]);
            setMembers(membersResponse.data);
            setAvailableUsers(usersResponse.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!selectedUserId) return;
        
        try {
            await projectService.addMember(projectId, selectedUserId);
            setSelectedUserId('');
            fetchData();
        } catch (err) {
            setError('Failed to add team member');
        }
    };

    const handleRemoveMember = async (userId) => {
        try {
            await projectService.removeMember(projectId, userId);
            fetchData();
        } catch (err) {
            setError('Failed to remove team member');
        }
    };

    if (!projectId) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Team Management</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleAddMember} className="mb-4">
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {availableUsers
                                        .filter(user => !members.find(member => member.id === user.id))
                                        .map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.username} ({user.email})
                                            </option>
                                        ))
                                    }
                                </select>
                                <button type="submit" className="btn btn-primary" disabled={!selectedUserId}>
                                    Add Member
                                </button>
                            </div>
                        </form>

                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <div className="list-group">
                                {members.map(member => (
                                    <div key={member.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-0">{member.username}</h6>
                                            <small className="text-muted">{member.email}</small>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleRemoveMember(member.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                {members.length === 0 && (
                                    <div className="text-center text-muted py-3">
                                        No team members yet
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamManagement;