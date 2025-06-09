import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

const Inscription = () => {
  const { login } = useContext(AuthContext);
  const [nom, setNom] = useState('');
  const [opus, setOpus] = useState('');
  const [mdp, setMdp] = useState('');
  const [role, setRole] = useState('client');

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ nom, opus, role });
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom complet" value={nom} onChange={(e) => setNom(e.target.value)} required /><br />
        <input type="text" placeholder="Carte OPUS" value={opus} onChange={(e) => setOpus(e.target.value)} required /><br />
        <input type="password" placeholder="Mot de passe" value={mdp} onChange={(e) => setMdp(e.target.value)} required /><br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="client">Client</option>
          <option value="agent">Agent STM</option>
          <option value="admin">Administrateur</option>
        </select><br />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Inscription;
