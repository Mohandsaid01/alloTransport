import React from 'react';
import { useNavigate } from 'react-router-dom';

const Horaires = () => {
  const navigate = useNavigate();

  return (
    <div className="horaires-wrapper">
      <h2>Consulter les horaires</h2>
      <button onClick={() => navigate('/horaires/bus')}> Bus</button>
      <button onClick={() => navigate('/horaires/metro')}> Métro</button>
    </div>
  );
};

export default Horaires;
