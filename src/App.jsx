/**
 * Main application component with routing.
 * Sets up React Router routes and provides authentication context.
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './shared/context/AuthContext.jsx';
import ProtectedRoute from './shared/components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import WatchlistPage from './features/watchlist/WatchlistPage.jsx';

/**
 * Root application component.
 * Configures routes and wraps app in authentication provider.
 * 
 * @returns {JSX.Element} Application with routing
 */
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <WatchlistPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
