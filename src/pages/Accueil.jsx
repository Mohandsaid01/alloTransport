// src/pages/Accueil.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import BlocItineraireSTM from '../components/BlocItineraireSTM';
import './Accueil.css';
import Navbar from '../components/Navbar';


const Accueil = () => {
  const navigate = useNavigate();

  const handleClick = (target) => {
    if (target === 'horaire') navigate('/horaires');
    else if (target === 'incident') navigate('/signaler');
    else if (target === 'recharger') navigate('/connexion');
  };

  return (
    <div className="page-wrapper">
        <Navbar />

      

      {/*  Bloc itinéraire moderne au-dessus de la carte */}
      <div className="map-container" style={{ position: 'relative' }}>
        <BlocItineraireSTM onSearch={(data) => console.log(data)} />
        <MapContainer
          center={[45.508888, -73.561668]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>

      {/* Blocs d’action */}
      <div className="carre-container">
        <div className="carre" onClick={() => handleClick('horaire')}>
          <h2> Horaires</h2>
          <p>Consulter les horaires des bus et métro</p>
        </div>
        <div className="carre" onClick={() => handleClick('incident')}>
          <h2> Signaler un incident</h2>
          <p>Informer sur un problème ou un retard</p>
        </div>
        <div className="carre" onClick={() => handleClick('recharger')}>
          <h2>💳 Recharger ou Acheter</h2>
          <p>Recharge carte OPUS ou acheter un titre</p>
        </div>
      </div>
      <footer className="footer">
  <div className="footer-info">
    <div><strong>Projet étudiant STM</strong></div>
    <div>Réalisé par JsyK</div>
    <div>Collège Teccart - Montréal, Canada</div>
    <div>
      Email : <a href="mailto:mohandsaidhalfaoui@gmail.com">mohandsaidhalfaoui@gmail.com</a>
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
