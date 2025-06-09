import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import './ItineraireBox.css';

const ItineraireBox = () => {
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [departSuggestions, setDepartSuggestions] = useState([]);
  const [arriveeSuggestions, setArriveeSuggestions] = useState([]);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  const orsKey = '5b3ce3597851110001cf6248d52917e65eb543afacfd53743254b931';

  const searchAddress = async (text, setter) => {
    if (text.length < 3) return;
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${text}&format=json&addressdetails=1`
    );
    setter(res.data);
  };

  const selectAddress = (data, setterText, setterCoords, clearSuggestions) => {
    setterText(data.display_name);
    setterCoords([parseFloat(data.lat), parseFloat(data.lon)]);
    clearSuggestions([]);
  };

  const getRoute = async () => {
    if (!startCoords || !endCoords) {
      alert('Veuillez sélectionner des adresses valides.');
      return;
    }

    const res = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
      {
        coordinates: [
          [startCoords[1], startCoords[0]],
          [endCoords[1], endCoords[0]],
        ],
      },
      {
        headers: {
          Authorization: orsKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const coords = res.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    setRouteCoords(coords);
  };

  const inverser = () => {
    const tmpText = depart;
    const tmpCoords = startCoords;
    setDepart(arrivee);
    setStartCoords(endCoords);
    setArrivee(tmpText);
    setEndCoords(tmpCoords);
  };

  return (
    <div className="itineraire-container">
      <div className="itineraire-box">
        <h3>🗺️ Planifier un itinéraire</h3>

        <div className="form-group">
          <label>🅰️ Adresse de départ</label>
          <input
            type="text"
            value={depart}
            onChange={(e) => {
              setDepart(e.target.value);
              searchAddress(e.target.value, setDepartSuggestions);
            }}
            placeholder="Ex : 1000 rue de la Gauchetière, Montréal"
          />
          {departSuggestions.length > 0 && (
            <ul className="suggestions">
              {departSuggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() =>
                    selectAddress(item, setDepart, setStartCoords, setDepartSuggestions)
                  }
                >
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <label>🅱️ Adresse d’arrivée</label>
          <input
            type="text"
            value={arrivee}
            onChange={(e) => {
              setArrivee(e.target.value);
              searchAddress(e.target.value, setArriveeSuggestions);
            }}
            placeholder="Ex : 3000 boul. de Maisonneuve, Montréal"
          />
          {arriveeSuggestions.length > 0 && (
            <ul className="suggestions">
              {arriveeSuggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() =>
                    selectAddress(item, setArrivee, setEndCoords, setArriveeSuggestions)
                  }
                >
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="itineraire-actions">
          <button onClick={inverser}>↔️ Inverser</button>
          <button onClick={getRoute}>Afficher l’itinéraire</button>
        </div>
      </div>

      <MapContainer
        center={[45.508888, -73.561668]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '400px', marginTop: '20px' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default ItineraireBox;
