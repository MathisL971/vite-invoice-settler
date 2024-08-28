import {PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import { useState } from 'react';

type Props = {
    setStatus: (status: string) => void;
}

const CheckoutForm = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        setLoading(true);
    
        if (!stripe || !elements) {
          // Stripe.js hasn't yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          return;
        }
    
        const result = await stripe.confirmPayment({
          //`Elements` instance that was used to create the Payment Element
          elements,
          redirect: "if_required",
        //   confirmParams: {
        //     return_url: 'https://localhost:5173/',
        //  },
        });
    
        if (result.error) {
          // Show error to your customer (for example, payment details incomplete)
          console.log(result.error.message);
          if (result.error.message) {
            setErrorMessage(result.error.message);
          } else {
            setErrorMessage('An error occurred, please try again.');
          }
        } else {
          // Your customer will be redirected to your `return_url`. For some payment
          // methods like iDEAL, your customer will be redirected to an intermediate
          // site first to authorize the payment, then redirected to the `return_url`.
          props.setStatus('succeeded');
        }
        setLoading(false);
    };

    return (
        <form 
            style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '0 auto',
                gap: '1rem',
            }}
            onSubmit={handleSubmit}
        >
            <PaymentElement />
            <button 
                type="submit"
                disabled={loading || !stripe}
            >
                {
                    loading ? 'Paiement en cours...' : 'Payer'
                }
            </button>
            {
                errorMessage && <div>{errorMessage}</div>
            }
        </form>
    )
}

export default CheckoutForm