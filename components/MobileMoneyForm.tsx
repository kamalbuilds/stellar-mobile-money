// src/components/MobileMoneyForm.tsx
import { useState } from 'react';
import { MobileMoneyService } from '@/lib/mobileMoney';

export default function MobileMoneyForm() {
  const [formData, setFormData] = useState({
    amount: '',
    phoneNumber: '',
    customerName: '',
    customerEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await MobileMoneyService.initializePayment({
        amount: Number(formData.amount),
        currency: 'GHS', // Ghana Cedis for example
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
      });

      setStatus('Payment initiated. Please check your phone for prompts.');
    } catch (error) {
      setStatus('Error initiating payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={formData.customerEmail}
          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
      >
        {loading ? 'Processing...' : 'Pay with Mobile Money'}
      </button>

      {status && (
        <div className="mt-4 p-4 rounded bg-gray-100">
          {status}
        </div>
      )}
    </form>
  );
}