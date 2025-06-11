// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>AlloTransport</Link>

      <div style={styles.links}>
        {/* Toujours visible */}
        <Link to="/" style={styles.link}>Accueil</Link>

        {/* Connexion visible uniquement si pas connecté */}
        {!user && (
          <Link to="/connexion" style={styles.link}>Connexion</Link>
        )}

        {/* Inscription visible uniquement si pas connecté */}
        {!user && (
          <Link to="/inscription" style={styles.link}>Inscription</Link>
        )}

        {/* Si connecté, afficher le nom et bouton de déconnexion */}
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
