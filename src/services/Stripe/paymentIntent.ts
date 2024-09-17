import { Invoice } from "../../types/types";

const BASE_URL = "https://api.stripe.com/v1/payment_intents";
const REQUEST_HEADERS = {
  "Content-Type": "x-www-form-urlencoded",
  Authorization:
    "Bearer sk_test_51PsnWKBV4uK7jrIfRk2DEY3C6O4a4fsUWD4rPLzSVgPttOLQqJ8IEsjIyfmrEtaDP5PdZBc1Vy2gxvQunDg3tgHN00Wk2QNK2v",
};

export const fetchFetchPaymentIntents = async () => {
  const res = await fetch(BASE_URL, {
    headers: REQUEST_HEADERS,
  });
  return await res.json();
};

export const fetchPaymentIntent = async (paymentIntentId: string) => {
  const res = await fetch(BASE_URL + "/" + paymentIntentId, {
    headers: REQUEST_HEADERS,
  });
  return await res.json();
};

export const generatePaymentIntent = async (
  invoice: Invoice
) => {
  const result = await fetch(
    BASE_URL + "?amount=" + invoice.Balance + "&currency=cad&payment_method_types[]=card&metadata[invoice_id]=" + invoice.InvoiceID + "&receipt_email=lefrancmathis@gmail.com",
    {
      method: "POST",
      headers: REQUEST_HEADERS,
    }
  );

  const paymentIntent = await result.json();
  return paymentIntent;
};
