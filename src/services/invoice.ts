const BASE_URL = false
  ? "http://localhost:5000/api/invoices"
  : "https://api.stripe.com/v1/invoices";

export const fetchInvoices = async () => {
  const res = await fetch(BASE_URL);
  return await res.json();
};

export const fetchInvoice = async (invoiceId: string) => {
  const res = await fetch(BASE_URL + "/" + invoiceId);
  return await res.json();
};

export const updateInvoice = async (invoiceID: string, invoiceData: object) => {
  await fetch(BASE_URL + "/" + invoiceID, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoiceData),
  });
};
