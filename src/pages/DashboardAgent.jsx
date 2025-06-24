/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import './DashboardAgent.css';

const DashboardAgent = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [incidents, setIncidents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est agent
  useEffect(() => {
    if (!user || user.role !== 'agent') {
      navigate('/connexion');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'incidents', label: 'Incidents assignés' },
    { id: 'reports', label: 'Mes rapports' },
    { id: 'validation', label: 'Validation cartes' },
    { id: 'communication', label: 'Communication' }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <div className="content-section">
            <h2>Tableau de bord agent</h2>
            <div className="agent-stats">
              <div className="agent-stat-card">
                <h3>Incidents en cours</h3>
                <div className="stat-number">{incidents.length}</div>
              </div>
              <div className="agent-stat-card">
                <h3>Rapports soumis</h3>
                <div className="stat-number">{reports.length}</div>
              </div>
              <div className="agent-stat-card">
                <h3>Cartes validées</h3>
                <div className="stat-number">--</div>
              </div>
              <div className="agent-stat-card">
                <h3>Statut de service</h3>
                <div className="status-indicator active">En service</div>
              </div>
            </div>
            <div className="quick-actions">
              <h3>Actions rapides</h3>
              <div className="action-buttons">
                <button className="action-btn incident">Signaler un incident</button>
                <button className="action-btn report">Créer un rapport</button>
                <button className="action-btn validate">Valider une carte</button>
              </div>
            </div>
          </div>
        );
      case 'incidents':
        return (
          <div className="content-section">
            <h2>Incidents assignés</h2>
            <div className="incident-filters">
              <select className="filter-dropdown">
                <option>Tous les statuts</option>
                <option>Nouveau</option>
                <option>En cours</option>
                <option>En attente</option>
              </select>
              <select className="filter-dropdown">
                <option>Toutes les priorités</option>
                <option>Critique</option>
                <option>Élevée</option>
                <option>Normale</option>
              </select>
            </div>
            <div className="incidents-list">
              {incidents.length > 0 ? (
                incidents.map(incident => (
                  <div key={incident.id} className="incident-item">
                    <div className="incident-info">
                      <div className="incident-priority high">Priorité élevée</div>
                      <h4>{incident.titre}</h4>
                      <p>{incident.contenu}</p>
                      <span className="incident-time">--</span>
                    </div>
                    <div className="incident-actions">
                      <button className="btn-action primary">Prendre en charge</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="incident-item">
                  <div className="incident-info">
                    <div className="incident-priority high">Priorité élevée</div>
                    <h4>Aucun incident assigné</h4>
                    <p>Vous n'avez actuellement aucun incident assigné</p>
                    <span className="incident-time">--</span>
                  </div>
                  <div className="incident-actions">
                    <button className="btn-action primary">Prendre en charge</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="content-section">
            <h2>Mes rapports</h2>
            <div className="section-header">
              <button className="btn-new-report">Nouveau rapport</button>
            </div>
            <div className="reports-container">
              {reports.length > 0 ? (
                reports.map(report => (
                  <div key={report.id} className="report-item">
                    <div className={`report-status ${report.valide ? 'validated' : 'draft'}`}>
                      {report.valide ? 'Validé' : 'Brouillon'}
                    </div>
                    <h4>{report.titre}</h4>
                    <p>{report.contenu}</p>
                    <div className="report-meta">
                      <span>Créé le: --</span>
                      <span>Modifié le: --</span>
                    </div>
                    <div className="report-actions">
                      <button className="btn-edit">Modifier</button>
                      {!report.valide && (
                        <button className="btn-submit">Soumettre</button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="report-item">
                  <div className="report-status draft">Brouillon</div>
                  <h4>Aucun rapport créé</h4>
                  <p>Vous n'avez pas encore créé de rapport de service</p>
                  <div className="report-meta">
                    <span>Créé le: --</span>
                    <span>Modifié le: --</span>
                  </div>
                  <div className="report-actions">
                    <button className="btn-edit">Modifier</button>
                    <button className="btn-submit">Soumettre</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'validation':
        return (
          <div className="content-section">
            <h2>Validation des cartes</h2>
            <div className="validation-tools">
              <div className="card-scanner">
                <h3>Scanner de carte</h3>
                <div className="scanner-area">
                  <p>Placez la carte Opus sur le lecteur</p>
                  <div className="scanner-status">En attente</div>
                </div>
              </div>
              <div className="validation-history">
                <h3>Dernières validations</h3>
                <div className="validation-list">
                  <div className="validation-item">
                    <span>Aucune validation récente</span>
                    <span className="validation-time">--</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'communication':
        return (
          <div className="content-section">
            <h2>Centre de communication</h2>
            <div className="communication-panel">
              <div className="dispatch-section">
                <h3>Communication avec dispatch</h3>
                <div className="message-area">
                  <div className="messages-list">
                    <div className="message-item">
                      <span>Aucun message</span>
                      <span className="message-time">--</span>
                    </div>
                  </div>
                  <div className="message-input">
                    <input type="text" placeholder="Tapez votre message..." />
                    <button className="btn-send">Envoyer</button>
                  </div>
                </div>
              </div>
              <div className="alerts-section">
                <h3>Alertes système</h3>
                <div className="alerts-list">
                  <div className="alert-item">
                    <span>Aucune alerte active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Section non trouvée</div>;
    }
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="dashboard-agent">
      <header className="dashboard-header">
        <h1>Dashboard Agent</h1>
        <div className="header-info">
          <span className="agent-badge">Agent de terrain</span>
          <div className="agent-status">
            <span className="status-dot"></span>
            <span>En service</span>
          </div>
          <span className="user-info">{user.prenom} {user.nom}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>
      
      <div className="dashboard-layout">
        <nav className="sidebar">
          <ul className="nav-list">
            {menuItems.map(item => (
              <li key={item.id}>
                <button 
                  className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <main className="main-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardAgent;