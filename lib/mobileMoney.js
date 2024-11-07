// src/lib/mobileMoney.ts
import axios from 'axios';

const KORA_API_KEY = process.env.NEXT_PUBLIC_KORA_API_KEY;
const KORA_API_URL = 'https://api.korapay.com/merchant/api/v1';

export class MobileMoneyService {
  static async initializePayment({
    amount,
    currency,
    customerEmail,
    customerName,
    phoneNumber,
  }) {
    try {
      const response = await axios.post(
        `${KORA_API_URL}/charges/mobile-money`,
        {
          amount,
          currency,
          reference: `MM-${Date.now()}`,
          customer: {
            email: customerEmail,
            name: customerName,
          },
          mobile_money: {
            number: phoneNumber,
          },
          merchant_bears_cost: true,
        },
        {
          headers: {
            Authorization: `Bearer ${KORA_API_KEY}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error initializing payment:', error);
      throw error;
    }
  }

  static async verifyPayment(reference: string) {
    try {
      const response = await axios.get(
        `${KORA_API_URL}/charges/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${KORA_API_KEY}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
}