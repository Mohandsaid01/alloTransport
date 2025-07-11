import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inscription.css';

const Inscription = () => {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [numeroOpus, setNumeroOpus] = useState('');
  const [sansCarteOpus, setSansCarteOpus] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    prenom,
    nom,
    email,
    mot_de_passe: motDePasse,
    carte_opus: sansCarteOpus ? null : numeroOpus
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      alert("Erreur : " + error.detail);
      return;
    }

    const data = await response.json();
    alert("✅ Compte créé avec succès !");
    navigate("/connexion");
  } catch (error) {
    console.error("Erreur inscription :", error);
    alert("Une erreur s’est produite.");
  }
};


  return (
    <div className="inscription-page">
      <div className="inscription-box">
        <div className="logo">
          <h1>STM</h1>
          <p>AlloTransport</p>
        </div>

        <h2>Inscription</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="name-row">
            <div className="input-group">
              <label>Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Adresse e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={sansCarteOpus}
                onChange={(e) => setSansCarteOpus(e.target.checked)}
              />
              <span className="checkmark"></span>
              Je n'ai pas de carte OPUS
            </label>
          </div>

          {!sansCarteOpus && (
            <div className="input-group">
              <label>Numéro carte OPUS</label>
              <input
                type="text"
                value={numeroOpus}
                onChange={(e) => setNumeroOpus(e.target.value)}
                placeholder="10 chiffres"
                maxLength="10"
                required={!sansCarteOpus}
              />
            </div>
          )}

          <div className="input-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>

          <button type="submit">Créer mon compte</button>
        </form>

        <p className="login-link">
          Déjà un compte ? <a href="/connexion">Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default Inscription;