import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService } from '../services/notificationService';
import './NotificationCenter.css';

function NotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef(null);

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        const initializeNotifications = async () => {
            setIsLoading(true);
            try {
                await notificationService.connect();
                setConnectionError(false);
            } catch (error) {
                console.error('Failed to connect to notification service:', error);
                setConnectionError(true);
            } finally {
                setIsLoading(false);
            }
        };

        // Connect to the notification service when component mounts
        initializeNotifications();

        // Subscribe to notifications
        const unsubscribe = notificationService.subscribe((notification) => {
            if (notification?.type === 'CONNECTION_ERROR') {
                setConnectionError(true);
                return;
            }
            setNotifications(notificationService.getNotifications());
            // Play notification sound for new notifications
            if (notification && !notification.read) {
                playNotificationSound();
            }
        });

        // Initial notifications
        setNotifications(notificationService.getNotifications());

        // Add click outside listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup on unmount
        return () => {
            unsubscribe();
            notificationService.disconnect();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(notificationService.getNotifications());
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notificationService.getNotifications());
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const handleClearAll = async () => {
        try {
            await notificationService.clearNotifications();
            setNotifications([]);
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    };

    const playNotificationSound = () => {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(error => console.error('Failed to play notification sound:', error));
    };

    const unreadCount = notificationService.getUnreadCount();

    const getNotificationIcon = (type) => {
        switch(type) {
            case 'TASK_ASSIGNED':
                return 'fas fa-tasks';
            case 'TASK_UPDATED':
                return 'fas fa-edit';
            case 'PROJECT_UPDATED':
                return 'fas fa-project-diagram';
            case 'MENTION':
                return 'fas fa-at';
            case 'DEADLINE':
                return 'fas fa-clock';
            case 'TEAM_UPDATE':
                return 'fas fa-users';
            case 'COMMENT':
                return 'fas fa-comment';
            default:
                return 'fas fa-bell';
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    };

    return (
        <div className="notification-center" ref={dropdownRef}>
            <button 
                className={`notification-trigger ${connectionError ? 'error' : ''} ${isLoading ? 'loading' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title={connectionError ? 'Connection error' : 'Notifications'}
                disabled={isLoading}
            >
                <i className={`${isLoading ? 'fas fa-spinner fa-spin' : connectionError ? 'fas fa-exclamation-circle' : 'fas fa-bell'}`}></i>
                {!connectionError && !isLoading && unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h6>Notifications</h6>
                        <div className="notification-actions">
                            {!connectionError && notifications.length > 0 && (
                                <>
                                    {unreadCount > 0 && (
                                        <button 
                                            className="mark-all-read"
                                            onClick={handleMarkAllAsRead}
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                    <button 
                                        className="clear-all"
                                        onClick={handleClearAll}
                                    >
                                        Clear all
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="notification-list">
                        {isLoading ? (
                            <div className="notification-loading">
                                <i className="fas fa-spinner fa-spin"></i>
                                <p>Loading notifications...</p>
                            </div>
                        ) : connectionError ? (
                            <div className="notification-error">
                                <i className="fas fa-exclamation-circle"></i>
                                <p>Unable to connect to notification service</p>
                                <button 
                                    className="retry-connection"
                                    onClick={() => {
                                        setConnectionError(false);
                                        notificationService.connect();
                                    }}
                                >
                                    Retry Connection
                                </button>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                    onClick={() => handleMarkAsRead(notification.id)}
                                >
                                    <div className="notification-icon">
                                        <i className={getNotificationIcon(notification.type)}></i>
                                    </div>
                                    <div className="notification-content">
                                        <p>{notification.message}</p>
                                        <small>{getTimeAgo(notification.timestamp)}</small>
                                    </div>
                                    {!notification.read && (
                                        <div className="unread-indicator"></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-notifications">
                                <i className="fas fa-check-circle"></i>
                                <p>You're all caught up!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationCenter;