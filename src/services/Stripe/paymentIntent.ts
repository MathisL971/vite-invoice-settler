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

export const fetchPaymentIntentsByInvoiceId = async (invoiceId: string) => {
  const res = await fetch(BASE_URL + "?description=" + invoiceId, {
    headers: REQUEST_HEADERS,
  });
  return await res.json();
};

export const generatePaymentIntent = async (
  invoiceId: number,
  amount: number
) => {
  const result = await fetch(
    BASE_URL +
      "?amount=" +
      amount +
      "&currency=cad&payment_method_types[]=card&description=" +
      invoiceId,
    {
      method: "POST",
      headers: REQUEST_HEADERS,
    }
  );

  const paymentIntent = await result.json();
  return paymentIntent;
};
