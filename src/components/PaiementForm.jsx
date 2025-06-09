/**
 * ⚠️ Cette section Paiement est actuellement une simulation frontend uniquement.
 *
 * ➤ Elle permet de sélectionner un type de titre (1 passage, hebdo, mensuel) et une méthode de paiement (CB, PayPal, Stripe).
 * ➤ Le paiement est simulé par un simple setTimeout sans appel à une API réelle.
 *
 * 🔧 À FAIRE PAR LE BACKEND :
 * - Intégration réelle avec les APIs de paiement :
 *   - Stripe Checkout (https://stripe.com/docs/checkout)
 *   - ou PayPal SDK (https://developer.paypal.com/sdk/js/)
 * - Gestion sécurisée des transactions
 * - Enregistrement des achats et retour d'information
 *
 * Note : Ne pas déployer cette version en production sans système de paiement sécurisé.
 */




import React, { useState } from 'react';
import './PaiementForm.css';

const PaiementForm = () => {
  const [type, setType] = useState('1-passage');
  const [methode, setMethode] = useState('carte');
  const [paiementEffectue, setPaiementEffectue] = useState(false);

  const handlePaiement = (e) => {
    e.preventDefault();
    // Simulation
    setTimeout(() => {
      setPaiementEffectue(true);
    }, 1000);
  };

  return (
    <div className="paiement-form">
      <h4>Achat de titre</h4>

      <form onSubmit={handlePaiement}>
        <label>
          Type de titre :
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="1-passage">1 passage - 3.50$</option>
            <option value="hebdo">Hebdomadaire - 25.00$</option>
            <option value="mensuel">Mensuel - 90.00$</option>
          </select>
        </label>

        <label>
          Méthode de paiement :
          <select value={methode} onChange={(e) => setMethode(e.target.value)}>
            <option value="carte">Carte bancaire</option>
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
          </select>
        </label>

        <button type="submit">Payer</button>
      </form>

      {paiementEffectue && (
        <p className="confirmation">✅ Paiement effectué avec succès !</p>
      )}
    </div>
  );
};

export default PaiementForm;
