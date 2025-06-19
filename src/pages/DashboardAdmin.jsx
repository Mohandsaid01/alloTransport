import React, { useState, useEffect } from 'react';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  const [onglet, setOnglet] = useState('dashboard');
  const [agents, setAgents] = useState([]);
  const [clients, setClients] = useState([]);
  const [rapports, setRapports] = useState([]);

  // Chargement initial
  useEffect(() => {
    chargerClients();
    chargerAgents();
    chargerRapports();
  }, []);

  // Rechargement si changement d'onglet
  useEffect(() => {
    if (onglet === 'clients') chargerClients();
    if (onglet === 'agents') chargerAgents();
    if (onglet === 'rapports') chargerRapports();
  }, [onglet]);

  const chargerClients = () => {
    fetch("http://127.0.0.1:8000/api/clients?skip=0&limit=100")
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error("Erreur chargement clients", err));
  };

  const chargerAgents = () => {
    fetch("http://127.0.0.1:8000/api/agents")
      .then(res => res.json())
      .then(data => setAgents(data))
      .catch(err => console.error("Erreur chargement agents", err));
  };

  const chargerRapports = () => {
    fetch("http://127.0.0.1:8000/api/rapports")
      .then(res => res.json())
      .then(data => setRapports(data))
      .catch(err => console.error("Erreur chargement rapports", err));
  };

  const handleAjoutAgent = (e) => {
    e.preventDefault();
    const form = e.target;
    const nom = form.nom.value;
    const prenom = form.prenom.value;
    const email = form.email.value;
    const mot_de_passe = form.mot_de_passe.value;

    const nouvelAgent = {
      nom,
      prenom,
      email,
      mot_de_passe,
      role: 'agent'
    };

    fetch('http://127.0.0.1:8000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nouvelAgent),
    })
      .then(res => res.json())
      .then(data => {
        alert("Agent créé avec succès !");
        setAgents([...agents, data]);
        setOnglet("agents");
      })
      .catch(err => console.error("Erreur ajout agent", err));

    form.reset();
  };

  const validerRapport = (id) => {
    fetch(`http://127.0.0.1:8000/api/rapports/${id}/valider`, {
      method: 'POST'
    }).then(() => {
      setRapports(rapports.map(r => r.id === id ? { ...r, valide: true } : r));
    });
  };

  return (
    <div className="dashboard-admin-container">
      <aside className="admin-sidebar">
        <h2>🔨 Admin</h2>
        <nav>
          <button onClick={() => setOnglet('dashboard')}>🏠 Accueil</button>
          <button onClick={() => setOnglet('clients')}>👥 Clients</button>
          <button onClick={() => setOnglet('agents')}>👮 Agents</button>
          <button onClick={() => setOnglet('rapports')}>📄 Rapports</button>
          <button onClick={() => setOnglet('ajout-agent')}>➕ Créer Agent</button>
          <button onClick={() => window.location.href = '/'} style={{ marginTop: '20px' }}>🔓 Déconnexion</button>
        </nav>
      </aside>

      <main className="admin-main">
        {onglet === 'dashboard' && (
          <section>
            <h2>Tableau de bord</h2>
            <ul>
              <li>🎫 Cartes OPUS : {clients.length}</li>
              <li>👮 Agents STM : {agents.length}</li>
              <li>📋 Rapports à valider : {rapports.filter(r => !r.valide).length}</li>
            </ul>
          </section>
        )}

        {onglet === 'clients' && (
          <section>
            <h2>Liste des clients</h2>
            <ul className="admin-list">
              {clients.map((client) => (
                <li key={client.id}>
                  <p>Nom : {client.nom} {client.prenom}</p>
                  <p>OPUS : {client.carte_opus}</p>
                  <p>Email : {client.email}</p>
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
                  <p>Nom : {agent.nom} {agent.prenom}</p>
                  <p>Email : {agent.email}</p>
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
                {!r.valide ? (
                  <button onClick={() => validerRapport(r.id)}>✅ Valider</button>
                ) : (
                  <p style={{ color: 'green' }}>✔ Publié</p>
                )}
              </div>
            ))}
          </section>
        )}

        {onglet === 'ajout-agent' && (
          <section>
            <h2>➕ Créer un nouvel agent</h2>
            <form className="form-ajout" onSubmit={handleAjoutAgent}>
              <label>Nom :</label>
              <input name="nom" type="text" required />
              <label>Prénom :</label>
              <input name="prenom" type="text" required />
              <label>Email :</label>
              <input name="email" type="email" required />
              <label>Mot de passe :</label>
              <input name="mot_de_passe" type="password" required />
              <button type="submit">💾 Créer</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardAdmin;
