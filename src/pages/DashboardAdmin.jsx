import React, { useState } from 'react';
import './DashboardAdmin.css';

// 🔽 Simulation de données (à remplacer par un fetch depuis le backend)
const utilisateursSimules = {
  clients: [
    { id: 1, nom: 'Alice Tremblay', numeroOpus: '123456', email: 'alice@stm.ca' },
    { id: 2, nom: 'Marc Leduc', numeroOpus: '789012', email: 'marc@stm.ca' },
  ],
  agents: [
    { id: 1, nom: 'Agent 007', poste: 'Station Berri-UQAM', idUnique: 'AG007' },
    { id: 2, nom: 'Agent 514', poste: 'Station Mont-Royal', idUnique: 'AG514' },
  ],
}

// 🔽 Rapports soumis par les agents (à charger depuis la base de données)
const rapportsSimules = [
  { id: 1, titre: 'Panne métro', contenu: 'Panne sur la ligne orange à Berri.', valide: false },
  { id: 2, titre: 'Retard bus', contenu: 'Bus 24 en retard de 20 minutes.', valide: false },
];

const DashboardAdmin = () => {
  const [onglet, setOnglet] = useState('dashboard');
  const [agents, setAgents] = useState(utilisateursSimules.agents);
  const [rapports, setRapports] = useState(rapportsSimules);

  // 🛠 BACKEND : Ajouter un agent STM en base
  const handleAjoutAgent = (e) => {
    e.preventDefault();
    const form = e.target;
    const nom = form.nom.value;
    const poste = form.poste.value;
    const idUnique = form.idUnique.value;

    const nouvelAgent = { id: Date.now(), nom, poste, idUnique };

    setAgents([...agents, nouvelAgent]);

    // 🛠 BACKEND : envoyer à l'API d’ajout d’agent
    /*
    fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nouvelAgent),
    })
    */

    form.reset();
  };

  // 🛠 BACKEND : Valider un rapport (mettre à jour en base de données)
  const validerRapport = (id) => {
    const majRapports = rapports.map(r =>
      r.id === id ? { ...r, valide: true } : r
    );
    setRapports(majRapports);

    // 🛠 BACKEND : marquer le rapport comme validé
    /*
    fetch(`/api/rapports/${id}/valider`, {
      method: 'POST'
    })
    */
  };

  return (
    <div className="dashboard-admin-container">
      <aside className="admin-sidebar">
        <h2>🛠 Admin</h2>
        <nav>
          <button onClick={() => setOnglet('dashboard')}>🏠 Accueil</button>
          <button onClick={() => setOnglet('clients')}>👥 Clients</button>
          <button onClick={() => setOnglet('agents')}>👮 Agents</button>
          <button onClick={() => setOnglet('rapports')}>📄 Rapports</button>
          <button onClick={() => setOnglet('ajout-agent')}>➕ Créer Agent</button>
          <button onClick={() => setOnglet('ajout-titre')}>🎫 Vendre titre</button>
          <button onClick={() => window.location.href = '/'} style={{ marginTop: '20px' }}>🔓 Déconnexion</button>
        </nav>
      </aside>

      <main className="admin-main">
        {onglet === 'dashboard' && (
          <section>
            <h2>Tableau de bord</h2>
            <ul>
              <li>🎫 Cartes OPUS : {utilisateursSimules.clients.length}</li>
              <li>👮 Agents STM : {agents.length}</li>
              <li>📋 Rapports à valider : {rapports.filter(r => !r.valide).length}</li>
            </ul>
          </section>
        )}

        {onglet === 'clients' && (
          <section>
            <h2>Liste des clients</h2>
            <ul className="admin-list">
              {utilisateursSimules.clients.map((client) => (
                <li key={client.id}>
                  <p>Nom : {client.nom}</p>
                  <p>OPUS : {client.numeroOpus}</p>
                  <p>Email : {client.email}</p>
                  {/* 🛠 BACKEND : bouton suppression à connecter */}
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
              {agents.map((agent) => (
                <li key={agent.id}>
                  <p>Nom : {agent.nom}</p>
                  <p>Poste : {agent.poste}</p>
                  <p>ID Unique : {agent.idUnique}</p>
                  {/* 🛠 BACKEND : afficher historique / suppression */}
                  <button>🧾 Historique</button>
                  <button>🗑 Supprimer</button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {onglet === 'rapports' && (
          <section>
            <h2>📄 Rapports des agents</h2>
            {rapports.map((r) => (
              <div key={r.id} className={`rapport-card ${r.valide ? 'valide' : ''}`}>
                <h4>{r.titre}</h4>
                <p>{r.contenu}</p>
                {!r.valide && (
                  <button onClick={() => validerRapport(r.id)}>✅ Valider</button>
                )}
                {r.valide && <p style={{ color: 'green' }}>✔ Publié</p>}
              </div>
            ))}
          </section>
        )}

        {onglet === 'ajout-agent' && (
          <section>
            <h2>➕ Créer un nouvel agent</h2>
            <form className="form-ajout" onSubmit={handleAjoutAgent}>
              <label>Nom complet :</label>
              <input name="nom" type="text" required />
              <label>Poste :</label>
              <input name="poste" type="text" required />
              <label>ID Unique :</label>
              <input name="idUnique" type="text" required />
              <button type="submit">💾 Créer</button>
            </form>
          </section>
        )}

        {onglet === 'ajout-titre' && (
          <section>
            <h2>🎫 Vente de titre OPUS</h2>
            <form
              className="form-ajout"
              onSubmit={(e) => {
                e.preventDefault();
                // 🛠 BACKEND : envoi d’un titre à l’utilisateur
                alert("À connecter au backend : vente de titre OPUS");
              }}
            >
              <label>Numéro OPUS :</label>
              <input type="text" required />
              <label>Type de titre :</label>
              <select required>
                <option>Mensuel</option>
                <option>Hebdomadaire</option>
                <option>Unité</option>
              </select>
              <button type="submit">💾 Vendre</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardAdmin;
