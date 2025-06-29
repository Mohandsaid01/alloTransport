import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Accueil from './pages/Accueil';
import Horaires from './pages/Horaires';
import SignalerIncident from './pages/SignalerIncident';
import DashboardClient from './pages/DashboardClient';
import DashboardAgent from './pages/DashboardAgent';
import DashboardAdmin from './pages/DashboardAdmin';
import { AuthProvider } from './auth/AuthContext'; 
import Lignes from './pages/Lignes';
import Arrets from './pages/Arrets';

const App = () => {
  return (
    <AuthProvider> {/* Contexte disponible partout */}
      <Routes>
        {/* Routes publiques avec Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/horaires" element={<Horaires />} />
          <Route path="/horaires/:mode" element={<Lignes />} />
          <Route path="/horaires/:mode/:routeId" element={<Arrets />} />  
          <Route path="/signaler" element={<SignalerIncident />} />
        </Route>

        {/* Dashboards */}
        <Route path="/dashboard/client" element={<DashboardClient />} />
        <Route path="/dashboard/agent" element={<DashboardAgent />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
