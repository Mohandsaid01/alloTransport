// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const auth = useContext(AuthContext);

  //  Sécurité : éviter plantage si le contexte est absent
  if (!auth) {
    console.warn("AuthContext non disponible dans Navbar");
    return null; // Ou tu peux afficher un loader, ou un message temporaire
  }

  const { user, logout } = auth;

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>AlloTransport</Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Accueil</Link>

        {!user && (
          <>
            <Link to="/connexion" style={styles.link}>Connexion</Link>
            <Link to="/inscription" style={styles.link}>Inscription</Link>
          </>
        )}

        {user && (
          <>
            <span style={{ color: 'white', marginRight: '10px' }}>
              Bonjour, {user.nom}
            </span>
            <button onClick={logout} style={styles.logoutBtn}>Déconnexion</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#0059b2',
    color: 'white',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
  },
  logoutBtn: {
    backgroundColor: '#ff5c5c',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Navbar;
