import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import CompteInfo from '../components/CompteInfo';
import './DashboardClient.css';
import PaiementForm from '../components/PaiementForm';

const DashboardClient = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user || user.role !== 'client') {
    return <div>Accès refusé. Vous devez être connecté en tant que client.</div>;
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>AlloTransport</h2>
        <nav>
          <a href="#compte">👤 Mon compte</a>
          <a href="#paiement">💳 Paiement</a>
          <a href="#itineraire">🗺️ Itinéraire</a>
          <a href="#historique">🧾 Historique</a>
          <button onClick={logout}>🔓 Déconnexion</button>
        </nav>
      </aside>

      <main className="dashboard-content">
        <section id="compte">
          <h3>👤 Mon compte</h3>
          <CompteInfo />
        </section>

        <section id="paiement">
          <h3>💳 Paiement</h3>
          <PaiementForm />
        </section>

        

        <section id="historique">
          <h3>🧾 Historique</h3>
          <p>Historique de recharges et trajets à venir</p>
        </section>
      </main>
    </div>
  );
};
export default DashboardClient;
