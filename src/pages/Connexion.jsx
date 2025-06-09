import React, { useContext, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';

const Connexion = () => {
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f7fb',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '24px',
          color: '#0059b2'
        }}>Connexion</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Nom complet"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Carte OPUS"
            value={opus}
            onChange={(e) => setOpus(e.target.value)}
            required
            style={inputStyle}
          />
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
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}
          >
            Se connecter
          </button>
        </form>

        <p style={{
          marginTop: '20px',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          Vous n’êtes pas inscrit ?{" "}
          <a href="/inscription" style={{ color: '#007acc', textDecoration: 'none' }}>
            Inscrivez-vous ici
          </a>
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '1rem',
};

export default Connexion;
