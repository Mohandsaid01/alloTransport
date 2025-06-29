import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Arrets.css';

const Arrets = () => {
  const { mode, routeId } = useParams();
  const [directions, setDirections] = useState([]);
  const [directionChoisie, setDirectionChoisie] = useState(null);
  const [horaires, setHoraires] = useState([]);
  const [arretActif, setArretActif] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingHoraires, setLoadingHoraires] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/data/stops_par_ligne/${routeId}.json`)
      .then(res => res.json())
      .then(data => {
        setDirections(data);
        setDirectionChoisie(data[0] || null);
        setArretActif(null);
        setHoraires([]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [routeId]);

  const chargerHoraires = async (stopId) => {
    setArretActif(stopId);
    setHoraires([]);
    setLoadingHoraires(true);
    try {
      const res = await fetch(`/data/horaires_par_arret/${stopId}.json`);
      const data = await res.json();
      setHoraires(data);
    } catch {
      setHoraires([]);
    } finally {
      setLoadingHoraires(false);
    }
  };

  // Normaliser une heure (ex: 26:15 → 02:15)
  const normaliserHeure = (heure) => {
    const [h, m] = heure.split(':');
    const hMod = String(Number(h) % 24).padStart(2, '0');
    return `${hMod}:${m}`;
  };

 
//  Grouper par heure réelle (0h → 23h) avec tri
const grouperParHeure = (horaires) => {
  const groupes = {};

  horaires.forEach((heure) => {
    const [h, m, s] = heure.split(':');
    const hMod = Number(h) % 24;
    const cle = `${hMod}h`;

    const heureNormalisee = `${String(hMod).padStart(2, '0')}:${m}`;

    if (!groupes[cle]) groupes[cle] = [];
    groupes[cle].push(heureNormalisee);
  });

  // 🔢 Tri dans chaque groupe
  for (const cle in groupes) {
    groupes[cle].sort((a, b) => {
      const [ha, ma] = a.split(':').map(Number);
      const [hb, mb] = b.split(':').map(Number);
      return ha !== hb ? ha - hb : ma - mb;
    });
  }

  return groupes;
};


  const horairesGroupes = grouperParHeure(horaires);

  return (
    <div className="arrets-wrapper">
      <h2>🚏 Ligne {routeId}</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div className="direction-buttons">
            {directions.map((dir, index) => (
              <button
                key={index}
                className={dir.direction === directionChoisie?.direction ? 'active' : ''}
                onClick={() => {
                  setDirectionChoisie(dir);
                  setArretActif(null);
                  setHoraires([]);
                }}
              >
                {dir.direction}
              </button>
            ))}
          </div>

          {directionChoisie && (
            <ul className="arret-list">
              {directionChoisie.arrets.map((arret) => (
                <li key={arret.stop_id}>
                  <button onClick={() => chargerHoraires(arret.stop_id)}>
                    {arret.stop_name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {arretActif && (
        <div className="horaire-details">
          <h3>Horaires pour l’arrêt : {arretActif}</h3>
          {loadingHoraires ? (
            <p>Chargement des horaires...</p>
          ) : horaires.length > 0 ? (
            Object.entries(horairesGroupes).map(([heure, liste]) => (
              <div key={heure}>
                <h4>{heure}</h4>
                <ul>
                  {liste.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>Aucun horaire disponible.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Arrets;
