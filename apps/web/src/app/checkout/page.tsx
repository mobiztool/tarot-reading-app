/**
 * Checkout Page
 * Handles Stripe payment for subscriptions
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription';
import { SubscriptionTier } from '@/types/subscription';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ tierId }: { tierId: SubscriptionTier }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const tier = SUBSCRIPTION_TIERS[tierId];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/profile/billing?success=true`,
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการชำระเงิน');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-white/5 rounded-xl p-5 border border-purple-500/20 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">สรุปคำสั่งซื้อ</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-purple-200">แพ็คเกจ {tier.nameTh}</span>
          <span className="text-white font-bold">฿{tier.price}/เดือน</span>
        </div>
        <p className="text-purple-300 text-sm">
          ชำระเงินรายเดือน • ยกเลิกได้ตลอดเวลา
        </p>
      </div>

      {/* Payment Element */}
      <div className="bg-white rounded-xl p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200
          ${loading 
            ? 'bg-gray-600 cursor-wait' 
            : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'}
          text-white shadow-lg shadow-purple-500/30
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            กำลังดำเนินการ...
          </span>
        ) : (
          `ชำระเงิน ฿${tier.price}`
        )}
      </button>

      {/* Security Notice */}
      <div className="text-center text-purple-300 text-sm">
        <p>🔒 ชำระเงินปลอดภัยผ่าน Stripe</p>
        <p className="mt-1">ข้อมูลบัตรของคุณได้รับการเข้ารหัสอย่างปลอดภัย</p>
      </div>
    </form>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('secret');
  const tierIdParam = searchParams.get('tier') as SubscriptionTier | null;

  // Validate params
  if (!clientSecret || !tierIdParam || !SUBSCRIPTION_TIERS[tierIdParam]) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">ข้อมูลไม่ถูกต้อง</h1>
          <p className="text-purple-200 mb-6">กรุณาเริ่มกระบวนการสมัครใหม่อีกครั้ง</p>
          <a
            href="/pricing"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
          >
            ไปหน้าราคา
          </a>
        </div>
      </div>
    );
  }

  const tier = SUBSCRIPTION_TIERS[tierIdParam];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ชำระเงิน</h1>
          <p className="text-purple-200">
            อัพเกรดเป็น {tier.nameTh} - ฿{tier.price}/เดือน
          </p>
        </div>

        {/* Stripe Elements */}
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary: '#a855f7',
                colorBackground: '#1e1b4b',
                colorText: '#ffffff',
                colorDanger: '#ef4444',
                fontFamily: 'system-ui, sans-serif',
                borderRadius: '12px',
              },
            },
          }}
        >
          <CheckoutForm tierId={tierIdParam} />
        </Elements>

        {/* Back Link */}
        <div className="text-center mt-8">
          <a
            href="/pricing"
            className="text-purple-300 hover:text-white transition-colors"
          >
            ← กลับไปหน้าเลือกแพ็คเกจ
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-purple-200">กำลังโหลด...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
