import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import { AuthProvider } from './auth/AuthContext';
import DashboardClient from './pages/DashboardClient';






const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />

<Route path="/dashboard/client" element={<DashboardClient />} />
        <Route path="/dashboard/agent" element={<div>Dashboard Agent (à faire)</div>} />
        <Route path="/dashboard/admin" element={<div>Dashboard Admin (à faire)</div>} />
      </Routes>
    </AuthProvider>
  );
};
export default App;
