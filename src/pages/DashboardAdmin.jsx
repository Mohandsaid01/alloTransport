/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/connexion');
    }
  }, [user, navigate]);

  // Charger les utilisateurs
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/clients');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'users') {
      loadUsers();
    }
  }, [activeSection]);

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'users', label: 'Gestion des utilisateurs' },
    { id: 'reports', label: 'Rapports d\'incidents' },
    { id: 'finances', label: 'Finances' },
    { id: 'system', label: 'Configuration système' }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <div className="content-section">
            <h2>Vue d'ensemble du système</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Utilisateurs actifs</h3>
                <div className="stat-value">{users.length}</div>
              </div>
              <div className="stat-card">
                <h3>Transactions aujourd'hui</h3>
                <div className="stat-value">--</div>
              </div>
              <div className="stat-card">
                <h3>Incidents ouverts</h3>
                <div className="stat-value">--</div>
              </div>
              <div className="stat-card">
                <h3>Revenus du mois</h3>
                <div className="stat-value">-- $</div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="content-section">
            <h2>Gestion des utilisateurs</h2>
            <div className="section-actions">
              <button className="btn-primary" onClick={loadUsers}>
                Actualiser la liste
              </button>
              <button className="btn-secondary">Exporter la liste</button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Carte Opus</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="no-data">Chargement...</td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.prenom} {user.nom}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.carte_opus || 'Aucune'}</td>
                        <td>
                          <button className="btn-action edit">Modifier</button>
                          <button className="btn-action delete">Supprimer</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">Aucun utilisateur trouvé</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="content-section">
            <h2>Rapports d'incidents</h2>
            <div className="filter-bar">
              <select className="filter-select">
                <option>Tous les statuts</option>
                <option>En attente</option>
                <option>En cours</option>
                <option>Résolu</option>
              </select>
              <select className="filter-select">
                <option>Toutes les lignes</option>
                <option>Ligne verte</option>
                <option>Ligne orange</option>
                <option>Ligne bleue</option>
              </select>
            </div>
            <div className="reports-grid">
              <div className="report-card">
                <div className="report-header">
                  <span className="report-status pending">En attente</span>
                  <span className="report-date">--</span>
                </div>
                <h4>Aucun incident signalé</h4>
                <p>Aucun rapport d'incident disponible pour le moment</p>
              </div>
            </div>
          </div>
        );
      case 'finances':
        return (
          <div className="content-section">
            <h2>Gestion financière</h2>
            <div className="financial-overview">
              <div className="financial-card">
                <h3>Revenus journaliers</h3>
                <div className="financial-value">-- $</div>
              </div>
              <div className="financial-card">
                <h3>Revenus mensuels</h3>
                <div className="financial-value">-- $</div>
              </div>
              <div className="financial-card">
                <h3>Cartes actives</h3>
                <div className="financial-value">--</div>
              </div>
            </div>
          </div>
        );
      case 'system':
        return (
          <div className="content-section">
            <h2>Configuration système</h2>
            <div className="config-section">
              <h3>Paramètres généraux</h3>
              <div className="config-item">
                <label>Tarif de base</label>
                <input type="number" className="config-input" placeholder="0.00" />
              </div>
              <div className="config-item">
                <label>Durée de validité des cartes (mois)</label>
                <input type="number" className="config-input" placeholder="12" />
              </div>
              <button className="btn-primary">Sauvegarder les modifications</button>
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
    <div className="dashboard-admin">
      <header className="dashboard-header">
        <h1>Dashboard Administrateur</h1>
        <div className="header-actions">
          <span className="user-info">
            {user.prenom} {user.nom} - {user.role}
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>
      
      <div className="dashboard-content">
        <nav className="sidebar">
          <ul className="nav-menu">
            {menuItems.map(item => (
              <li key={item.id}>
                <button 
                  className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;