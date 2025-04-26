import api from './api';

const handleError = (error) => {
    if (error.response?.data) {
        throw new Error(error.response.data.detail || error.response.data.error || 'Operation failed');
    }
    throw error;
};

export const taskService = {
    getAll: async () => {
        try {
            return await api.get('/api/tasks/');
        } catch (error) {
            throw handleError(error);
        }
    },

    getById: async (id) => {
        try {
            return await api.get(`/api/tasks/${id}/`);
        } catch (error) {
            throw handleError(error);
        }
    },

    create: async (data) => {
        try {
            return await api.post('/api/tasks/', data);
        } catch (error) {
            throw handleError(error);
        }
    },

    update: async (id, data) => {
        try {
            return await api.put(`/api/tasks/${id}/`, data);
        } catch (error) {
            throw handleError(error);
        }
    },

    delete: async (id) => {
        try {
            return await api.delete(`/api/tasks/${id}/`);
        } catch (error) {
            throw handleError(error);
        }
    },

    getByProject: async (projectId) => {
        try {
            return await api.get(`/api/tasks/?project=${projectId}`);
        } catch (error) {
            throw handleError(error);
        }
    },

    assignTask: async (taskId, userId) => {
        try {
            return await api.post(`/api/tasks/${taskId}/assign/`, { user_id: userId });
        } catch (error) {
            throw handleError(error);
        }
    },

    removeAssignee: async (taskId, userId) => {
        try {
            return await api.post(`/api/tasks/${taskId}/remove_assignee/`, { user_id: userId });
        } catch (error) {
            throw handleError(error);
        }
    },

    updateStatus: async (taskId, status) => {
        try {
            return await api.patch(`/api/tasks/${taskId}/`, { status });
        } catch (error) {
            throw handleError(error);
        }
    },

    updatePriority: async (taskId, priority) => {
        try {
            return await api.patch(`/api/tasks/${taskId}/`, { priority });
        } catch (error) {
            throw handleError(error);
        }
    },

    getMyTasks: async () => {
        try {
            return await api.get('/api/tasks/my_tasks/');
        } catch (error) {
            throw handleError(error);
        }
    },

    getAssignedTasks: async () => {
        try {
            return await api.get('/api/tasks/assigned/');
        } catch (error) {
            throw handleError(error);
        }
    }
};