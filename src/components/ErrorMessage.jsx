import React from 'react';
import './ErrorMessage.css';

export default function ErrorMessage({ error, onRetry }) {
    return (
        <div className="error-container">
            <div className="error-content">
                <i className="fas fa-exclamation-circle error-icon"></i>
                <p className="error-text">{error}</p>
                {onRetry && (
                    <button className="retry-button" onClick={onRetry}>
                        <i className="fas fa-redo"></i> Retry
                    </button>
                )}
            </div>
        </div>
    );
}