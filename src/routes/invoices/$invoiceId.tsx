import { createFileRoute, ErrorComponent, Link } from '@tanstack/react-router'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';
import CheckoutForm from '../../CheckoutForm';
import SuccessAlert from '../../SuccessAlert';
import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { fetchInvoice } from '../../services/invoice';

const stripePromise = loadStripe('pk_test_51PsnWKBV4uK7jrIfvpQrJ9cWc69diKn2ed2lUQZwQM1AzAu4UuAgj225Q8bPwYpwffxxghxTXyhANhr3lcLqVScr00ajA8mqLK');

export const Route = createFileRoute('/invoices/$invoiceId')({
  loader: async ({
    params: {
      invoiceId,
    },
  }) => {
    const invoice = await fetchInvoice(invoiceId);
    console.log(invoice);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return invoice;
  },
  component: () => <Invoice />,
  errorComponent: ({ error }) => {
    return <ErrorComponent error={error} />
  },
  pendingComponent: () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          gap: '2rem',
        }}
      >
        <Spinner aria-label="Center-aligned spinner example" size={'xl'} color={'info'} />
      </div>
    )
  }
})

function Invoice() {
  const invoiceData = Route.useLoaderData();

  const [invoice, setInvoice] = useState(invoiceData);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);

  const url = new URL(window.location.href);
  const lang = url.searchParams.get('lang') ?? 'fr';

  useEffect(() => {
    if (invoice.Balance === 0) {
      return
    }

    generatePaymentIntent(invoice.InvoiceID, invoice.Balance)
      .then((paymentIntent) => {
        setPaymentIntent(paymentIntent);
      })
      .catch((error) => {
        console.error(error);
      })
  }, [invoice]);

  console.log(invoice)

  return (
    <div
      className='flex flex-col w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto items-start justify-center gap-8'
    >
      <Link
        to='/'
        from='/invoices/$invoiceId'
        className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 text-xs px-4 rounded flex flex-row justify-between items-center gap-2'
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
        </svg>
        {
          lang === 'fr' ? 'Retour à la page d\'accueil' : 'Back to home'
        }
      </Link>
      <div className='flex flex-col gap-3'>
        <h1
          className='text-5xl font-bold text-slate-700'
        >
          {
            lang === 'fr' ? 'Facture ' : 'Invoice '
          }
          {
            invoice.InvoiceID
          }
        </h1>
        <h2 className='text-2xl text-slate-500'>
          {
            lang === 'fr' ? 'Solde: ' : 'Balance: '
          }
          {
            new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CAD' }).format((invoice.Balance) / 100)
          }
        </h2>
      </div>
      <div className='flex flex-col w-full'>
        {
          invoice.Balance === 0
            ? <SuccessAlert />
            : !paymentIntent
              ? <div className='flex flex-col justify-center items-center h-40'>
                <Spinner aria-label="Center-aligned spinner example" size={'xl'} color={'info'} />
              </div>
              : paymentIntent.client_secret
                ? <Elements
                  stripe={stripePromise}
                  options={
                    {
                      clientSecret: paymentIntent.client_secret,
                      locale: lang === 'en' ? 'en' : lang === 'fr' ? 'fr' : 'auto',
                    }
                  }
                >
                  <CheckoutForm invoice={invoice} setInvoice={setInvoice} />
                </Elements>
                : <div>
                  {
                    lang === 'fr' ? 'Une erreur est survenue' : 'An error occurblue'
                  }
                </div>
        }
      </div>
    </div>
  )
}

const generatePaymentIntent = async (invoiceId: number, amount: number) => {
  // const res = await fetch('https://api.stripe.com/v1/payment_intents',
  //   {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': 'Bearer sk_test_51PsnWKBV4uK7jrIfRk2DEY3C6O4a4fsUWD4rPLzSVgPttOLQqJ8IEsjIyfmrEtaDP5PdZBc1Vy2gxvQunDg3tgHN00Wk2QNK2v',
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //   })

  // const data = await res.json();
  // const existingPaymentIntents: PaymentIntent[] = data.data.filter((paymentIntent: PaymentIntent) => paymentIntent.description === invoiceId.toString());

  // const succeededPaymentIntent = existingPaymentIntents.find((paymentIntent: PaymentIntent) => paymentIntent.status === 'succeeded');
  // if (succeededPaymentIntent) {
  //   if (!succeededPaymentIntent.client_secret) {
  //     console.error('Missing client_secret');
  //     return;
  //   }

  //   return succeededPaymentIntent
  // }

  // const ongoingPaymentIntent = existingPaymentIntents.find((paymentIntent: PaymentIntent) => paymentIntent.status === 'requires_payment_method');

  // if (ongoingPaymentIntent) {
  //   if (!ongoingPaymentIntent.client_secret) {
  //     console.error('Missing client_secret');
  //     return;
  //   }
  //   return ongoingPaymentIntent
  // }

  //Create PaymentIntent as soon as the page loads
  const result = await fetch('https://api.stripe.com/v1/payment_intents?amount=' + amount + '&currency=cad&payment_method_types[]=card&description=' + invoiceId,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk_test_51PsnWKBV4uK7jrIfRk2DEY3C6O4a4fsUWD4rPLzSVgPttOLQqJ8IEsjIyfmrEtaDP5PdZBc1Vy2gxvQunDg3tgHN00Wk2QNK2v',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

  const paymentIntent = await result.json();
  return paymentIntent;
}