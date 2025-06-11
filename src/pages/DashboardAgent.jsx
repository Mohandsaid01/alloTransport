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
  const [rapport, setRapport] = useState('');
  const [opusClient, setOpusClient] = useState('');
  const [nomClient, setNomClient] = useState('');
  const [titre, setTitre] = useState('');
  const [prix, setPrix] = useState('');
  const navigate = useNavigate();

  const traiterIncident = (id) => {
    const incidentsMisAJour = incidents.map((incident) =>
      incident.id === id ? { ...incident, status: 'résolu' } : incident
    );
    setIncidents(incidentsMisAJour);
    // API: POST vers /api/incidents/resoudre
  };

  const envoyerRapport = () => {
    console.log('Rapport envoyé au backend : ', rapport);
    setRapport('');
  };

  const creerCarte = () => {
    console.log(`Carte OPUS créée pour ${nomClient}, ID: ${opusClient}`);
    setNomClient('');
    setOpusClient('');
  };

  const vendreTitre = () => {
    console.log(`Titre vendu : ${titre}, Prix : ${prix}$`);
    setTitre('');
    setPrix('');
  };

  return (
    <div className="dashboard-agent-container">
      <aside className="sidebar">
        <h2>Agent STM</h2>
        <nav>
          <a href="#incidents">📋 Incidents</a>
          <a href="#horaires">🕒 Horaires</a>
          <a href="#recherche">🔎 Recherche</a>
          <a href="#rapport">📝 Rapport</a>
          <a href="#carte">➕ Carte OPUS</a>
          <a href="#titre">🎫 Vente titre</a>
        </nav>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Déconnexion
        </button>
      </aside>

      <main className="main-content">
        <section id="incidents">
          <h3>Incidents signalés</h3>
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
          <h3>Consultation horaires</h3>
          <p>(Affichage horaire STM ici)</p>
        </section>

        <section id="recherche">
          <h3>Rechercher un client</h3>
          <input type="text" placeholder="Entrer numéro OPUS" />
          <button>Rechercher</button>
        </section>

        <section id="rapport">
          <h3>Rédiger un rapport</h3>
          <textarea
            rows="5"
            value={rapport}
            onChange={(e) => setRapport(e.target.value)}
            placeholder="Écrire le rapport à transmettre à l’administrateur..."
            style={{ width: '100%', padding: '12px', borderRadius: '6px', marginBottom: '10px' }}
          />
          <button onClick={envoyerRapport}>Envoyer au responsable</button>
        </section>

        <section id="carte">
          <h3>Créer une carte OPUS</h3>
          <input type="text" placeholder="Nom client" value={nomClient} onChange={(e) => setNomClient(e.target.value)} />
          <input type="text" placeholder="Numéro OPUS" value={opusClient} onChange={(e) => setOpusClient(e.target.value)} />
          <button onClick={creerCarte}>Créer la carte</button>
        </section>

        <section id="titre">
          <h3>Vendre un titre</h3>
          <input type="text" placeholder="Nom du titre" value={titre} onChange={(e) => setTitre(e.target.value)} />
          <input type="number" placeholder="Prix en $" value={prix} onChange={(e) => setPrix(e.target.value)} />
          <button onClick={vendreTitre}>Valider la vente</button>
        </section>
      </main>
    </div>
  );
};
export default DashboardAgent;
