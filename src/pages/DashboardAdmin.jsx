import React, { useState } from 'react';
import './DashboardAdmin.css';


const utilisateursSimules = {
  clients: [
    { id: 1, nom: 'Alice Tremblay', numeroOpus: '123456', email: 'alice@stm.ca' },
    { id: 2, nom: 'Marc Leduc', numeroOpus: '789012', email: 'marc@stm.ca' },
  ],
  agents: [
    { id: 1, nom: 'Agent 007', poste: 'Station Berri-UQAM' },
    { id: 2, nom: 'Agent 514', poste: 'Station Mont-Royal' },
  ],
};

const DashboardAdmin = () => {
  const [onglet, setOnglet] = useState('dashboard');

  return (
    <div className="dashboard-admin-container">
      <aside className="admin-sidebar">
        <h2>🛠 Admin</h2>
        <nav>
          <button onClick={() => setOnglet('dashboard')}>🏠 Accueil</button>
          <button onClick={() => setOnglet('clients')}>👥 Clients</button>
          <button onClick={() => setOnglet('agents')}>👮 Agents</button>
          <button onClick={() => setOnglet('historique')}>🧾 Historique</button>
          <button onClick={() => setOnglet('ajout')}>➕ Ajouter</button>
        </nav>
      </aside>

      <main className="admin-main">
        {onglet === 'dashboard' && (
          <section>
            <h2>Tableau de bord</h2>
            <ul>
              <li>🎫 Cartes OPUS : 2</li>
              <li>👮 Agents STM : 2</li>
              <li>📋 Incidents signalés : 5</li>
            </ul>
          </section>
        )}

        {onglet === 'clients' && (
          <section>
            <h2> Liste des clients</h2>
            <ul className="admin-list">
              {utilisateursSimules.clients.map((client) => (
                <li key={client.id}>
                  <p>Nom : {client.nom}</p>
                  <p>OPUS : {client.numeroOpus}</p>
                  <p>Email : {client.email}</p>
                  <button>🗑 Supprimer</button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {onglet === 'agents' && (
          <section>
            <h2>👮 Liste des agents</h2>
            <ul className="admin-list">
              {utilisateursSimules.agents.map((agent) => (
                <li key={agent.id}>
                  <p>Nom : {agent.nom}</p>
                  <p>Poste : {agent.poste}</p>
                  <button>🧾 Historique</button>
                  <button>🗑 Supprimer</button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {onglet === 'historique' && (
          <section>
            <h2>🧾 Historique</h2>
            <p>(Actions passées des agents / clients à afficher ici)</p>
          </section>
        )}

        {onglet === 'ajout' && (
          <section>
            <h2>➕ Ajouter un titre / carte</h2>
            <form className="form-ajout" onSubmit={(e) => { e.preventDefault(); alert("À connecter au backend"); }}>
              <label>Numéro OPUS :</label>
              <input type="text" required />
              <label>Type de titre :</label>
              <select required>
                <option>Mensuel</option>
                <option>Hebdomadaire</option>
                <option>Unité</option>
              </select>
              <button type="submit">💾 Enregistrer</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardAdmin;
