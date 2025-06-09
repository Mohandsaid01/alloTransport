import React from 'react';
import './CarteOpus3D.css';

const CarteOpus3D = ({ nom, opus, email }) => {
  return (
    <div className="carte-opus">
      <p>{nom}</p>
      <p>{opus}</p>
      <p>{email}</p>
    </div>
  );
};

export default CarteOpus3D; 
