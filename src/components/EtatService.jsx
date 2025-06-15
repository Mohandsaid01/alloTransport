import React, { useState, useEffect } from 'react';
import './EtatService.css';
import stmApiService from '../services/stmApiService';

const EtatService = () => {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceStatus = async () => {
      try {
        setLoading(true);
        const data = await stmApiService.getServiceStatus();
        setServiceData(data);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceStatus();
    
    // Actualiser toutes les 30 secondes
    const interval = setInterval(fetchServiceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'status-normal';
      case 'Perturbé': return 'status-perturbe';
      case 'Critique': return 'status-critique';
      default: return 'status-normal';
    }
  };

  if (loading) {
    return (
      <div className="etat-service">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Chargement de l'état du service...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="etat-service">
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

  return (
    <div className="etat-service">
      <div className="container">
        <header className="page-header">
          <h1>État du Service STM</h1>
          <p>Informations en temps réel sur le réseau de transport</p>
        </header>

        <div className="status-overview">
          <div className={`status-card ${getStatusColor(serviceData.status)}`}>
            <h2>Statut Global</h2>
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span className="status-text">{serviceData.status}</span>
            </div>
            <p className="last-update">
              Dernière mise à jour: {stmApiService.formatTime(serviceData.lastUpdate)}
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Alertes Actives</h3>
              <div className="stat-number">{serviceData.activeAlerts}</div>
            </div>
            <div className="stat-card">
              <h3>Alertes Critiques</h3>
              <div className="stat-number critical">{serviceData.criticalAlerts}</div>
            </div>
          </div>
        </div>

        {serviceData.alerts && serviceData.alerts.length > 0 && (
          <div className="alerts-section">
            <h2>Alertes et Perturbations</h2>
            <div className="alerts-list">
              {serviceData.alerts.map((alert, index) => (
                <div key={index} className="alert-card">
                  <div className="alert-header">
                    <span className={`alert-priority ${alert.priority?.toLowerCase() || 'normal'}`}>
                      {alert.priority || 'INFO'}
                    </span>
                    <span className="alert-time">
                      {alert.timestamp ? stmApiService.formatTime(alert.timestamp) : 'N/A'}
                    </span>
                  </div>
                  <h3>{alert.title || alert.headerText || 'Alerte'}</h3>
                  <p>{alert.description || alert.descriptionText || 'Aucune description disponible'}</p>
                  {alert.route && (
                    <div className="alert-route">
                      Route concernée: {alert.route}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {(!serviceData.alerts || serviceData.alerts.length === 0) && (
          <div className="no-alerts">
            <h2>Aucune alerte active</h2>
            <p>Le service fonctionne normalement sur l'ensemble du réseau.</p>
          </div>
        )}

        <div className="refresh-section">
          <button 
            onClick={() => window.location.reload()} 
            className="refresh-btn"
          >
            Actualiser les données
          </button>
        </div>
      </div>
    </div>
  );
};

export default EtatService;