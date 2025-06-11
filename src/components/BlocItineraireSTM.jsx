// src/components/BlocItineraireSTM.jsx
import React, { useState } from 'react';
import './BlocItineraireSTM.css';
const BlocItineraireSTM = ({ onSearch }) => {
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ depart, arrivee });
  };

  return (
    <div className="bloc-itineraire-stm">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Départ"
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
        />
        <input
          type="text"
          placeholder="Arrivée"
          value={arrivee}
          onChange={(e) => setArrivee(e.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>
    </div>
  );
};

export default BlocItineraireSTM;
