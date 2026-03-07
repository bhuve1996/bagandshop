'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-6">Cart</h1>
        <p className="text-gray-500 mb-6">Your cart is empty.</p>
        <Link href="/collections" className="text-blue-600 hover:underline">Continue shopping</Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Cart</h1>
      <ul className="divide-y mb-8">
        {items.map((item) => (
          <li key={item.key} className="py-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">${item.price} × {item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                className="w-16 border rounded px-2 py-1 text-sm"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.key, parseInt(e.target.value, 10) || 1)}
              />
              <button
                type="button"
                onClick={() => removeItem(item.key)}
                className="text-red-600 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-lg font-semibold mb-6">Total: ${total.toFixed(2)}</p>
      <Link
        href="/checkout"
        className="inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800"
      >
        Checkout
      </Link>
    </main>
  );
}
