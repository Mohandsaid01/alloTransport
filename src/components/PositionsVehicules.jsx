import React, { useState, useEffect } from 'react';
import './PositionsVehicules.css';
import stmApiService from '../services/stmApiService';

const PositionsVehicules = () => {
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState('');

  useEffect(() => {
    const fetchVehiclePositions = async () => {
      try {
        setLoading(true);
        const data = await stmApiService.getVehiclePositions();
        setVehicleData(data);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehiclePositions();
    
    // Actualiser toutes les 15 secondes
    const interval = setInterval(fetchVehiclePositions, 15000);
    return () => clearInterval(interval);
  }, []);

  const getUniqueRoutes = () => {
    if (!vehicleData?.vehicles) return [];
    const routes = vehicleData.vehicles
      .map(v => v.routeId)
      .filter(id => id && id !== 'Inconnu')
      .sort();
    return [...new Set(routes)];
  };

  const getFilteredVehicles = () => {
    if (!vehicleData?.vehicles) return [];
    if (!selectedRoute) return vehicleData.vehicles;
    return vehicleData.vehicles.filter(v => v.routeId === selectedRoute);
  };

  if (loading) {
    return (
      <div className="positions-vehicules">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Chargement des positions des véhicules...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="positions-vehicules">
        <div className="container">
          <div className="error">
            <h2>Erreur de connexion</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredVehicles = getFilteredVehicles();
  const routes = getUniqueRoutes();

  return (
    <div className="positions-vehicules">
      <div className="container">
        <header className="page-header">
          <h1>Positions des Véhicules</h1>
          <p>Localisation en temps réel des autobus STM</p>
        </header>

        <div className="data-overview">
          <div className="overview-stats">
            <div className="stat-card">
              <h3>Véhicules Actifs</h3>
              <div className="stat-number">{vehicleData?.vehicleCount || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Routes Actives</h3>
              <div className="stat-number">{routes.length}</div>
            </div>
            <div className="stat-card">
              <h3>Type de Données</h3>
              <div className="stat-text">{vehicleData?.dataType || 'N/A'}</div>
            </div>
          </div>

          <div className="filter-section">
            <label htmlFor="route-filter">Filtrer par route:</label>
            <select 
              id="route-filter"
              value={selectedRoute} 
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="route-select"
            >
              <option value="">Toutes les routes</option>
              {routes.map(route => (
                <option key={route} value={route}>
                  Route {route}
                </option>
              ))}
            </select>
          </div>
        </div>

        {vehicleData?.dataReceived && filteredVehicles.length > 0 ? (
          <div className="vehicles-section">
            <div className="section-header">
              <h2>
                {selectedRoute ? `Véhicules Route ${selectedRoute}` : 'Tous les Véhicules'}
                <span className="vehicle-count">({filteredVehicles.length})</span>
              </h2>
              <p className="last-update">
                Dernière mise à jour: {stmApiService.formatTime(vehicleData.timestamp)}
              </p>
            </div>

            <div className="vehicles-grid">
              {filteredVehicles.map((vehicle, index) => (
                <div key={vehicle.id || index} className="vehicle-card">
                  <div className="vehicle-header">
                    <h3>Véhicule {vehicle.vehicleId}</h3>
                    <span className="route-badge">Route {vehicle.routeId}</span>
                  </div>
                  
                  <div className="vehicle-info">
                    <div className="info-row">
                      <span className="label">Statut:</span>
                      <span className={`status ${vehicle.status ? 'active' : 'inactive'}`}>
                        {vehicle.status || 'En service'}
                      </span>
                    </div>
                    
                    {vehicle.position && (
                      <div className="position-info">
                        <h4>Position GPS</h4>
                        <div className="coordinates">
                          <div className="coordinate">
                            <span className="label">Latitude:</span>
                            <span className="value">{vehicle.position.latitude.toFixed(6)}</span>
                          </div>
                          <div className="coordinate">
                            <span className="label">Longitude:</span>
                            <span className="value">{vehicle.position.longitude.toFixed(6)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {vehicle.tripId && (
                      <div className="info-row">
                        <span className="label">Voyage:</span>
                        <span className="value">{vehicle.tripId}</span>
                      </div>
                    )}
                    
                    {vehicle.timestamp && (
                      <div className="info-row">
                        <span className="label">Dernière position:</span>
                        <span className="value">{stmApiService.formatTime(vehicle.timestamp)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-data">
            <h2>Aucune donnée disponible</h2>
            <p>
              {vehicleData?.dataReceived 
                ? 'Aucun véhicule trouvé pour les critères sélectionnés.'
                : 'Les données de position ne sont pas disponibles actuellement.'}
            </p>
            {vehicleData?.message && (
              <p className="data-message">{vehicleData.message}</p>
            )}
          </div>
        )}

        {vehicleData?.feedInfo && (
          <div className="feed-info">
            <h3>Informations du flux de données</h3>
            <div className="feed-details">
              <div className="feed-item">
                <span className="label">Version GTFS-RT:</span>
                <span className="value">{vehicleData.feedInfo.version || 'N/A'}</span>
              </div>
              <div className="feed-item">
                <span className="label">Timestamp du flux:</span>
                <span className="value">
                  {vehicleData.feedInfo.timestamp 
                    ? stmApiService.formatTime(new Date(vehicleData.feedInfo.timestamp * 1000))
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="refresh-section">
          <button 
            onClick={() => window.location.reload()} 
            className="refresh-btn"
          >
            Actualiser les positions
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionsVehicules;