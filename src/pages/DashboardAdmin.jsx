/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import './DashboardAdmin.css';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const DashboardAdmin = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/connexion');
    }
  }, [user, navigate]);

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

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/incidents');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Erreur chargement incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'users') loadUsers();
    if (activeSection === 'reports') loadReports();
  }, [activeSection]);

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const handleChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/clients/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });
      if (response.ok) {
        alert('Utilisateur mis à jour avec succès');
        setEditingUserId(null);
        loadUsers();
      } else {
        alert('Erreur de modification');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur réseau');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/clients/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          loadUsers();
        } else {
          alert("Erreur lors de la suppression");
        }
      } catch (error) {
        console.error(error);
        alert("Erreur réseau");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const menuItems = [
    { id: 'overview', label: "Vue d'ensemble" },
    { id: 'users', label: 'Gestion des utilisateurs' },
    { id: 'reports', label: "Rapports d'incidents" },
    { id: 'finances', label: 'Finances' },
    { id: 'system', label: 'Configuration système' },
  ];

  const renderContent = () => {
    switch (activeSection) {
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
                <h3>Rapports d'incidents</h3>
                <div className="stat-value">{reports.length}</div>
              </div>
              <div className="stat-card">
                <h3>Revenus du mois</h3>
                <div className="stat-value">-- $</div>
              </div>
              <div className="stat-card">
                <h3>Cartes actives</h3>
                <div className="stat-value">--</div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="content-section">
            <h2>Gestion des utilisateurs</h2>
            <div className="section-actions">
              <button className="btn-primary" onClick={loadUsers}>Actualiser la liste</button>
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
                    <tr><td colSpan="5" className="no-data">Chargement...</td></tr>
                  ) : users.length > 0 ? (
                    users.map(u => (
                      <tr key={u.id}>
                        <td>
                          {editingUserId === u.id ? (
                            <>
                              <input value={editedUser.prenom || ''} onChange={(e) => handleChange('prenom', e.target.value)} placeholder="Prénom" />
                              <input value={editedUser.nom || ''} onChange={(e) => handleChange('nom', e.target.value)} placeholder="Nom" />
                            </>
                          ) : `${u.prenom} ${u.nom}`}
                        </td>
                        <td>{editingUserId === u.id ? (
                          <input value={editedUser.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
                        ) : u.email}</td>
                        <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                        <td>{u.carte_opus || 'Aucune'}</td>
                        <td>
                          {editingUserId === u.id ? (
                            <>
                              <button className="btn-action edit" onClick={handleSaveEdit}><FaSave /> Sauvegarder</button>
                              <button className="btn-action delete" onClick={handleCancelEdit}><FaTimes /> Annuler</button>
                            </>
                          ) : (
                            <>
                              <button className="btn-action edit" onClick={() => handleEditClick(u)}><FaEdit /> Modifier</button>
                              <button className="btn-action delete" onClick={() => handleDelete(u.id)}><FaTrash /> Supprimer</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="no-data">Aucun utilisateur trouvé</td></tr>
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
            <div className="reports-grid">
              {loading ? (
                <p>Chargement...</p>
              ) : reports.length > 0 ? (
                reports.map(r => (
                  <div key={r.id} className="report-card">
                    <div className="report-header">
                      <span className={`report-status ${r.gravite.toLowerCase()}`}>{r.gravite}</span>
                      <span className="report-date">{r.date_created || '--'}</span>
                    </div>
                    <h4>{r.type_incident}</h4>
                    <p><strong>Ligne :</strong> {r.ligne}</p>
                    <p><strong>Lieu :</strong> {r.station}</p>
                    <p>{r.description}</p>
                    <p><em>{r.email ? `Email: ${r.email}` : "Rapport anonyme"}</em></p>

                  </div>
                ))
              ) : (
                <p>Aucun incident signalé</p>
              )}
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
        return <div className="content-section">Section inconnue</div>;
    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="dashboard-admin">
      <header className="dashboard-header">
        <h1>Dashboard Administrateur</h1>
        <div className="header-actions">
          <span className="user-info">{user.prenom} {user.nom} - {user.role}</span>
          <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
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

        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
