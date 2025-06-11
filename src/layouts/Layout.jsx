import React from 'react';
import { Outlet } from 'react-router-dom';
import "./Layout.css";

const Layout = () => {
  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <h2>AlloTransport</h2>
        <div>
          <a href="/">Accueil</a>
          <a href="/connexion">Connexion</a>
          <a href="/inscription">Inscription</a>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-info">
          <div><strong>Projet étudiant STM</strong></div>
          <div>Réalisé par Mohand Said Halfaoui</div>
          <div>Collège Teccart - Montréal, Canada</div>
          <div>
            Email : <a href="mailto:mohandsaidhalfaoui@gmail.com" style={{ color: '#4fc3f7', textDecoration: 'none' }}>
              mohandsaidhalfaoui@gmail.com
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} AlloTransport. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
