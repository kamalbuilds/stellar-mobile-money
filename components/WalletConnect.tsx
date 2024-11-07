// src/components/WalletConnect.tsx
import { useState } from 'react';
import { StellarService } from '@/lib/stellar';

export default function WalletConnect() {
  const [account, setAccount] = useState<{
    publicKey: string;
    secretKey: string;
  } | null>(null);
  const [balance, setBalance] = useState<any[]>([]);

  const connectWallet = async () => {
    try {
      const newAccount = await StellarService.createAccount();
      setAccount(newAccount);
      const balances = await StellarService.getAccountBalance(newAccount.publicKey);
      setBalance(balances);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Stellar Wallet
        </button>
      ) : (
        <div>
          <p className="font-medium">Account Details:</p>
          <p className="text-sm">Public Key: {account.publicKey}</p>
          <p className="text-sm mt-2">Balances:</p>
          {balance.map((b, i) => (
            <p key={i} className="text-sm">
              {b.asset}: {b.balance}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}