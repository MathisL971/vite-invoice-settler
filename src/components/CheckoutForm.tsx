import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import { updateInvoice } from "../services/invoice";
import { Invoice } from "../types/types";
import { LanguageContext } from "../contexts/LanguageContext";

type CheckoutFormProps = {
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
};

const CheckoutForm = (props: CheckoutFormProps) => {
  const { invoice, setInvoice } = props;

  const { lang } = useContext(LanguageContext);

  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      const newBalance =
        invoice.Balance - result.paymentIntent.amount < 0
          ? 0
          : invoice.Balance - result.paymentIntent.amount;
      await updateInvoice(invoice.InvoiceID, {
        Balance: newBalance,
      });

      const updatedInvoice: Invoice = {
        ...invoice,
        Balance: newBalance,
      };

      setInvoice(updatedInvoice);
    }
    setLoading(false);
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "1rem",
      }}
      onSubmit={handleSubmit}
    >
      <PaymentElement />
      <button
        type="submit"
        className={'hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded disabled:bg-emerald-200 disabled:cursor-not-allowed bg-emerald-500'}
        disabled={loading || !stripe}
      >
        {loading
          ? lang === "fr"
            ? "Chargement..."
            : "Loading..."
          : lang === "fr"
            ? "Payer"
            : "Pay"}
      </button>
    </form>
  );
};

export default CheckoutForm;
