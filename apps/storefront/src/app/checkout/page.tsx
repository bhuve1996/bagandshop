'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useT } from '@/context/SiteConfigContext';
import { checkoutOrder, validateDiscountCode } from '@/lib/api';

export default function CheckoutPage() {
  const t = useT();
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
      <main className="section-pad">
        <div className="container-narrow max-w-xl text-center">
          <h1 className="heading-2 text-[rgb(var(--color-foreground))] mb-4">{t('checkout.title')}</h1>
          <p className="prose-custom mb-6">{t('cart.empty')}</p>
          <Link href="/cart" className="btn-primary">{t('nav.cart')}</Link>
        </div>
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
      setError(err instanceof Error ? err.message : t('checkout.failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="section-pad">
      <div className="container-narrow max-w-xl">
        <h1 className="heading-2 text-[rgb(var(--color-foreground))] mb-8">{t('checkout.title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-1">{t('auth.email')}</label>
            <input type="email" className="input-base" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="p-4 rounded-lg bg-[rgb(var(--color-card))]">
            <h2 className="font-semibold text-[rgb(var(--color-foreground))] mb-3">Shipping address</h2>
            <div className="space-y-3">
              <input type="text" className="input-base" placeholder="Name" value={shipping.name} onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))} />
              <input type="text" className="input-base" placeholder="Address" value={shipping.address1} onChange={(e) => setShipping((s) => ({ ...s, address1: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" className="input-base" placeholder="City" value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} />
                <input type="text" className="input-base" placeholder="ZIP" value={shipping.zip} onChange={(e) => setShipping((s) => ({ ...s, zip: e.target.value }))} />
              </div>
              <input type="text" className="input-base" placeholder="Country" value={shipping.country} onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={sameAsShipping} onChange={(e) => setSameAsShipping(e.target.checked)} className="rounded" />
            <span className="text-sm text-[rgb(var(--color-foreground))]">Billing same as shipping</span>
          </label>
          {!sameAsShipping && (
            <div className="p-4 rounded-lg bg-[rgb(var(--color-card))]">
              <h2 className="font-semibold text-[rgb(var(--color-foreground))] mb-3">Billing address</h2>
              <div className="space-y-3">
                <input type="text" className="input-base" placeholder="Name" value={billing.name} onChange={(e) => setBilling((b) => ({ ...b, name: e.target.value }))} />
                <input type="text" className="input-base" placeholder="Address" value={billing.address1} onChange={(e) => setBilling((b) => ({ ...b, address1: e.target.value }))} />
                <input type="text" className="input-base" placeholder="City" value={billing.city} onChange={(e) => setBilling((b) => ({ ...b, city: e.target.value }))} />
                <input type="text" className="input-base" placeholder="ZIP" value={billing.zip} onChange={(e) => setBilling((b) => ({ ...b, zip: e.target.value }))} />
                <input type="text" className="input-base" placeholder="Country" value={billing.country} onChange={(e) => setBilling((b) => ({ ...b, country: e.target.value }))} />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-1">Discount code</label>
            <div className="flex gap-2">
              <input type="text" className="input-base flex-1" value={discountCode} onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(''); setAppliedDiscount(null); }} placeholder="Code" />
              <button type="button" onClick={async () => { if (!discountCode.trim()) return; setDiscountError(''); setAppliedDiscount(null); const res = await validateDiscountCode(total, discountCode); if (res.valid && res.discount_amount != null) setAppliedDiscount(res.discount_amount); else setDiscountError(res.error ?? 'Invalid code'); }} className="btn-outline shrink-0">{t('checkout.apply')}</button>
            </div>
            {discountError && <p className="text-red-600 text-sm mt-1">{discountError}</p>}
            {appliedDiscount != null && <p className="text-green-600 text-sm mt-1">Discount: -${appliedDiscount.toFixed(2)}</p>}
          </div>
          <p className="font-semibold text-[rgb(var(--color-foreground))]">
            {t('cart.total')}: ${(Math.max(0, total - (appliedDiscount ?? 0))).toFixed(2)}
            {appliedDiscount != null && <span className="text-[rgb(var(--color-muted))] font-normal ml-2">(subtotal ${total.toFixed(2)} − discount ${appliedDiscount.toFixed(2)})</span>}
          </p>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full py-4">
            {submitting ? t('checkout.placingOrder') : t('checkout.placeOrder')}
          </button>
        </form>
      </div>
    </main>
  );
}
