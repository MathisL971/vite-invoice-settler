import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';

type CheckoutFormProps = {
  invoice: any;
  setInvoice: (invoice: any) => void;
}

const CheckoutForm = (props: CheckoutFormProps) => {
  const { invoice, setInvoice } = props;

  const [loading, setLoading] = useState(false);
  const url = new URL(window.location.href);
  const lang = url.searchParams.get('lang') ?? 'fr';

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
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.      
      await fetch('http://localhost:5000/api/invoices/' + invoice.InvoiceID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Balance: invoice.Balance - result.paymentIntent.amount < 0
            ? 0
            : invoice.Balance - result.paymentIntent.amount,
        }),
      })
      setInvoice((prevInvoice: any) => ({
        ...prevInvoice,
        Balance: prevInvoice.Balance - result.paymentIntent.amount < 0
          ? 0
          : prevInvoice.Balance - result.paymentIntent.amount,
      }));

    }
    setLoading(false);
  };

  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '1rem',
      }}
      onSubmit={handleSubmit}
    >
      <PaymentElement />
      <button
        type="submit"
        className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded'
        disabled={loading || !stripe}
      >
        {
          loading
            ? (lang === 'fr' ? 'Chargement...' : 'Loading...')
            : (lang === 'fr' ? 'Payer' : 'Pay')
        }
      </button>
    </form>
  )
}

export default CheckoutForm