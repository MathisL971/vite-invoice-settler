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
      throw new Error("Facture " + invoiceId + " introuvable. Veuillez vérifier le numéro de facture et réessayer. Si le problème persiste, veuillez contacter le service client.");
    }
    return invoice;
  },
  component: () => <Invoice />,
  errorComponent: ({ error }) => {
    return (
      <div className="flex flex-col w-full flex-grow sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto items-start gap-4">
        <ErrorAlert message={error.message} theme="failure" code={404} />
      </div>
    );
  },
  pendingComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full flex-grow">
        <Spinner
          aria-label="Center-aligned spinner example"
          size={"xl"}
          color={"success"}
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
    <div className="flex flex-col w-full flex-grow sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto items-center justify-center gap-8">
      <div>
        <h1 className="font-extrabold text-slate-800">
          {lang === "fr" ? "Bienvenue sur" : "Welcome to"}
          <br />
          MSM Payments
        </h1>
        <p className="description mt-2 text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          {lang === "fr"
            ? "Notre système de facturation vous permettant de régler vos factures en ligne en toute sécurité et simplicité."
            : "Our billing system allowing you to pay your invoices online safely and easily."}
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full p-4 lg:p-8 bg-slate-200 rounded-md">
        <div className="flex flex-col gap-1">
          <h5>
            {lang === "fr" ? "Facture " : "Invoice "}
            {invoice.InvoiceID}
          </h5>
          <p className="description text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl">
            {lang === "fr" ? "Solde: " : "Balance: "}
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "CAD",
            }).format(invoice.Balance / 100)}
          </p>
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
              code={500}
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
