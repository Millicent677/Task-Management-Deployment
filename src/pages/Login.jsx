import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await authService.login(formData.username, formData.password);
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                await authService.register(formData.username, formData.email, formData.password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <i className="fas fa-tasks fa-2x"></i>
                    <h2>Task Manager</h2>
                    <p>{isLogin ? "Sign in to your account" : "Create your account"}</p>
                </div>

                {error && (
                    <ErrorMessage 
                        error={error} 
                        onRetry={() => setError(null)}
                    />
                )}

                <div className="auth-toggle">
                    <button
                        type="button"
                        className={isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(true)}
                    >
                        <i className="fas fa-sign-in-alt"></i> Sign In
                    </button>
                    <button
                        type="button"
                        className={!isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(false)}
                    >
                        <i className="fas fa-user-plus"></i> Register
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">
                            <i className="fas fa-user"></i> Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="email">
                                <i className="fas fa-envelope"></i> Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">
                            <i className="fas fa-lock"></i> Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                <i className="fas fa-lock"></i> Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                        )}
                        {isLogin ? ' Sign In' : ' Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}