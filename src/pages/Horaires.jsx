import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Horaires.css';

const Horaires = () => {
  const navigate = useNavigate();
  const [favoris, setFavoris] = useState([]);

  // Charger les favoris depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoris');
    if (saved) {
      setFavoris(JSON.parse(saved));
    }
  }, []);

  // Naviguer vers un favori
  const allerAuFavori = (fav) => {
    navigate(`/horaires/${fav.mode}/${fav.routeId}`);
  };

  // Retirer un favori
  const retirerFavori = (stopId, routeId, mode) => {
    const newFavoris = favoris.filter(
      (f) => !(f.stopId === stopId && f.routeId === routeId && f.mode === mode)
    );
    setFavoris(newFavoris);
    localStorage.setItem('favoris', JSON.stringify(newFavoris));
  };

  return (
    <div className="horaires-wrapper">
      <h2>Consulter les horaires</h2>
      <div className="mode-buttons">
        <button onClick={() => navigate('/horaires/bus')}> Bus</button>
        <button onClick={() => navigate('/horaires/metro')}> Métro</button>
      </div>

      {favoris.length > 0 && (
        <div className="favoris-section">
          <h3> Favoris</h3>
          <ul>
            {favoris.map((f) => (
              <li key={`${f.mode}-${f.routeId}-${f.stopId}`}>
                <button onClick={() => allerAuFavori(f)}>
                  {f.stopName} ({f.mode} - Ligne {f.routeId})
                  <span
                    className="etoile favori"
                    onClick={(e) => {
                      e.stopPropagation();
                      retirerFavori(f.stopId, f.routeId, f.mode);
                    }}
                    title="Retirer des favoris"
                    style={{ float: 'right' }}
                  >
                    ★
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Horaires;
