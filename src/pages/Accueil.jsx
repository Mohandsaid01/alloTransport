import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Accueil.css';

const Accueil = () => {
  const navigate = useNavigate();

  return (
    <div className="accueil">
      {/* Hero principal avec animation */}
      <section className="hero-main">
        <div className="hero-background">
          <div className="metro-lines"></div>
          <div className="floating-shapes">
            <div className="shape bus"></div>
            <div className="shape metro"></div>
            <div className="shape opus"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-title">
            <span className="stm-logo">STM</span>
            <h1>AlloTransport</h1>
            <p className="hero-subtitle">Simplifiez vos déplacements dans le réseau de transport montréalais</p>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">68</span>
              <span className="stat-label">Stations de métro</span>
            </div>
            <div className="stat">
              <span className="stat-number">200+</span>
              <span className="stat-label">Lignes d'autobus</span>
            </div>
            <div className="stat">
              <span className="stat-number">24h</span>
              <span className="stat-label">Service continu</span>
            </div>
          </div>

          <div className="cta-section">
            <button className="btn-primary" onClick={() => navigate('/connexion')}>
              Se connecter
            </button>
            <button className="btn-outline" onClick={() => navigate('/inscription')}>
              Créer un compte
            </button>
          </div>
        </div>
      </section>

      {/* Section interactive */}
      <section className="features-interactive">
        <div className="container">
          <h2>Une expérience de transport moderne</h2>
          
          <div className="feature-showcase">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="app-interface">
                  <div className="app-header">
                    <div className="status-bar"></div>
                    <h3>Planifiez votre trajet</h3>
                  </div>
                  <div className="route-display">
                    <div className="route-point start">Berri-UQAM</div>
                    <div className="route-line"></div>
                    <div className="route-point end">Jean-Talon</div>
                    <div className="route-time">12 min</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="features-grid">
              <div className="feature-card tempo">
                <h3>Horaires en temps réel</h3>
                <p>Consultez les horaires actualisés de tous les bus et métros</p>
              </div>
              
              <div className="feature-card itineraire">
                <h3>Planification d'itinéraires</h3>
                <p>Trouvez le meilleur chemin pour vos déplacements</p>
              </div>
              
              <div className="feature-card opus">
                <h3>Gestion carte OPUS</h3>
                <p>Rechargez votre carte et consultez votre solde</p>
              </div>
              
              <div className="feature-card incident">
                <h3>Signalement d'incidents</h3>
                <p>Informez sur les problèmes rencontrés sur le réseau</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section réseau */}
      <section className="network-visual">
        <div className="container">
          <h2>Le réseau STM</h2>
          
          <div className="metro-map">
            <div className="ligne ligne-verte">
              <span className="ligne-nom">Ligne verte</span>
              <div className="stations">
                <div className="station">Angrignon</div>
                <div className="station">Berri-UQAM</div>
                <div className="station">Honoré-Beaugrand</div>
              </div>
            </div>
            
            <div className="ligne ligne-orange">
              <span className="ligne-nom">Ligne orange</span>
              <div className="stations">
                <div className="station">Côte-Vertu</div>
                <div className="station">Montmorency</div>
              </div>
            </div>
            
            <div className="ligne ligne-jaune">
              <span className="ligne-nom">Ligne jaune</span>
              <div className="stations">
                <div className="station">Berri-UQAM</div>
                <div className="station">Longueuil</div>
              </div>
            </div>
            
            <div className="ligne ligne-bleue">
              <span className="ligne-nom">Ligne bleue</span>
              <div className="stations">
                <div className="station">Snowdon</div>
                <div className="station">Saint-Michel</div>
              </div>
            </div>
          </div>
          
          <div className="network-benefits">
            <div className="benefit">
              <h3>Transport accessible</h3>
              <p>Stations adaptées aux personnes à mobilité réduite</p>
            </div>
            <div className="benefit">
              <h3>Réseau étendu</h3>
              <p>Couverture complète de la région métropolitaine</p>
            </div>
            <div className="benefit">
              <h3>Service fiable</h3>
              <p>Surveillance continue et maintenance régulière</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section tarification */}
      <section className="tarification">
        <div className="container">
          <h2>Tarification simple et flexible</h2>
          
          <div className="tarifs-grid">
            <div className="tarif-card">
              <h3>Mensuel</h3>
              <div className="prix">94,00 $</div>
              <p>Adulte</p>
              <div className="prix-reduit">57,50 $ étudiant/aîné</div>
            </div>
            
            <div className="tarif-card">
              <h3>Hebdomadaire</h3>
              <div className="prix">28,75 $</div>
              <p>Adulte</p>
              <div className="prix-reduit">17,50 $ étudiant/aîné</div>
            </div>
            
            <div className="tarif-card">
              <h3>Passage unique</h3>
              <div className="prix">3,70 $</div>
              <p>Adulte</p>
              <div className="prix-reduit">2,35 $ étudiant/aîné</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action final */}
      <section className="final-cta">
        <div className="container">
          <h2>Prêt à transformer vos déplacements?</h2>
          <p>Rejoignez des milliers d'utilisateurs qui ont déjà adopté AlloTransport</p>
          
          <div className="cta-buttons">
            <button className="btn-gradient" onClick={() => navigate('/inscription')}>
              Télécharger l'app
            </button>
            <button className="btn-transparent" onClick={() => navigate('/connexion')}>
              J'ai déjà un compte
            </button>
          </div>
          
          <div className="trust-indicators">
            <span>4.8/5 sur l'App Store</span>
            <span>Données 100% sécurisées</span>
            <span>Approuvé par la STM</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;