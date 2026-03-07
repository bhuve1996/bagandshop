'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { checkoutOrder, validateDiscountCode } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [email, setEmail] = useState('');
  const [shipping, setShipping] = useState({ name: '', address1: '', city: '', zip: '', country: '' });
  const [billing, setBilling] = useState({ name: '', address1: '', city: '', zip: '', country: '' });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0 && !submitting) {
    return (
      <main className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <p className="text-gray-500 mb-6">Your cart is empty.</p>
        <Link href="/cart" className="text-blue-600 hover:underline">View cart</Link>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const billingAddress = sameAsShipping ? shipping : billing;
      const order = await checkoutOrder({
        email: email || null,
        shipping_address: shipping,
        billing_address: billingAddress,
        items: items.map((i) => ({
          product_id: i.product_id ?? null,
          variant_id: i.variant_id ?? null,
          combo_id: i.combo_id ?? null,
          quantity: i.quantity,
          price: i.price,
        })),
        discount_code: appliedDiscount != null && discountCode.trim() ? discountCode.trim() : null,
      });
      clear();
      router.push(`/orders/${order.order_number}?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Shipping address</h2>
          <div className="space-y-2">
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Name" value={shipping.name} onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))} />
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Address" value={shipping.address1} onChange={(e) => setShipping((s) => ({ ...s, address1: e.target.value }))} />
            <div className="flex gap-2">
              <input type="text" className="flex-1 border rounded px-3 py-2" placeholder="City" value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} />
              <input type="text" className="w-24 border rounded px-3 py-2" placeholder="ZIP" value={shipping.zip} onChange={(e) => setShipping((s) => ({ ...s, zip: e.target.value }))} />
            </div>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Country" value={shipping.country} onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="same" checked={sameAsShipping} onChange={(e) => setSameAsShipping(e.target.checked)} />
          <label htmlFor="same">Billing same as shipping</label>
        </div>
        {!sameAsShipping && (
          <div>
            <h2 className="font-semibold mb-2">Billing address</h2>
            <div className="space-y-2">
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Name" value={billing.name} onChange={(e) => setBilling((b) => ({ ...b, name: e.target.value }))} />
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Address" value={billing.address1} onChange={(e) => setBilling((b) => ({ ...b, address1: e.target.value }))} />
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="City" value={billing.city} onChange={(e) => setBilling((b) => ({ ...b, city: e.target.value }))} />
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="ZIP" value={billing.zip} onChange={(e) => setBilling((b) => ({ ...b, zip: e.target.value }))} />
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Country" value={billing.country} onChange={(e) => setBilling((b) => ({ ...b, country: e.target.value }))} />
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount code</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              value={discountCode}
              onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(''); setAppliedDiscount(null); }}
              placeholder="Code"
            />
            <button
              type="button"
              onClick={async () => {
                if (!discountCode.trim()) return;
                setDiscountError('');
                setAppliedDiscount(null);
                const res = await validateDiscountCode(total, discountCode);
                if (res.valid && res.discount_amount != null) {
                  setAppliedDiscount(res.discount_amount);
                } else {
                  setDiscountError(res.error ?? 'Invalid code');
                }
              }}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Apply
            </button>
          </div>
          {discountError && <p className="text-red-600 text-sm mt-1">{discountError}</p>}
          {appliedDiscount != null && <p className="text-green-600 text-sm mt-1">Discount: -${appliedDiscount.toFixed(2)}</p>}
        </div>
        <p className="font-semibold">
          Total: ${(Math.max(0, total - (appliedDiscount ?? 0))).toFixed(2)}
          {appliedDiscount != null && <span className="text-gray-500 font-normal ml-2">(subtotal ${total.toFixed(2)} − discount ${appliedDiscount.toFixed(2)})</span>}
        </p>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={submitting} className="w-full px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50">
          {submitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </main>
  );
}
