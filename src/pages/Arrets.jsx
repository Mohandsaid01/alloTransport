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
  const [favoris, setFavoris] = useState([]);
  const [filters, setFilters] = useState({
    maintenant: false,
    avantMidi: false,
    apresMidi: false,
  });

  // Charger favoris depuis localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favoris')) || [];
    setFavoris(saved);
  }, []);

  // Charger les arrêts d’une ligne
  useEffect(() => {
    setLoading(true);
    fetch(`/data/stops_par_ligne/${routeId}.json`)
      .then(res => res.json())
      .then(data => {
        setDirections(data);
        setDirectionChoisie(null);
        setArretActif(null);
        setHoraires([]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [routeId]);

  const chargerHoraires = async (stopId) => {
    if (arretActif === stopId) {
      setArretActif(null);
      setHoraires([]);
      return;
    }

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

  const normaliserHeure = (heure) => {
    const [h, m] = heure.split(':');
    const hMod = String(Number(h) % 24).padStart(2, '0');
    return `${hMod}:${m}`;
  };

  const appliquerFiltres = (horaire) => {
    const now = new Date();
    const [heureStr, minuteStr] = horaire.split(':');
    const heure = Number(heureStr) % 24;
    const minute = Number(minuteStr);

    const heureActuelle = now.getHours();
    const minuteActuelle = now.getMinutes();

    const estApresHeureActuelle = (heure > heureActuelle) || (heure === heureActuelle && minute >= minuteActuelle);

    if (filters.maintenant && !estApresHeureActuelle) return false;
    if (filters.avantMidi && heure >= 12) return false;
    if (filters.apresMidi && heure < 12) return false;

    return true;
  };

  const grouperParHeure = (horaires) => {
    const groupes = {};
    horaires
      .filter(appliquerFiltres)
      .forEach((heure) => {
        const [h, m] = heure.split(':');
        const hMod = Number(h) % 24;
        const cle = `${hMod}h`;
        const heureNormalisee = `${String(hMod).padStart(2, '0')}:${m}`;
        if (!groupes[cle]) groupes[cle] = [];
        groupes[cle].push(heureNormalisee);
      });

    for (const cle in groupes) {
      groupes[cle].sort((a, b) => a.localeCompare(b));
    }

    return groupes;
  };

  const horairesGroupes = grouperParHeure(horaires);

  const toggleFavori = (stopId, stopName) => {
    const favori = { stopId, stopName, routeId, mode };
    const exists = favoris.some(f => f.stopId === stopId && f.routeId === routeId && f.mode === mode);

    let nouveauxFavoris;
    if (exists) {
      nouveauxFavoris = favoris.filter(f => !(f.stopId === stopId && f.routeId === routeId && f.mode === mode));
    } else {
      nouveauxFavoris = [...favoris, favori];
    }

    setFavoris(nouveauxFavoris);
    localStorage.setItem('favoris', JSON.stringify(nouveauxFavoris));
  };

  const estFavori = (stopId) =>
    favoris.some(f => f.stopId === stopId && f.routeId === routeId && f.mode === mode);

  const handleDirectionClick = (dir) => {
    if (dir.direction === directionChoisie?.direction) {
      setDirectionChoisie(null);
    } else {
      setDirectionChoisie(dir);
    }
    setArretActif(null);
    setHoraires([]);
  };

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
                onClick={() => handleDirectionClick(dir)}
              >
                {dir.direction}
              </button>
            ))}
          </div>

          {!directionChoisie && (
            <p className="message-info"> Veuillez sélectionner une direction pour voir les arrêts.</p>
          )}

          {directionChoisie && (
            <div className="arrets-container">
              <div className="arret-column">
                <ul className="arret-list">
                  {directionChoisie.arrets.map((arret) => (
                    <li key={arret.stop_id}>
                      <button
                        className={`arret-btn ${arret.stop_id === arretActif ? 'active' : ''}`}
                        onClick={() => chargerHoraires(arret.stop_id)}
                      >
                        <span>{arret.stop_name}</span>
                        <span
                          className={`etoile ${estFavori(arret.stop_id) ? 'favori' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavori(arret.stop_id, arret.stop_name);
                          }}
                          title={estFavori(arret.stop_id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          ★
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="horaire-column">
                {arretActif && (
                  <div className="horaire-details">
                    <h3> Horaires : {arretActif}</h3>

                    {/* filtres */}
                    <div className="horaire-filtres">
                      <label>
                        <input
                          type="checkbox"
                          checked={filters.maintenant}
                          onChange={(e) => setFilters({ ...filters, maintenant: e.target.checked })}
                        />
                        Après maintenant
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={filters.avantMidi}
                          onChange={(e) => setFilters({ ...filters, avantMidi: e.target.checked })}
                        />
                        Avant midi
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={filters.apresMidi}
                          onChange={(e) => setFilters({ ...filters, apresMidi: e.target.checked })}
                        />
                        Après midi
                      </label>
                    </div>

                    {loadingHoraires ? (
                      <p>Chargement...</p>
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Arrets;
