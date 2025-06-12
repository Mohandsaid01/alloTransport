import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Connexion.css';

const Connexion = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Logique simple de connexion
    let role = 'client';
    if (email.includes('agent')) {
      role = 'agent';
    } else if (email.includes('admin')) {
      role = 'admin';
    }

    // Redirection vers le dashboard
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="connexion-page">
      <div className="connexion-box">
        <div className="logo">
          <h1>STM</h1>
          <p>AlloTransport</p>
        </div>

        <h2>Connexion</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Adresse e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>

          <button type="submit">Se connecter</button>
        </form>

        <p className="signup-link">
          Pas de compte ? <a href="/inscription">S'inscrire</a>
        </p>
      </div>
    </div>
  );
};

export default Connexion;