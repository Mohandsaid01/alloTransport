import React from 'react';
import './CarteOpus3D.css';

const CarteOpus3D = ({ nom, opus, email }) => {
  return (
    <div className="carte-scene">
      <div className="carte-opus">
        <div className="carte-face carte-front">
          <h3>Carte OPUS</h3>
          <p><strong>Nom :</strong> {nom}</p>
          <p><strong>Numéro :</strong> {opus}</p>
          <p className="stm-logo">STM</p>
        </div>
        <div className="carte-face carte-back">
          <p><strong>Email :</strong> {email}</p>
          <p><strong>Validité :</strong> 2025</p>
          <p><em>AlloTransport</em></p>
        </div>
      </div>
    </div>
  );
};

export default CarteOpus3D;
