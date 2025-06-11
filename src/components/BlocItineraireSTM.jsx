import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import axios from 'axios';
import './BlocItineraireSTM.css';

const BlocItineraireSTM = () => {
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [coords, setCoords] = useState([]);
  const apiKey = '5b3ce3597851110001cf6248d52917e65eb543afacfd53743254b931';

  const getCoords = async (adresse) => {
    const res = await axios.get(`https://api.openrouteservice.org/geocode/search`, {
      params: {
        api_key: apiKey,
        text: adresse,
      },
    });
    return res.data.features[0].geometry.coordinates;
  };

  const handleSearch = async () => {
    try {
      const start = await getCoords(depart);
      const end = await getCoords(arrivee);
      const res = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        { coordinates: [start, end] },
        {
          headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      const line = res.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setCoords(line);
    } catch (err) {
      alert("Erreur lors du calcul d'itinéraire");
    }
  };

  const handleSwap = () => {
    const temp = depart;
    setDepart(arrivee);
    setArrivee(temp);
  };

  return (
    <div className="itineraire-wrapper">
      <div className="itineraire-panel">
        <label>Adresse de départ :</label>
        <input value={depart} onChange={(e) => setDepart(e.target.value)} placeholder="Ex : 3000 boul Crémazie" />
        <label>Adresse d’arrivée :</label>
        <input value={arrivee} onChange={(e) => setArrivee(e.target.value)} placeholder="Ex : Station Berri-UQAM" />

        <div className="itineraire-actions">
          <button onClick={handleSwap}>⇅ Inverser</button>
          <button onClick={handleSearch}>🔍 Rechercher</button>
        </div>
      </div>

      <MapContainer center={[45.508888, -73.561668]} zoom={13} scrollWheelZoom style={{ height: 460 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {coords.length > 0 && <Polyline positions={coords} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default BlocItineraireSTM;
