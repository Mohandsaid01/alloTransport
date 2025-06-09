import React, { useState } from 'react';
import './DashboardAgent.css';

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

  const traiterIncident = (id) => {
    const incidentsMisAJour = incidents.map((incident) =>
      incident.id === id ? { ...incident, status: 'résolu' } : incident
    );
    setIncidents(incidentsMisAJour);

    //  BACKEND : appeler une API ici pour sauvegarder l’état
    // fetch('/api/incidents/resoudre', { method: 'POST', body: JSON.stringify({ id }) })
  };

  return (
    
    <div className="dashboard-agent-container">
      <aside className="sidebar">
        <h2> Agent STM</h2>
        <nav>
          <a href="#incidents">📋 Incidents</a>
          <a href="#horaires">🕒 Horaires</a>
          <a href="#recherche">🔎 Recherche</a>
        </nav>
      </aside>

      <main className="main-content">
        <section id="incidents">
          <h3> Incidents signalés</h3>
          <ul className="incident-list">
            {incidents.map((incident) => (
              <li key={incident.id} className={`incident-card ${incident.status === 'résolu' ? 'resolu' : ''}`}>
                <p><strong>Type :</strong> {incident.type}</p>
                <p><strong>Localisation :</strong> {incident.localisation}</p>
                <p><strong>Date :</strong> {incident.date}</p>
                <p><strong>Statut :</strong> {incident.status}</p>
                {incident.status !== 'résolu' && (
                  <button onClick={() => traiterIncident(incident.id)}>
                     Marquer comme résolu
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="horaires">
          <h3> Consultation horaires</h3>
          <p>(Affichage horaire STM ici)</p>
        </section>

        <section id="recherche">
          <h3> Rechercher un client</h3>
          <input type="text" placeholder="Entrer numéro OPUS" />
          <button>Rechercher</button>
        </section>
      </main>
    </div>
  );
};
export default DashboardAgent;
