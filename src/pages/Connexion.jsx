import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Connexion.css';
import { AuthContext } from '../auth/AuthContext';

const Connexion = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); //  Utilisation du contexte
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          mot_de_passe: motDePasse,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur d'identifiants");
      }

      const data = await response.json();

      // 🔐 Enregistre l'utilisateur dans le contexte
      login(data.user);

      // 🚀 Redirection selon le rôle
      if (data.user.role === "client") navigate("/dashboard/client");
      else if (data.user.role === "agent") navigate("/dashboard/agent");
      else if (data.user.role === "admin") navigate("/dashboard/admin");

    } catch (err) {
      alert("Connexion échouée : " + err.message);
    }
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
