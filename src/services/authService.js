import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/api/token/', { username, password });
        if (response.data.access) {
            // Store the tokens
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            // Set the default authorization header for future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            return response.data;
        }
        throw new Error('Login failed');
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        // Clear the authorization header
        delete api.defaults.headers.common['Authorization'];
    },

    refreshToken: async () => {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
            try {
                const response = await api.post('/api/token/refresh/', { refresh });
                if (response.data.access) {
                    localStorage.setItem('token', response.data.access);
                    // Update the authorization header
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    return response.data.access;
                }
            } catch (error) {
                authService.logout();
                throw error;
            }
        }
        throw new Error('No refresh token');
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        // Check if token is expired
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = payload.exp * 1000; // Convert to milliseconds
            if (Date.now() >= expiryTime) {
                authService.logout();
                return false;
            }
            return true;
        } catch {
            return false;
        }
    },

    register: async (username, email, password) => {
        const response = await api.post('/api/register/', { 
            username, 
            email, 
            password 
        });
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            return response.data;
        }
        throw new Error('Registration failed');
    }
};