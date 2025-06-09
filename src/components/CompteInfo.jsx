import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import CarteOpus3D from './CarteOpus3D';
import './CompteInfo.css';

const CompteInfo = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <p>Chargement...</p>;

  return (
    <div className="compte-info-box">
      <h4>Votre carte OPUS</h4>
      <CarteOpus3D nom={user.nom} opus={user.opus} email={user.email} />

      <ul>
        <li><strong>🧑 Nom complet :</strong> {user.nom}</li>
        <li><strong>💳 Carte OPUS :</strong> {user.opus}</li>
        <li><strong>📧 Email :</strong> {user.email}</li>
        <li><strong>📆 Date d'inscription :</strong> 01/01/2025</li>
        <li><strong>🔑 Rôle :</strong> {user.role}</li>
      </ul>
    </div>
  );
};
export default CompteInfo;


