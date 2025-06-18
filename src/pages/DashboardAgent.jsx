import React, { useState } from 'react';
import './DashboardAgent.css';
import { useNavigate } from 'react-router-dom';

const incidentsInitiaux = [
  {
    id: 1,
    type: 'Panne d’autobus',
    localisation: 'Station Berri-UQAM',
    date: '2025-06-07 10:15',
    status: 'non résolu',
  },
  {
    id: 2,
    type: 'Problème technique métro',
    localisation: 'Station Jean-Talon',
    date: '2025-06-07 09:30',
    status: 'non résolu',
  },
];

const DashboardAgent = () => {
  const [incidents, setIncidents] = useState(incidentsInitiaux);
  const [opusClient, setOpusClient] = useState('');
  const [titre, setTitre] = useState('');
  const [rapport, setRapport] = useState('');
  const navigate = useNavigate();

  const traiterIncident = (id) => {
    const incidentsMisAJour = incidents.map((incident) =>
      incident.id === id ? { ...incident, status: 'résolu' } : incident
    );
    setIncidents(incidentsMisAJour);
  };

  const envoyerRapport = () => {
    if (!titre || !rapport) {
      alert("Merci de remplir le titre et le contenu !");
      return;
    }

    fetch("http://127.0.0.1:8000/api/rapports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titre, contenu: rapport }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Rapport envoyé avec succès !");
        setTitre('');
        setRapport('');
      })
      .catch(() => alert("Erreur lors de l’envoi."));
  };

  const rechercherClient = () => {
    if (!opusClient) return alert("Saisis un numéro OPUS !");
    fetch(`http://127.0.0.1:8000/api/clients/${opusClient}`)
      .then((res) => res.json())
      .then((data) => alert(`Client : ${data.nom} ${data.prenom}`))
      .catch(() => alert("Client introuvable"));
  };

  return (
    <div className="dashboard-agent-container">
      <aside className="sidebar">
        <h2>🛠️ Agent STM</h2>
        <nav>
          <a href="#incidents">📋 Incidents</a>
          <a href="#horaires">🕒 Horaires</a>
          <a href="#recherche">🔎 Recherche</a>
          <a href="#rapport">📝 Rapport</a>
        </nav>
        <button
          onClick={() => navigate('/')}
          className="logout-button"
        >
          🚪 Déconnexion
        </button>
      </aside>

      <main className="main-content">
        <section id="incidents">
          <h3>📋 Incidents signalés</h3>
          <ul className="incident-list">
            {incidents.map((incident) => (
              <li key={incident.id} className={`incident-card ${incident.status === 'résolu' ? 'resolu' : ''}`}>
                <p><strong>Type :</strong> {incident.type}</p>
                <p><strong>Localisation :</strong> {incident.localisation}</p>
                <p><strong>Date :</strong> {incident.date}</p>
                <p><strong>Statut :</strong> {incident.status}</p>
                {incident.status !== 'résolu' && (
                  <button onClick={() => traiterIncident(incident.id)}>
                    ✅ Résoudre
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="horaires">
          <h3>🕒 Consultation horaires</h3>
          <p>(Affichage des horaires de bus/métro à venir...)</p>
        </section>

        <section id="recherche">
          <h3>🔎 Rechercher un client</h3>
          <input
            type="text"
            placeholder="Numéro OPUS"
            value={opusClient}
            onChange={(e) => setOpusClient(e.target.value)}
            style={{ padding: '10px', marginRight: '10px', borderRadius: '6px' }}
          />
          <button onClick={rechercherClient}>🔍 Rechercher</button>
        </section>

        <section id="rapport">
          <h3>📝 Rédiger un rapport</h3>
          <input
            type="text"
            placeholder="Titre du rapport"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px' }}
          />
          <textarea
            rows="5"
            placeholder="Contenu du rapport..."
            value={rapport}
            onChange={(e) => setRapport(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '6px', marginBottom: '10px' }}
          />
          <button onClick={envoyerRapport}>📤 Envoyer au responsable</button>
        </section>
      </main>
    </div>
  );
};

export default DashboardAgent;
