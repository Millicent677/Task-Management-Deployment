import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function PrivateRoute({ children }) {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return children;
}