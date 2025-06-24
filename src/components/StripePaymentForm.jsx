import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import './StripePaymentForm.css';

const stripePromise = loadStripe('pk_test_51PdGx2As4q8PSgBwDqnwetgCdrBC20ZtrkI0RIRxmx7ZQNMf5v2jMzQQ84Oo1n3Q8L5qQOY2qvf3EGdlHVQerHpm00TBPqrfyp');

const elementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      '::placeholder': {
        color: '#9ca3af',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    invalid: {
      color: '#dc2626',
    },
  },
};

const PaymentForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardErrors, setCardErrors] = useState({
    number: null,
    expiry: null,
    cvc: null
  });

  const handleElementChange = (elementType) => (event) => {
    setCardErrors(prev => ({
      ...prev,
      [elementType]: event.error ? event.error.message : null
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createPaymentIntent(amount);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        response.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: 'Client STM',
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du traitement du paiement');
      onError(err.message || 'Erreur lors du traitement du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-section">
        <h3>Informations de paiement</h3>
        
        <div className="form-field">
          <label>Numéro de carte</label>
          <div className="card-input">
            <CardNumberElement
              options={elementOptions}
              onChange={handleElementChange('number')}
            />
          </div>
          {cardErrors.number && (
            <div className="field-error">{cardErrors.number}</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Date d'expiration</label>
            <div className="card-input">
              <CardExpiryElement
                options={elementOptions}
                onChange={handleElementChange('expiry')}
              />
            </div>
            {cardErrors.expiry && (
              <div className="field-error">{cardErrors.expiry}</div>
            )}
          </div>

          <div className="form-field">
            <label>CVC</label>
            <div className="card-input">
              <CardCvcElement
                options={elementOptions}
                onChange={handleElementChange('cvc')}
              />
            </div>
            {cardErrors.cvc && (
              <div className="field-error">{cardErrors.cvc}</div>
            )}
          </div>
        </div>

        <div className="accepted-cards">
          <span>Cartes acceptées</span>
          <div className="card-logos">
            <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="card-logo" />
            <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="card-logo" />
          </div>
        </div>
      </div>

      <div className="payment-details">
        <div className="detail-row">
          <span>Rechargement carte Opus</span>
          <span>{amount.toFixed(2)} $</span>
        </div>
        <div className="detail-row">
          <span>Frais de service</span>
          <span>0,00 $</span>
        </div>
        <div className="total-row">
          <span>Total</span>
          <span>{amount.toFixed(2)} $ CAD</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="submit-button"
      >
        {loading ? 'Traitement...' : 'Confirmer le paiement'}
      </button>
    </form>
  );
};

const createPaymentIntent = async (amount) => {
  try {
    const formData = new URLSearchParams();
    formData.append('amount', Math.round(amount * 100).toString());
    formData.append('currency', 'cad');
    formData.append('description', `Rechargement carte Opus - ${amount}$ CAD`);
    formData.append('metadata[type]', 'opus_recharge');
    formData.append('metadata[amount]', amount.toString());
    formData.append('metadata[service]', 'STM');

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk_test_51PdGx2As4q8PSgBwpqF8t8gbHje0euD708Kp2s2mDEzVtK11pDQKOMNXwWG2gYHQN5G9K7BtbRE3xf6XgHZULt7G000uWPg7A4',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erreur lors de la création du paiement');
    }

    const paymentIntent = await response.json();
    return { client_secret: paymentIntent.client_secret };
  } catch (error) {
    return { error: error.message };
  }
};

const StripePaymentForm = ({ amount, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        amount={amount} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  );
};

export default StripePaymentForm;