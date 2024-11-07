// src/app/page.tsx
'use client';

import WalletConnect from '@/components/WalletConnect';
import MobileMoneyForm from '@/components/MobileMoneyForm';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Stellar Mobile Money Integration
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Stellar Wallet</h2>
          <WalletConnect />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Mobile Money Payment</h2>
          <MobileMoneyForm />
        </div>
      </div>
    </main>
  );
}