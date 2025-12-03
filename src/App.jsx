import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage.jsx';
import WatchlistPage from './pages/WatchlistPage.jsx';

/**
 * Main application component with routing
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/watchlist" element={<WatchlistPage />} />
    </Routes>
  );
}

export default App;
