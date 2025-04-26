import api from './api';

const handleError = (error) => {
    if (error.response?.data) {
        throw new Error(error.response.data.detail || error.response.data.error || 'Operation failed');
    }
    throw error;
};

export const projectService = {
    getAll: async () => {
        try {
            return await api.get('/api/projects/');
        } catch (error) {
            throw handleError(error);
        }
    },

    getById: async (id) => {
        try {
            return await api.get(`/api/projects/${id}/`);
        } catch (error) {
            throw handleError(error);
        }
    },

    create: async (data) => {
        try {
            return await api.post('/api/projects/', data);
        } catch (error) {
            throw handleError(error);
        }
    },

    update: async (id, data) => {
        try {
            return await api.put(`/api/projects/${id}/`, data);
        } catch (error) {
            throw handleError(error);
        }
    },

    delete: async (id) => {
        try {
            return await api.delete(`/api/projects/${id}/`);
        } catch (error) {
            throw handleError(error);
        }
    },

    addMember: async (projectId, userId) => {
        try {
            return await api.post(`/api/projects/${projectId}/add_member/`, { user_id: userId });
        } catch (error) {
            throw handleError(error);
        }
    },

    removeMember: async (projectId, userId) => {
        try {
            return await api.post(`/api/projects/${projectId}/remove_member/`, { user_id: userId });
        } catch (error) {
            throw handleError(error);
        }
    },

    getProjectTasks: async (projectId) => {
        try {
            return await api.get(`/api/tasks/?project=${projectId}`);
        } catch (error) {
            throw handleError(error);
        }
    },

    getProjectMembers: async (projectId) => {
        try {
            return await api.get(`/api/projects/${projectId}/members/`);
        } catch (error) {
            throw handleError(error);
        }
    },

    getAvailableUsers: async () => {
        try {
            return await api.get('/api/users/');
        } catch (error) {
            throw handleError(error);
        }
    }
};