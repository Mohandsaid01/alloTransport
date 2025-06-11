import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Accueil from './pages/Accueil';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Horaires from './pages/Horaires';
import SignalerIncident from './pages/SignalerIncident';
import DashboardClient from './pages/DashboardClient';
import DashboardAgent from './pages/DashboardAgent';
import DashboardAdmin from './pages/DashboardAdmin';

const App = () => {
  return (
    <Routes>
      {/* Routes publiques avec Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Accueil />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/horaires" element={<Horaires />} />
        <Route path="/signaler" element={<SignalerIncident />} />
      </Route>

      
      <Route path="/dashboard/client" element={<DashboardClient />} />
<Route path="/dashboard/agent" element={<DashboardAgent />} />
      <Route path="/dashboard/admin" element={<DashboardAdmin />} />
    </Routes>
  );
};

export default App;
