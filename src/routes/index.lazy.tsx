import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext, useState } from "react";
import { fetchInvoice } from "../services/invoice";
import { LanguageContext } from "../contexts/LanguageContext";

export const Route = createLazyFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate({
    from: "/",
  });

  const { lang } = useContext(LanguageContext);

  const [invoiceId, setInvoiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="flex flex-col gap-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 m-auto">
      <h1 className="text-7xl font-extrabold text-slate-800">
        {lang === "fr" ? "Bienvenue sur" : "Welcome to"}
        <br />
        MSM Facturation
      </h1>
      <h2 className="text-2xl font-semibold text-slate-500 mt-2">
        {lang === "fr"
          ? "Notre système de facturation vous permettant de régler vos factures en ligne en toute sécurité et simplicité."
          : "Our billing system allowing you to pay your invoices online safely and easily."}
      </h2>
      <form
        className="flex flex-col gap-2 mt-7"
        onSubmit={async (e) => {
          e.preventDefault();

          setLoading(true);

          const invoice = await fetchInvoice(invoiceId);

          if (!invoice) {
            setInvoiceId("");
            setErrorMessage(
              lang === "fr"
                ? "Aucune facture trouvée avec cet identifiant."
                : "No invoice found with this identifier."
            );
            setLoading(false);
            setTimeout(() => {
              setErrorMessage("");
            }, 5000);
            return;
          }

          navigate({
            to: "/invoices/$invoiceId",
            params: {
              invoiceId: invoice.InvoiceID,
            },
          });
        }}
      >
        <label className="text-xl font-semibold text-slate-800">
          {lang === "fr"
            ? "Entrez l'identifiant de votre facture"
            : "Enter your invoice identifier"}
        </label>
        <input
          type="text"
          className="border border-gray-300 rounded"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          placeholder="Ex: 123456, F-123456, etc."
        />
        {errorMessage && (
          <div className="bg-red-100 border border-red-500 text-red-500 p-2 rounded">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !invoiceId}
          className={`
            bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded disabled:bg-blue-400
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
          {loading
            ? lang === "fr"
              ? "Recherche en cours..."
              : "Searching..."
            : lang === "fr"
              ? "Rechercher"
              : "Search"}
        </button>
      </form>
    </div>
  );
}
