import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-stm">STM</span>
            <span className="logo-app">AlloTransport</span>
          </div>

          {/* Navigation desktop */}
          <nav className="nav-desktop">
            <Link to="/horaires" className="nav-link">

              Horaires
            </Link>
            <Link to="/itineraires" className="nav-link">

              Itinéraires
            </Link>
            <Link to="/alertes" className="nav-link">

              Alertes
            </Link>
            <Link to="/opus" className="nav-link">

              OPUS
            </Link>
          </nav>

          {/* Boutons d'action */}
          <div className="header-actions">
            <button 
              className="btn-connexion"
              onClick={() => navigate('/connexion')}
            >
              Se connecter
            </button>
            <button 
              className="btn-inscription"
              onClick={() => navigate('/inscription')}
            >
              S'inscrire
            </button>
          </div>

          {/* Menu burger mobile */}
          <button 
            className={`menu-burger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

       
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          {/* Section principale */}
          <div className="footer-main">
            {/* Logo et description */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-stm">STM</span>
                <span className="logo-app">AlloTransport</span>
              </div>
              <p className="footer-description">
                Votre compagnon de transport intelligent pour naviguer facilement 
                dans le réseau de la Société de transport de Montréal.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link facebook">f</a>
                <a href="#" className="social-link twitter">t</a>
                <a href="#" className="social-link instagram">i</a>
                <a href="#" className="social-link youtube">y</a>
              </div>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h3>Services</h3>
              <ul>
                <li><a href="/horaires">Horaires en temps réel</a></li>
                <li><a href="/itineraires">Planification d'itinéraires</a></li>
                <li><a href="/opus">Gestion carte OPUS</a></li>
                <li><a href="/alertes">Alertes et perturbations</a></li>
                <li><a href="/accessibilite">Accessibilité</a></li>
              </ul>
            </div>

            {/* Réseau */}
            <div className="footer-section">
              <h3>Réseau STM</h3>
              <ul>
                <li><a href="/metro">Métro (4 lignes)</a></li>
                <li><a href="/bus">Autobus (200+ lignes)</a></li>
                <li><a href="/paratransit">Transport adapté</a></li>
                <li><a href="/tarifs">Tarification</a></li>
                <li><a href="/carte-reseau">Carte du réseau</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-section">
              <h3>Support</h3>
              <ul>
                <li><a href="/aide">Centre d'aide</a></li>
                <li><a href="/contact">Nous contacter</a></li>
                <li><a href="/objets-perdus">Objets perdus</a></li>
                <li><a href="/feedback">Commentaires</a></li>
                <li><a href="/faq">FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="footer-contact">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon"></span>
                <div>
                  <strong>Centre d'information</strong>
                  <p>514 786-4636 (24h/7j)</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon"></span>
                <div>
                  <strong>Courriel</strong>
                  <p>info@stm.info</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon"></span>
                <div>
                  <strong>Adresse</strong>
                  <p>800, rue De La Gauchetière Ouest<br />Montréal (Québec) H5A 1J6</p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications et téléchargements */}
          <div className="footer-apps">
            <h3>Téléchargez l'application</h3>
            <div className="app-stores">
              <a href="#" className="app-store">
                <span className="store-icon apple"></span>
                <div>
                  <small>Télécharger sur</small>
                  <strong>App Store</strong>
                </div>
              </a>
              <a href="#" className="app-store">
                <span className="store-icon android"></span>
                <div>
                  <small>Disponible sur</small>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
          </div>

          {/* Séparateur */}
          <div className="footer-divider"></div>

          {/* Bas de page */}
          <div className="footer-bottom">
            <div className="footer-legal">
              <p>&copy; 2025 Société de transport de Montréal. Tous droits réservés.</p>
              <div className="legal-links">
                <a href="/confidentialite">Politique de confidentialité</a>
                <a href="/conditions">Conditions d'utilisation</a>
                <a href="/accessibilite-web">Accessibilité web</a>
                <a href="/plan-site">Plan du site</a>
              </div>
            </div>
            
            <div className="footer-certifications">
              <div className="certification">
                <span className="cert-icon quality"></span>
                <small>Certifié ISO 9001</small>
              </div>
              <div className="certification">
                <span className="cert-icon accessibility"></span>
                <small>Accessibilité WCAG 2.1</small>
              </div>
              <div className="certification">
                <span className="cert-icon security"></span>
                <small>Sécurisé SSL</small>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;