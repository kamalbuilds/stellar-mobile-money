import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { StellarService } from '@/lib/stellar';

export default function QRCodePayment() {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    currency: 'XLM',
    memo: ''
  });
  const [qrData, setQrData] = useState<string>('');

  const generateQRCode = () => {
    const data = {
      type: 'stellar-payment',
      destination: StellarService.getPublicKey(),
      amount: paymentData.amount,
      currency: paymentData.currency,
      memo: paymentData.memo
    };
    setQrData(JSON.stringify(data));
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Generate Payment QR Code</h3>
      <div className="space-y-4">
        <input
          type="number"
          placeholder="Amount"
          value={paymentData.amount}
          onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <select
          value={paymentData.currency}
          onChange={(e) => setPaymentData({ ...paymentData, currency: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="XLM">XLM</option>
          <option value="USDC">USDC</option>
          <option value="GHS">GHS</option>
        </select>
        <input
          type="text"
          placeholder="Memo (optional)"
          value={paymentData.memo}
          onChange={(e) => setPaymentData({ ...paymentData, memo: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={generateQRCode}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Generate QR Code
        </button>
        {qrData && (
          <div className="flex justify-center mt-4">
            <QRCodeSVG value={qrData} size={200} />
          </div>
        )}
      </div>
    </div>
  );
}