import React, { useContext, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../components/Navbar'; 
import '../pages/Accueil.css';

const Connexion = () => {
  const { login } = useContext(AuthContext);
  const [nom, setNom] = useState('');
  const [opus, setOpus] = useState('');
  const [mdp, setMdp] = useState('');
  const [role, setRole] = useState('client');

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ nom, opus: role !== 'admin' ? opus : null, role });
  };

  return (
    <>
      <Navbar />

      <div style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f6fa',
        padding: '40px 20px',
        fontFamily: 'Segoe UI, sans-serif',
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
          width: '100%',
          maxWidth: '420px',
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '24px',
            color: '#0059b2'
          }}>
            Connexion
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              placeholder="Nom complet"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              style={inputStyle}
            />

            {/* Champ OPUS affiché uniquement pour client et agent */}
            {role !== 'admin' && (
              <input
                type="text"
                placeholder="Carte OPUS"
                value={opus}
                onChange={(e) => setOpus(e.target.value)}
                required
                style={inputStyle}
              />
            )}

            <input
              type="password"
              placeholder="Mot de passe"
              value={mdp}
              onChange={(e) => setMdp(e.target.value)}
              required
              style={inputStyle}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="client">Client</option>
              <option value="agent">Agent STM</option>
              <option value="admin">Administrateur</option>
            </select>

            <button
              type="submit"
              style={{
                backgroundColor: '#0059b2',
                color: '#fff',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Se connecter
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            Vous n’êtes pas inscrit ?{" "}
            <a href="/inscription" style={{ color: '#007acc', textDecoration: 'none' }}>
              Inscrivez-vous ici
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

const inputStyle = {
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '1rem',
  outline: 'none',
};

export default Connexion;
