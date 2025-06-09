import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import { AuthProvider } from './auth/AuthContext';
import DashboardClient from './pages/DashboardClient';
import DashboardAgent from './pages/DashboardAgent';
import DashboardAdmin from './pages/DashboardAdmin';
import SignalerIncident from './pages/SignalerIncident';
import Horaires from './pages/Horaires';


const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/dashboard/client" element={<DashboardClient />} />
        <Route path="/dashboard/agent" element={< DashboardAgent />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/signaler" element={<SignalerIncident />} />
        <Route path="/horaires" element={<Horaires />} />


      </Routes>
    </AuthProvider>
  );
};
export default App;
