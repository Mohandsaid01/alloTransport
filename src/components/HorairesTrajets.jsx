import React, { useState, useEffect } from 'react';
import './HorairesTrajets.css';
import stmApiService from '../services/stmApiService';

const HorairesTrajets = () => {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState('');

  useEffect(() => {
    const fetchTripUpdates = async () => {
      try {
        setLoading(true);
        const data = await stmApiService.getTripUpdates();
        setTripData(data);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripUpdates();
    
    // Actualiser toutes les 20 secondes
    const interval = setInterval(fetchTripUpdates, 20000);
    return () => clearInterval(interval);
  }, []);

  const getUniqueRoutes = () => {
    if (!tripData?.trips) return [];
    const routes = tripData.trips
      .map(t => t.routeId)
      .filter(id => id && id !== 'Inconnu')
      .sort();
    return [...new Set(routes)];
  };

  const getFilteredTrips = () => {
    if (!tripData?.trips) return [];
    if (!selectedRoute) return tripData.trips;
    return tripData.trips.filter(t => t.routeId === selectedRoute);
  };

  const getDelayStatus = (delay) => {
    if (delay === 0) return 'on-time';
    if (delay > 0) return 'delayed';
    return 'early';
  };

  const formatDelay = (delay) => {
    if (delay === 0) return 'À l\'heure';
    const minutes = Math.abs(Math.floor(delay / 60));
    const seconds = Math.abs(delay % 60);
    const sign = delay > 0 ? '+' : '-';
    
    if (minutes > 0) {
      return `${sign}${minutes}min ${seconds}s`;
    }
    return `${sign}${seconds}s`;
  };

  if (loading) {
    return (
      <div className="horaires-trajets">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Chargement des horaires et trajets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="horaires-trajets">
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

  const filteredTrips = getFilteredTrips();
  const routes = getUniqueRoutes();

  return (
    <div className="horaires-trajets">
      <div className="container">
        <header className="page-header">
          <h1>Horaires et Trajets</h1>
          <p>Mises à jour en temps réel des horaires STM</p>
        </header>

        <div className="data-overview">
          <div className="overview-stats">
            <div className="stat-card">
              <h3>Trajets Actifs</h3>
              <div className="stat-number">{tripData?.tripCount || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Routes Suivies</h3>
              <div className="stat-number">{routes.length}</div>
            </div>
            <div className="stat-card">
              <h3>Type de Données</h3>
              <div className="stat-text">{tripData?.dataType || 'N/A'}</div>
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

        {tripData?.dataReceived && filteredTrips.length > 0 ? (
          <div className="trips-section">
            <div className="section-header">
              <h2>
                {selectedRoute ? `Trajets Route ${selectedRoute}` : 'Tous les Trajets'}
                <span className="trip-count">({filteredTrips.length})</span>
              </h2>
              <p className="last-update">
                Dernière mise à jour: {stmApiService.formatTime(tripData.timestamp)}
              </p>
            </div>

            <div className="trips-grid">
              {filteredTrips.map((trip, index) => (
                <div key={trip.id || index} className="trip-card">
                  <div className="trip-header">
                    <div className="trip-main-info">
                      <h3>Trajet {trip.tripId || 'N/A'}</h3>
                      <span className="route-badge">Route {trip.routeId}</span>
                    </div>
                    <div className={`delay-indicator ${getDelayStatus(trip.delay)}`}>
                      {formatDelay(trip.delay)}
                    </div>
                  </div>
                  
                  <div className="trip-info">
                    {trip.vehicleId && (
                      <div className="info-row">
                        <span className="label">Véhicule:</span>
                        <span className="value">{trip.vehicleId}</span>
                      </div>
                    )}
                    
                    <div className="info-row">
                      <span className="label">Retard global:</span>
                      <span className={`value delay-${getDelayStatus(trip.delay)}`}>
                        {formatDelay(trip.delay)}
                      </span>
                    </div>

                    {trip.stopUpdates && trip.stopUpdates.length > 0 && (
                      <div className="stops-section">
                        <h4>Arrêts avec mises à jour</h4>
                        <div className="stops-list">
                          {trip.stopUpdates.map((stop, stopIndex) => (
                            <div key={stopIndex} className="stop-card">
                              <div className="stop-header">
                                <span className="stop-id">Arrêt {stop.stopId}</span>
                                {stop.sequence && (
                                  <span className="stop-sequence">#{stop.sequence}</span>
                                )}
                              </div>
                              
                              <div className="stop-times">
                                {stop.arrivalDelay !== undefined && (
                                  <div className="time-info">
                                    <span className="time-label">Arrivée:</span>
                                    <span className={`time-value delay-${getDelayStatus(stop.arrivalDelay)}`}>
                                      {formatDelay(stop.arrivalDelay)}
                                    </span>
                                  </div>
                                )}
                                
                                {stop.departureDelay !== undefined && (
                                  <div className="time-info">
                                    <span className="time-label">Départ:</span>
                                    <span className={`time-value delay-${getDelayStatus(stop.departureDelay)}`}>
                                      {formatDelay(stop.departureDelay)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!trip.stopUpdates || trip.stopUpdates.length === 0) && (
                      <div className="no-stops">
                        <p>Aucune mise à jour d'arrêt disponible</p>
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
              {tripData?.dataReceived 
                ? 'Aucun trajet trouvé pour les critères sélectionnés.'
                : 'Les données d\'horaires ne sont pas disponibles actuellement.'}
            </p>
            {tripData?.message && (
              <p className="data-message">{tripData.message}</p>
            )}
          </div>
        )}

        {tripData?.feedInfo && (
          <div className="feed-info">
            <h3>Informations du flux de données</h3>
            <div className="feed-details">
              <div className="feed-item">
                <span className="label">Version GTFS-RT:</span>
                <span className="value">{tripData.feedInfo.version || 'N/A'}</span>
              </div>
              <div className="feed-item">
                <span className="label">Timestamp du flux:</span>
                <span className="value">
                  {tripData.feedInfo.timestamp 
                    ? stmApiService.formatTime(new Date(tripData.feedInfo.timestamp * 1000))
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
            Actualiser les horaires
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorairesTrajets;