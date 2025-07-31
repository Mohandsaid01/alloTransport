// src/components/MapComponent.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Composant pour ajuster le zoom automatiquement
const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

const MapComponent = ({ departure, destination }) => {
  const [departureCoords, setDepartureCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  // Fonction pour obtenir les coordonnées depuis OpenStreetMap (Nominatim)
 const getCoords = async (address) => {
  const token = 'pk.13342c089a17f01332d4f68af1bead17'; // 🔁 Remplace par ton vrai token
  const query = `${address}, Montréal`; // Pour guider la recherche vers Montréal
  const res = await fetch(
    `https://us1.locationiq.com/v1/search?key=${token}&q=${encodeURIComponent(query)}&format=json`
  );

  const data = await res.json();

  if (data && data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }

  return null;
};


  // Met à jour les coordonnées dès que les adresses changent
  useEffect(() => {
    const fetchData = async () => {
      if (departure) {
        const dep = await getCoords(departure);
        console.log('📍 Départ :', dep);
        setDepartureCoords(dep);
      }

      if (destination) {
        const dest = await getCoords(destination);
        console.log('🏁 Destination :', dest);
        setDestinationCoords(dest);
      }
    };

    fetchData();
  }, [departure, destination]);

  // Centre de Montréal par défaut
  const defaultCenter = [45.5017, -73.5673];

  // Calcul des bornes pour zoom automatique
  const bounds = departureCoords && destinationCoords
    ? [departureCoords, destinationCoords]
    : null;

  return (
    <div className="enhanced-map-container">
      <div className="map-wrapper">
        <MapContainer center={defaultCenter} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {departureCoords && <Marker position={departureCoords} />}
          {destinationCoords && <Marker position={destinationCoords} />}
          {departureCoords && destinationCoords && (
            <>
              <Polyline positions={[departureCoords, destinationCoords]} color="blue" />
              <FitBounds bounds={bounds} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
