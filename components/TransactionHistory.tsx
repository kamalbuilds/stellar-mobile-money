import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { StellarService } from '@/lib/stellar';

interface Transaction {
  id: string;
  type: string;
  amount: string;
  asset: string;
  timestamp: string;
  from: string;
  to: string;
}

export default function TransactionHistory({ publicKey }: { publicKey: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const txns = await StellarService.getAccountTransactions(publicKey);
        setTransactions(txns);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (publicKey) {
      fetchTransactions();
    }
  }, [publicKey]);

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-3 border rounded">
            <div className="flex justify-between">
              <span className="font-medium">{tx.type}</span>
              <span className={tx.type === 'received' ? 'text-green-500' : 'text-red-500'}>
                {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.asset}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(tx.timestamp), 'MMM d, yyyy HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}