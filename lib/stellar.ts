// src/lib/stellar.ts
import * as StellarSdk from '@stellar/stellar-sdk'

// Configure Stellar SDK (using testnet for development)
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');


export class StellarService {
  static async createAccount() {
    const pair = StellarSdk.Keypair.random();
    
    try {
      // Fund the account using friendbot (testnet only)
      await fetch(
        `https://friendbot.stellar.org?addr=${pair.publicKey()}`
      );
      
      return {
        publicKey: pair.publicKey(),
        secretKey: pair.secret(),
      };
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  static async getAccountBalance(publicKey: string) {
    try {
      const account = await server.loadAccount(publicKey);
      return account.balances.map((balance: any) => ({
        asset: balance.asset_type === 'native' ? 'XLM' : balance.asset_code,
        balance: balance.balance,
      }));
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  static async sendPayment({
    sourceSecret,
    destinationKey,
    amount,
    asset = StellarSdk.Asset.native(),
  }) {
    try {
      const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
      const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
      
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationKey,
            asset: asset,
            amount: amount.toString(),
          })
        )
        .setTimeout(180)
        .build();

      transaction.sign(sourceKeypair);
      return await server.submitTransaction(transaction);
    } catch (error) {
      console.error('Error sending payment:', error);
      throw error;
    }
  }

  static async getAccountTransactions(publicKey: string) {
    try {
      const transactions = await server
        .transactions()
        .forAccount(publicKey)
        .order('desc')
        .limit(10)
        .call();

      return Promise.all(
        transactions.records.map(async (tx) => {
          const operations = await tx.operations();
          return operations.records.map((op) => ({
            id: tx.id,
            type: op.type,
            amount: op.amount,
            asset: op.asset_type === 'native' ? 'XLM' : op.asset_code,
            timestamp: tx.created_at,
            from: op.from || tx.source_account,
            to: op.to
          }));
        })
      );
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  static async getSupportedAssets() {
    try {
      const assets = await server.assets().call();
      return assets.records.map((asset) => ({
        code: asset.asset_code || 'XLM',
        issuer: asset.asset_issuer,
        type: asset.asset_type
      }));
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  }
}