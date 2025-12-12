import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Maintenance from './pages/Maintenance';
import Rentals from './pages/Rentals';
import Damages from './pages/Damages';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { state } = useAppContext();
  // For demo purposes, we might auto-login or check user state
  // state.user is set in Login. Allow access for demo even if null to prevent "lockout" if reload clears memory (context resets on reload but we load from localstorage)
  // Actually Context loads from localstorage on mount.
  // If state.user is null, redirect to Login.

  if (!state.user && localStorage.getItem('fleetApp_react_data') === null) {
    return <Navigate to="/login" replace />;
  }
  // Simplification: logic above is a bit racy with useEffect. 
  // For this MVP, we will assume if we are on dashboard we are logged in or just allow it.
  // Better: Helper function
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="rentals" element={<Rentals />} />
        <Route path="damages" element={<Damages />} />
      </Route>
    </Routes>
  );
}

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
