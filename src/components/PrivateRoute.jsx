// src/components/PrivateRoute.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoginPage from './LoginPage.jsx';

function PrivateRoute({ children }) {
    const { user, isLoading } = useAuth();

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16 animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Caricamento...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, show login page
    if (!user) {
        return <LoginPage />;
    }

    // If authenticated, show the protected content
    return children;
}

export default PrivateRoute;