// src/app/page.tsx
'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import WalletConnect from '@/components/WalletConnect';
import MobileMoneyForm from '@/components/MobileMoneyForm';
import QRCodePayment from '@/components/QRCodePayment';
import TransactionHistory from '@/components/TransactionHistory';
import { useState } from 'react';

export default function Home() {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Stellar Mobile Money Integration
      </h1>

      <ErrorBoundary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <WalletConnect onConnect={(publicKey) => setConnectedAccount(publicKey)} />
            {connectedAccount && <QRCodePayment />}
          </div>

          <div className="space-y-8">
            <MobileMoneyForm />
            {connectedAccount && <TransactionHistory publicKey={connectedAccount} />}
          </div>
        </div>
      </ErrorBoundary>
    </main>
  );
}