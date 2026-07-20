import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function StripePaymentForm({ amount, onAuthorize, isSubmitting }) {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [nameOnCard, setNameOnCard] = useState('Jane Doe');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate card authorization delay
    setTimeout(() => {
      setIsProcessing(false);
      onAuthorize({
        last4: '4242',
        brand: 'visa',
        status: 'succeeded',
      });
    }, 600);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          Stripe Payment Authorization Hold
        </h4>
        <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
          <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit SSL Encrypted
        </span>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        Your card will be authorized for a payment hold of{' '}
        <strong className="text-gray-800">${amount || 50}</strong>. Funds will only be charged after service completion.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Name on Card</label>
          <input
            type="text"
            required
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number</label>
          <div className="relative">
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              placeholder="4242 4242 4242 4242"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">VISA</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Expires (MM/YY)</label>
            <input
              type="text"
              required
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-center"
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">CVC / CVV</label>
            <input
              type="text"
              required
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-center"
              placeholder="123"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isProcessing}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isSubmitting || isProcessing ? (
            'Authorizing Stripe Card Hold...'
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" /> Authorize ${amount || 50} Hold & Confirm
            </>
          )}
        </button>
      </form>
    </div>
  );
}
