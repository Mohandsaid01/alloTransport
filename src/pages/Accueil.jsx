import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Accueil.css';
import ItineraireBox from '../components/ItineraireBox';

const Accueil = () => {
  const navigate = useNavigate();

  const handleClick = (target) => {
    if (target === 'horaire') navigate('/horaires');
    else if (target === 'incident') navigate('/signaler');
    else if (target === 'recharger') navigate('/connexion');
  };

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

      {/* Blocs d’action */}
      <div className="carre-container">
        <div className="carre" onClick={() => handleClick('horaire')}>
          <h2>📆 Horaires</h2>
          <p>Consulter les horaires des bus et métro</p>
        </div>
        <div className="carre" onClick={() => handleClick('incident')}>
          <h2>⚠️ Signaler un incident</h2>
          <p>Informer sur un problème ou un retard</p>
        </div>
        <div className="carre" onClick={() => handleClick('recharger')}>
          <h2>💳 Recharger ou Acheter</h2>
          <p>Recharge carte OPUS ou acheter un titre</p>
        </div>
      </div>

      {/* Itinéraire */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <ItineraireBox />
      </div>

      {/* À propos */}
      <section className="section-about">
        <h2>🚍 À propos de AlloTransport</h2>
        <p>
          AlloTransport est une plateforme développée dans le cadre d’un projet étudiant au Collège Teccart. 
          Elle vise à améliorer l'expérience des usagers des transports publics à Montréal (STM) en facilitant 
          la consultation des horaires, la gestion des cartes OPUS, et la signalisation des incidents.
        </p>
        <p>
          Notre mission : rendre les transports en commun plus accessibles, plus efficaces, et plus connectés. 
          Cette application s'inspire de Chrono et intègre des outils modernes comme la cartographie interactive et des paiements simplifiés.
        </p>
      </section>

      {/* Footer pro */}
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

export default Accueil;
