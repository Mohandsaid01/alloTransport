/* eslint-disable no-unused-vars */
// pages/DashboardClient.jsx - Version COMPLÈTE avec Google Maps
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import MapComponent from '../components/MapComponent';
import StripePaymentForm from '../components/StripePaymentForm';
import './DashboardClient.css';

const DashboardClient = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  
  // États pour le planificateur de trajet
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [wheelchairAccess, setWheelchairAccess] = useState(false);
  const [fastestRoute, setFastestRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  
  // États pour le rechargement
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  
  // États pour Stripe
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est client
  useEffect(() => {
    if (!user || user.role !== 'client') {
      navigate('/connexion');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const handlePlanTrip = () => {
    if (!departure || !destination) {
      alert('Veuillez remplir les champs de départ et destination');
      return;
    }
    // La carte Google Maps calculera automatiquement l'itinéraire
  };

  const handleRouteCalculated = (info) => {
    setRouteInfo(info);
    console.log('Itinéraire calculé:', info);
  };

  const handleRecharge = async (amount) => {
    if (!paymentMethod) {
      alert('Veuillez sélectionner une méthode de paiement');
      return;
    }
    
    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
      alert('Veuillez remplir toutes les informations de paiement');
      return;
    }

    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`Rechargement de ${amount}$ pour l'utilisateur ${user.id}`);
      alert(`Rechargement de ${amount}$ effectué avec succès!\nVotre nouvelle carte sera rechargée dans quelques minutes.`);
      
      // Réinitialiser le formulaire
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardHolder('');
      setPaymentMethod('');
      
    } catch (error) {
      console.error('Erreur rechargement:', error);
      alert('Erreur lors du rechargement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomRecharge = () => {
    const amount = parseFloat(customAmount);
    if (!amount || amount < 5 || amount > 500) {
      alert('Le montant doit être entre 5$ et 500$');
      return;
    }
    handleRecharge(amount);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Paiement réussi:', paymentIntent);
    
    // Ajouter à l'historique
    const newRecharge = {
      amount: selectedAmount,
      date: new Date().toLocaleDateString('fr-CA'),
      status: 'success',
      transactionId: paymentIntent.id
    };
    
    setRechargeHistory([newRecharge, ...rechargeHistory]);
    
    // Réinitialiser
    setSelectedAmount(null);
    setCustomAmount('');
    
    // Afficher le succès
    alert(`Rechargement de ${selectedAmount.toFixed(2)}$ effectué avec succès! Votre carte Opus a été créditée.`);
  };

  const handlePaymentError = (error) => {
    console.error('Erreur de paiement:', error);
    alert(`Erreur de paiement: ${error}`);
  };

  const menuItems = [
    { id: 'overview', label: 'Mon compte' },
    { id: 'card', label: 'Ma carte Opus' },
    { id: 'recharge', label: 'Rechargement' },
    { id: 'travel', label: 'Planifier un trajet' },
    { id: 'history', label: 'Historique' },
    { id: 'incidents', label: 'Signaler un incident' }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <div className="content-section">
            <h2>Bienvenue sur votre espace personnel</h2>
            <div className="client-overview">
              <div className="welcome-card">
                <h3>Votre profil</h3>
                <div className="profile-info">
                  <div className="info-item">
                    <span className="label">Nom:</span>
                    <span className="value">{user.prenom} {user.nom}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{user.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Carte Opus:</span>
                    <span className="value">{user.carte_opus || 'Aucune'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Statut:</span>
                    <span className="status-badge active">Actif</span>
                  </div>
                </div>
              </div>
              <div className="quick-stats">
                <div className="stat-item">
                  <h4>Solde carte</h4>
                  <div className="amount">-- $</div>
                </div>
                <div className="stat-item">
                  <h4>Voyages ce mois</h4>
                  <div className="count">--</div>
                </div>
                <div className="stat-item">
                  <h4>Économies réalisées</h4>
                  <div className="savings">-- $</div>
                </div>
              </div>
            </div>
            <div className="recent-activity">
              <h3>Activité récente</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon travel"></div>
                  <div className="activity-details">
                    <span>Aucune activité récente</span>
                    <span className="activity-time">--</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="content-section">
            <h2>Ma carte Opus</h2>
            <div className="card-section">
              <div className="opus-card-display">
                <div className="opus-card">
                  <div className="card-header">
                    <span className="card-logo">STM</span>
                    <span className="card-type">OPUS</span>
                  </div>
                  <div className="card-number">
                    {user.carte_opus ? 
                      `•••• •••• •••• ${user.carte_opus.slice(-4)}` : 
                      '•••• •••• •••• ••••'
                    }
                  </div>
                  <div className="card-info">
                    <div className="card-holder">
                      <span className="label">Titulaire</span>
                      <span className="name">{user.prenom} {user.nom}</span>
                    </div>
                    <div className="card-expiry">
                      <span className="label">Exp.</span>
                      <span className="date">--/--</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-details">
                <h3>Informations de la carte</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Numéro de carte</span>
                    <span className="detail-value">{user.carte_opus || 'Non définie'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Solde actuel</span>
                    <span className="detail-value balance">-- $</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Statut</span>
                    <span className="detail-value status">
                      {user.carte_opus ? 'Active' : 'Non configurée'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Dernière utilisation</span>
                    <span className="detail-value">--</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button 
                    className="btn-card-action primary"
                    onClick={() => setActiveSection('recharge')}
                  >
                    Recharger la carte
                  </button>
                  <button className="btn-card-action secondary">
                    Bloquer la carte
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'recharge':
        return (
          <div className="content-section">
            <h2>Rechargement de carte Opus</h2>
            <div className="recharge-container-stripe">
              
              {/* Section sélection du montant */}
              <div className="amount-selection">
                <h3>Choisissez un montant</h3>
                <div className="amount-grid">
                  <button 
                    className={`amount-btn ${selectedAmount === 10 ? 'selected' : ''}`}
                    onClick={() => setSelectedAmount(10)}
                  >
                    10 $
                  </button>
                  <button 
                    className={`amount-btn ${selectedAmount === 20 ? 'selected' : ''}`}
                    onClick={() => setSelectedAmount(20)}
                  >
                    20 $
                  </button>
                  <button 
                    className={`amount-btn ${selectedAmount === 50 ? 'selected' : ''}`}
                    onClick={() => setSelectedAmount(50)}
                  >
                    50 $
                  </button>
                  <button 
                    className={`amount-btn ${selectedAmount === 100 ? 'selected' : ''}`}
                    onClick={() => setSelectedAmount(100)}
                  >
                    100 $
                  </button>
                </div>
                
                <div className="custom-amount">
                  <label>Montant personnalisé (5$ - 500$)</label>
                  <div className="custom-amount-input">
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      min="5" 
                      max="500"
                      step="0.01"
                      value={customAmount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value >= 5 && value <= 500) {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(value);
                        }
                      }}
                    />
                    <button 
                      className="btn-select-custom"
                      onClick={() => {
                        const value = parseFloat(customAmount);
                        if (value >= 5 && value <= 500) {
                          setSelectedAmount(value);
                        } else {
                          alert('Le montant doit être entre 5$ et 500$');
                        }
                      }}
                      disabled={!customAmount || customAmount < 5 || customAmount > 500}
                    >
                      Sélectionner
                    </button>
                  </div>
                </div>

                {selectedAmount && (
                  <div className="selected-amount-display">
                    <strong>Montant sélectionné: {selectedAmount.toFixed(2)} $ CAD</strong>
                  </div>
                )}
              </div>

              {/* Section paiement Stripe */}
              {selectedAmount && (
                <div className="stripe-payment-section">
                  <h3>Paiement sécurisé</h3>
                  <div className="payment-info">
                    <p>Votre carte Opus sera rechargée immédiatement après le paiement.</p>
                    <div className="security-badges">
                      <span className="security-badge">🔒 Paiement sécurisé par Stripe</span>
                      <span className="security-badge">✅ Rechargement instantané</span>
                    </div>
                  </div>
                  
                  <StripePaymentForm
                    amount={selectedAmount}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              )}

              {/* Historique des rechargements */}
              <div className="recharge-history">
                <h3>Derniers rechargements</h3>
                <div className="history-list">
                  {rechargeHistory.length > 0 ? (
                    rechargeHistory.map((recharge, index) => (
                      <div key={index} className="recharge-item">
                        <div className="recharge-details">
                          <span className="recharge-amount">+{recharge.amount.toFixed(2)} $</span>
                          <span className="recharge-date">{recharge.date}</span>
                        </div>
                        <span className={`recharge-status ${recharge.status}`}>
                          {recharge.status === 'success' ? 'Réussi' : 'En cours'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="no-history">
                      <p>Aucun rechargement récent</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'travel':
        return (
          <div className="content-section">
            <h2>Planificateur de trajet STM</h2>
            <div className="travel-planner-enhanced">
              <div className="trip-form-compact">
                <div className="location-inputs-row">
                  <div className="input-group-inline">
                    <label>Départ</label>
                    <input 
                      type="text" 
                      placeholder="Adresse, station ou point d'intérêt"
                      value={departure}
                      onChange={(e) => setDeparture(e.target.value)}
                    />
                  </div>
                  <button 
                    className="btn-switch-locations"
                    onClick={() => {
                      const temp = departure;
                      setDeparture(destination);
                      setDestination(temp);
                    }}
                    title="Inverser départ et destination"
                  >
                    ⇄
                  </button>
                  <div className="input-group-inline">
                    <label>Destination</label>
                    <input 
                      type="text" 
                      placeholder="Adresse, station ou point d'intérêt"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Carte Google Maps avec panel des itinéraires intégré */}
              <div className="map-section-enhanced">
                <MapComponent
                  departure={departure}
                  destination={destination}
                  onRouteCalculated={handleRouteCalculated}
                />
              </div>

              {/* Instructions détaillées pour l'itinéraire sélectionné */}
              {routeInfo && (
                <div className="detailed-instructions">
                  <div className="instructions-header">
                    <h3>Instructions détaillées</h3>
                    <div className="route-summary-compact">
                      <span className="total-time">{routeInfo.duration}</span>
                      <span className="total-distance">{routeInfo.distance}</span>
                      {routeInfo.transferCount > 0 && (
                        <span className="transfers-count">
                          {routeInfo.transferCount} correspondance{routeInfo.transferCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="step-by-step">
                    {routeInfo.steps && routeInfo.steps.map((step, index) => (
                      <div key={index} className="instruction-step">
                        <div className="step-number">{index + 1}</div>
                        <div className="step-content">
                          <div className="step-main">
                            <span className="step-action">{step.instructions}</span>
                            <span className="step-duration">{step.duration}</span>
                          </div>
                          
                          {step.transitDetails && (
                            <div className="transit-info-detailed">
                              <div className="line-info">
                                <span 
                                  className="line-badge"
                                  style={{ 
                                    backgroundColor: step.transitDetails.color,
                                    color: step.transitDetails.textColor 
                                  }}
                                >
                                  {step.transitDetails.line}
                                </span>
                                <span className="line-destination">
                                  direction {step.transitDetails.headsign}
                                </span>
                              </div>
                              
                              <div className="stop-details">
                                <div className="departure-stop">
                                  <strong>Montez à:</strong> {step.transitDetails.departure.stop}
                                  <span className="departure-time">à {step.transitDetails.departure.time}</span>
                                </div>
                                <div className="arrival-stop">
                                  <strong>Descendez à:</strong> {step.transitDetails.arrival.stop}
                                  <span className="arrival-time">à {step.transitDetails.arrival.time}</span>
                                </div>
                                {step.transitDetails.numStops && (
                                  <div className="stops-info">
                                    Trajet: {step.transitDetails.numStops} arrêt{step.transitDetails.numStops > 1 ? 's' : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="content-section">
            <h2>Historique des voyages</h2>
            <div className="history-filters">
              <select className="history-filter">
                <option>Cette semaine</option>
                <option>Ce mois</option>
                <option>3 derniers mois</option>
                <option>Cette année</option>
              </select>
              <select className="history-filter">
                <option>Tous les types</option>
                <option>Métro</option>
                <option>Bus</option>
              </select>
            </div>
            <div className="history-summary">
              <div className="summary-card">
                <h4>Total des voyages</h4>
                <div className="summary-value">{transactions.length}</div>
              </div>
              <div className="summary-card">
                <h4>Montant dépensé</h4>
                <div className="summary-value">-- $</div>
              </div>
              <div className="summary-card">
                <h4>Moyenne par voyage</h4>
                <div className="summary-value">-- $</div>
              </div>
            </div>
            <div className="history-list">
              {transactions.length > 0 ? (
                transactions.map(transaction => (
                  <div key={transaction.id} className="history-item">
                    <div className="trip-info">
                      <div className="trip-route">{transaction.type}</div>
                      <div className="trip-details">
                        <span>{transaction.description || 'Voyage en transport'}</span>
                      </div>
                    </div>
                    <div className="trip-cost">{transaction.montant} $</div>
                  </div>
                ))
              ) : (
                <div className="history-item">
                  <div className="trip-info">
                    <div className="trip-route">Aucun voyage enregistré</div>
                    <div className="trip-details">
                      <span>L'historique des voyages apparaîtra ici une fois que vous aurez utilisé votre carte Opus</span>
                    </div>
                  </div>
                  <div className="trip-cost">-- $</div>
                </div>
              )}
            </div>
          </div>
        );

      case 'incidents':
        return (
          <div className="content-section">
            <h2>Signaler un incident</h2>
            <div className="incident-form">
              <div className="form-section">
                <h3>Détails de l'incident</h3>
                <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                const payload = {
                  type_incident: formData.get('incident-type'),
                  ligne: formData.get('line'),
                  station: formData.get('station'),
                  description: formData.get('description'),
                  gravite: formData.get('severity'),
                  suivi: formData.get('contact') === 'oui',
                  email: user.email  // utile pour le suivi
                };

                try {
                  const response = await fetch('http://127.0.0.1:8000/api/incidents', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                  });

                  if (response.ok) {
                    alert('Incident signalé avec succès!');
                    e.target.reset();
                  } else {
                    const errorData = await response.json();
                    alert('Erreur lors de l’envoi : ' + JSON.stringify(errorData));
                  }
                } catch (error) {
                  console.error(error);
                  alert('Une erreur est survenue lors de l’envoi.');
                }
              }}>

                  <div className="form-group">
                    <label>Type d'incident</label>
                    <select name="incident-type" required>
                      <option value="">Sélectionnez le type</option>
                      <option value="retard">Retard important</option>
                      <option value="panne">Panne de véhicule</option>
                      <option value="securite">Problème de sécurité</option>
                      <option value="service">Service non assuré</option>
                      <option value="accessibilite">Problème d'accessibilité</option>
                      <option value="proprete">Problème de propreté</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ligne concernée</label>
                    <select name="line" required>
                      <option value="">Sélectionnez la ligne</option>
                      <option value="orange">Ligne orange</option>
                      <option value="verte">Ligne verte</option>
                      <option value="bleue">Ligne bleue</option>
                      <option value="jaune">Ligne jaune</option>
                      <option value="bus">Bus (préciser le numéro)</option>
                      <option value="train">Train de banlieue</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Station/Arrêt ou numéro de bus</label>
                    <input 
                      type="text" 
                      name="station"
                      placeholder="Ex: Station Berri-UQAM, Arrêt René-Lévesque / Peel, Bus 80"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description détaillée</label>
                    <textarea 
                      name="description"
                      rows="4" 
                      placeholder="Décrivez l'incident en détail: heure exacte, circonstances, impact sur votre trajet, etc."
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Niveau de gravité</label>
                    <div className="severity-options">
                      <div className="severity-option">
                        <input type="radio" id="low" name="severity" value="faible" required />
                        <label htmlFor="low">Faible - Inconvénient mineur</label>
                      </div>
                      <div className="severity-option">
                        <input type="radio" id="medium" name="severity" value="modere" required />
                        <label htmlFor="medium">Modéré - Impact significatif</label>
                      </div>
                      <div className="severity-option">
                        <input type="radio" id="high" name="severity" value="eleve" required />
                        <label htmlFor="high">Élevé - Situation urgente</label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Souhaitez-vous être contacté pour un suivi?</label>
                    <div className="contact-options">
                      <div className="contact-option">
                        <input type="radio" id="contact-yes" name="contact" value="oui" />
                        <label htmlFor="contact-yes">Oui, par email</label>
                      </div>
                      <div className="contact-option">
                        <input type="radio" id="contact-no" name="contact" value="non" defaultChecked />
                        <label htmlFor="contact-no">Non, rapport anonyme</label>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn-submit-incident">
                    Soumettre le rapport d'incident
                  </button>
                </form>
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
    <div className="dashboard-client">
      <header className="dashboard-header">
        <h1>Mon espace STM</h1>
        <div className="header-user">
          <span className="user-greeting">
            Bonjour, {user.prenom} {user.nom}
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>
      
      <div className="dashboard-main">
        <nav className="navigation">
          <ul className="nav-menu">
            {menuItems.map(item => (
              <li key={item.id}>
                <button 
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardClient;