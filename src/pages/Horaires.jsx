import React, { useState } from 'react';
import './Horaires.css';

const horairesSimules = [
  {
    ligne: '10 - De Lorimier',
    direction: 'Vers Sud',
    horaires: ['06:15', '06:45', '07:15', '08:00', '08:30']
  },
  {
    ligne: '24 - Sherbrooke',
    direction: 'Vers Est',
    horaires: ['06:30', '07:00', '07:30', '08:00', '08:30']
  },
  {
    ligne: '67 - Saint-Michel',
    direction: 'Vers Nord',
    horaires: ['06:10', '06:40', '07:20', '08:10', '08:45']
  }
];

//  Ces horaires sont SIMULÉS pour le frontend uniquement.
//  À remplacer par un appel vers une API backend ou un service GTFS.
// Exemple futur : 
// axios.get("/api/horaires?ligne=24")
//   .then(response => setHoraires(response.data));

const Horaires = () => {
  const [ligneChoisie, setLigneChoisie] = useState(null);

  return (
    <div className="horaires-wrapper">
      <h2>🚌 Horaires des lignes</h2>
      <p>Choisissez une ligne pour voir les prochains départs :</p>

      <div className="liste-lignes">
        {horairesSimules.map((ligne, index) => (
          <button
            key={index}
            className="btn-ligne"
            onClick={() => setLigneChoisie(ligne)}
          >
            {ligne.ligne}
          </button>
        ))}
      </div>

      {ligneChoisie && (
        <div className="details-horaire">
          <h3>{ligneChoisie.ligne} ({ligneChoisie.direction})</h3>
          <ul>
            {ligneChoisie.horaires.map((heure, idx) => (
              <li key={idx}> {heure}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default Horaires;