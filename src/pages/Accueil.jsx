import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import './Accueil.css';

// Composant pour sélectionner les points sur la carte
const ItineraireSelector = ({ onPointsSelected }) => {
  const [points, setPoints] = useState([]);

  useMapEvents({
    click(e) {
      if (points.length < 2) {
        const newPoints = [...points, e.latlng];
        setPoints(newPoints);
        onPointsSelected(newPoints);
      }
    }
  });

  return (
    <>
      {points.map((point, index) => (
        <Marker key={index} position={point} />
      ))}
      {points.length === 2 && <Polyline positions={points} color="blue" />}
    </>
  );
};

const Accueil = () => {
  const navigate = useNavigate();
  const [selectedPoints, setSelectedPoints] = useState([]);

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

      <div className="map-container">
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
          <ItineraireSelector onPointsSelected={setSelectedPoints} />
        </MapContainer>

        {selectedPoints.length === 2 && (
          <div style={{ padding: '10px' }}>
            <p>🟢 Départ : {selectedPoints[0].lat.toFixed(5)}, {selectedPoints[0].lng.toFixed(5)}</p>
            <p>🔴 Arrivée : {selectedPoints[1].lat.toFixed(5)}, {selectedPoints[1].lng.toFixed(5)}</p>
          </div>
        )}
      </div>

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

      <footer className="footer">
        <p>&copy; 2025 AlloTransport - Projet étudiant STM</p>
      </footer>
    </div>
  );
};

export default Accueil;
