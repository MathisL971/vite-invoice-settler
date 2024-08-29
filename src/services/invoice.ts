const BASE_URL = "http://localhost:5000/api/invoices";

const REQUEST_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

export const fetchInvoices = async () => {
  const res = await fetch(BASE_URL, {
    headers: REQUEST_HEADERS,
  });
  return await res.json();
};

export const fetchInvoice = async (invoiceId: string) => {
  const res = await fetch(BASE_URL + "/" + invoiceId, {
    headers: REQUEST_HEADERS,
  });
  return await res.json();
};

export const updateInvoice = async (invoiceID: string, invoiceData: object) => {
  await fetch(BASE_URL + "/" + invoiceID, {
    method: "PATCH",
    headers: REQUEST_HEADERS,
    body: JSON.stringify(invoiceData),
  });
};
