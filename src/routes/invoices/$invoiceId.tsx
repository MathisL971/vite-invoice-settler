import {
  createFileRoute,
  //  Link 
}
  from "@tanstack/react-router";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, PaymentIntent } from "@stripe/stripe-js";
import CheckoutForm from "../../components/CheckoutForm";
import SuccessAlert from "../../components/SuccessAlert";
import { Spinner } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { fetchInvoice } from "../../services/invoice";
import {
  fetchPaymentIntentsByInvoiceId,
  generatePaymentIntent,
} from "../../services/Stripe/paymentIntent";
import { LanguageContext } from "../../contexts/LanguageContext";
import ErrorAlert from "../../components/ErrorAlert";

const stripePromise = loadStripe(
  "pk_test_51PsnWKBV4uK7jrIfvpQrJ9cWc69diKn2ed2lUQZwQM1AzAu4UuAgj225Q8bPwYpwffxxghxTXyhANhr3lcLqVScr00ajA8mqLK"
);

export const Route = createFileRoute("/invoices/$invoiceId")({
  loader: async ({ params: { invoiceId } }) => {
    const invoice = await fetchInvoice(invoiceId);
    if (!invoice) {
      throw new Error("Facture " + invoiceId + " introuvable");
    }
    return invoice;
  },
  component: () => <Invoice />,
  errorComponent: ({ error }) => {
    return (
      <div className="flex flex-col w-full flex-grow sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto items-start gap-4">
        <ErrorAlert message={error.message} theme="failure" />
      </div>
    );
  },
  pendingComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full flex-grow">
        <Spinner
          aria-label="Center-aligned spinner example"
          size={"xl"}
          color={"info"}
        />
      </div>
    );
  },
});

function Invoice() {
  const { lang } = useContext(LanguageContext);

  const invoiceData = Route.useLoaderData();

  const [invoice, setInvoice] = useState(invoiceData);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null
  );

  useEffect(() => {
    if (invoice.Balance === 0) {
      return;
    }

    fetchPaymentIntentsByInvoiceId(invoice.InvoiceID).then((paymentIntents) => {
      if (paymentIntents.length > 0) {
        const succeededPaymentIntent = paymentIntents.find(
          (paymentIntent: PaymentIntent) => paymentIntent.status === "succeeded"
        );

        if (succeededPaymentIntent) {
          setPaymentIntent(succeededPaymentIntent);
        } else {
          setPaymentIntent(paymentIntents[0]);
        }
      } else {
        generatePaymentIntent(invoice.InvoiceID, invoice.Balance)
          .then((paymentIntent) => {
            setPaymentIntent(paymentIntent);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  }, [invoice]);

  return (
    <div className="flex flex-col w-full flex-grow sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto items-start gap-8">
      {/* <Link
        to="/"
        from="/invoices/$invoiceId"
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 text-xs px-4 rounded flex flex-row justify-between items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>
        {lang === "fr" ? "Retour à la page d'accueil" : "Back to home"}
      </Link> */}
      <div className="flex flex-col gap-8 mt-32 w-full">
        <div className="flex flex-col gap-3">
          <h1 className="text-5xl font-bold text-slate-700">
            {lang === "fr" ? "Facture " : "Invoice "}
            {invoice.InvoiceID}
          </h1>
          <h2 className="text-2xl text-slate-500">
            {lang === "fr" ? "Solde: " : "Balance: "}
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "CAD",
            }).format(invoice.Balance / 100)}
          </h2>
        </div>
        <div className="flex flex-col w-full">
          {invoice.Balance === 0 ? (
            <SuccessAlert />
          ) : !paymentIntent ? (
            <div className="flex flex-col justify-center items-center h-40">
              <Spinner
                aria-label="Center-aligned spinner example"
                size={"xl"}
                color={"info"}
              />
            </div>
          ) : paymentIntent.status === "succeeded" ? (
            <ErrorAlert
              theme="warning"
              message={
                lang === "fr"
                  ? "Un paiement semble avoir déjà été effectué pour cette facture mais le solde n'a pas été mis à jour. Veuillez contacter le service client pour plus d'informations."
                  : "A payment seems to have already been made for this invoice but the balance has not been updated. Please contact customer service for more information."
              }
            />
          ) : paymentIntent.client_secret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: paymentIntent.client_secret,
                locale: lang,
              }}
            >
              <CheckoutForm invoice={invoice} setInvoice={setInvoice} />
            </Elements>
          ) : (
            <ErrorAlert
              theme="failure"
              message={
                lang === "fr"
                  ? "Impossible d'initialiser une tentative de paiement."
                  : "Unable to initialize a payment attempt."
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
