import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Lignes.css';

const Lignes = () => {
  const { mode } = useParams(); // "bus" ou "metro"
  const [lignes, setLignes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/data/${mode}_routes.json`)
      .then(res => res.json())
      .then(data => setLignes(data))
      .catch(err => console.error('Erreur chargement lignes :', err));
  }, [mode]);

  return (
    <div className="lignes-wrapper">
      <h2>Lignes {mode === 'bus' ? ' Bus' : ' Métro'}</h2>
      {lignes.length === 0 ? (
        <p>Aucune ligne trouvée.</p>
      ) : (
        <ul>
          {lignes.map((ligne) => (
            <li key={ligne.route_id}>
              <button onClick={() => navigate(`/horaires/${mode}/${ligne.route_id}`)}>
                {ligne.route_short_name} - {ligne.route_long_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Lignes;
