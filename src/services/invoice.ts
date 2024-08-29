export const fetchInvoice = async (invoiceId: string) => {
    const res = await fetch('http://localhost:5000/api/invoices/' + invoiceId)
    return await res.json();
}