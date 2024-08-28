import { Elements } from '@stripe/react-stripe-js'
import './App.css'
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { useEffect, useState } from 'react';
import SuccessAlert from './SuccessAlert';
import SettledAlert from './SettledAlert';

const stripePromise = loadStripe('pk_test_51NoRfSAcbxSQyH2uMXmRHBcHizBTDZNLv8dUFLnILEqADKTSJZZJnKEdeUqP9lyqZcDGlVQqSJokMuBX3jJ2HFfN00lw9EyJUL');

function App() {
  const [clientSecret, setClientSecret] = useState('');
  const [status, setStatus] = useState('');

  // Extract amount from the URL
  const url = new URL(window.location.href);
  const amount: number = Number(url.searchParams.get('amount'));
  const id = url.searchParams.get('id');

  useEffect(() => {
    if (!amount || !id) {
      return;
    }

    try {
      // Fetch a paymentIntent with the invoice id
    fetch('https://api.stripe.com/v1/payment_intents',
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer sk_test_51NoRfSAcbxSQyH2uyGcfaVxf6hywn9q2HdOyHV34EYTulypfgsNrlYatuRmSrlZ7OFni4CmeC2RRhdhUuMdd0jsg00BTegXeok',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((res) => res.json())
      .then((data: 
        {
          data: PaymentIntent[]
        }
      ) => {       
        const existingPaymentIntents = data.data.filter((paymentIntent: PaymentIntent) => paymentIntent.description === id);

        const succeededPaymentIntent = existingPaymentIntents.find((paymentIntent: PaymentIntent) => paymentIntent.status === 'succeeded');

        if (succeededPaymentIntent) {
          
          if (!succeededPaymentIntent.client_secret) {
            console.error('Missing client_secret');
            return;
          }
          
          setClientSecret(succeededPaymentIntent.client_secret);
          setStatus('paid');
          return;
        }

        const ongoingPaymentIntent = existingPaymentIntents.find((paymentIntent: PaymentIntent) => paymentIntent.status === 'requires_payment_method');

        if (ongoingPaymentIntent) {

          if (!ongoingPaymentIntent.client_secret) {
            console.error('Missing client_secret');
            return;
          }
          
          setClientSecret(ongoingPaymentIntent.client_secret);
          setStatus('ongoing');
          return;
        }

        // Create PaymentIntent as soon as the page loads
        fetch('https://api.stripe.com/v1/payment_intents?amount=' + amount + '&currency=cad&payment_method_types[]=card&description=' + id,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer sk_test_51NoRfSAcbxSQyH2uyGcfaVxf6hywn9q2HdOyHV34EYTulypfgsNrlYatuRmSrlZ7OFni4CmeC2RRhdhUuMdd0jsg00BTegXeok',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setClientSecret(data.client_secret);
            setStatus('ongoing');
          });
      });
    } catch (error) {
      console.error(error);
    }
  }
  , [amount, id]);

  if (!amount || !id) {
    return <h1>
      Montant ou ID de facture manquant
    </h1>
  }

  if (!clientSecret) {
    return <h1>Chargement...</h1>
  }

  const options = {
    clientSecret,    
  };

  return (
    <>
      <h1>
        Payes ta facture en 1 clic! <span role="img" aria-label="money">💸</span>
      </h1>
      <h2 style={{
        marginBottom: '2rem',
      }}>
        Montant à payer: {
          new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CAD' }).format(amount / 100)
        }
      </h2>
      {
        status === 'succeeded' 
          ? <SuccessAlert />
          : status === 'ongoing' 
            ? <Elements 
                stripe={stripePromise} 
                options={options}
              >
                <CheckoutForm setStatus={setStatus} /> 
              </Elements>
            : <SettledAlert />
      }
    </>
  )
}

export default App
