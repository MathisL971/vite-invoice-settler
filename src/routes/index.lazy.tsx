import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { fetchInvoice } from '../services/invoice';

export const Route = createLazyFileRoute('/')({
  component: Home,
})

function Home() {
  const navigate = useNavigate({
    from: '/',
  });

  const [invoiceId, setInvoiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div className="flex flex-col gap-4 w-5/6 sm:w-4/6 md:w-1/2 lg:w-1/3"
    >
      <h1 className="text-7xl font-extrabold text-slate-800">
        Bienvenue sur
        <br />
        MSM Facturation
      </h1>
      <h2 className="text-2xl font-semibold text-slate-500 mt-2">
        Notre système de facturation vous permettant de régler vos factures en ligne
        en toute sécurité et simplicité.
      </h2>
      <form
        className='flex flex-col gap-2 mt-7'
        onSubmit={async (e) => {
          e.preventDefault();

          setLoading(true);

          const invoice = await fetchInvoice(invoiceId);

          if (!invoice) {
            setInvoiceId('');
            setErrorMessage('Facture introuvable');
            setLoading(false);
            setTimeout(() => {
              setErrorMessage('');
            }, 5000);
            return;
          }

          navigate({
            to: '/invoices/$invoiceId',
            params: {
              invoiceId: invoice.InvoiceID,
            }
          });
        }}
      >
        <label className="text-xl font-semibold text-slate-800">
          Saisissez l'identifiant de la facture
        </label>
        <input
          type="text"
          className='border border-gray-300 rounded'
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          placeholder='Ex: 123456, F-123456, etc.'
        />
        {
          errorMessage && (
            <div
              className='bg-red-100 border border-red-500 text-red-500 p-2 rounded'
            >
              <p className="text-red-500">{errorMessage}</p>

            </div>
          )
        }
        <button
          type="submit"
          disabled={loading || !invoiceId}
          className={`
            bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded disabled:bg-blue-400
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >{
            loading ? 'Chargement...' : 'Rechercher'
          }</button>
      </form>
    </div>

  )
}