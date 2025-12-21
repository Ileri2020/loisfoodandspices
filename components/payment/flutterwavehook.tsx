// ts-nocheck
'use client';

import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type FlutterwaveButtonHookProps = {
  tx_ref: string;
  amount: number;
  currency: string;
  email: string;
  phonenumber: string;
  name: string;
  disabled?: boolean;
  onSuccess: (response: any) => void;
};


export default function FlutterWaveButtonHook({
  tx_ref,
  amount,
  currency,
  email,
  phonenumber,
  name,
  disabled,
  onSuccess,
}: FlutterwaveButtonHookProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (disabled || loading) return;

    try {
      setLoading(true);

      // 2️⃣ Build Flutterwave config with backend tx_ref
      const config = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY as string,
        tx_ref,
        // amount : 5,
        amount,
        currency,
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email,
          phone_number: phonenumber,
          name,
        },
        customizations: {
          title: 'Loyz Food and Spices',
          description: 'Payment for items in cart using Flutterwave',
          logo: 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1765733238/j8jw0lwd79tuhofhpao9.png',
        },
      };

      // 3️⃣ Initialize Flutterwave
      const handleFlutterPayment = useFlutterwave(config);

      handleFlutterPayment({
        callback: (response: any) => {
          if (response?.status === 'successful') {
            onSuccess(response);
          } else {
            alert('Payment was not successful. Please try again.');
          }

          closePaymentModal();
        },
        onClose: () => {},
      });
    } catch (error) {
      alert('An error occurred while processing payment. Please try again.');
      console.error('Flutterwave Payment Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className='animate-pulse' disabled={disabled || loading} onClick={handlePayment}>
      {loading ? 'Processing…' : 'Pay now'}
    </Button>
  );
}
