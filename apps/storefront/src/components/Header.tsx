'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { authLogout } from '@/lib/api';

export function Header() {
  const { items } = useCart();
  const { user, loading, setUser, setToken } = useAuth();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = async () => {
    await authLogout();
    setUser(null);
    setToken(null); // sync context
  };

  return (
    <header className="border-b">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex gap-6 items-center">
        <Link href="/" className="font-semibold">Bag and Shop</Link>
        <Link href="/collections" className="text-gray-600 hover:text-gray-900">Collections</Link>
        <Link href="/combos" className="text-gray-600 hover:text-gray-900">Combos</Link>
        <div className="ml-auto flex gap-4 items-center">
          {!loading && (
            user
              ? (
                  <>
                    <Link href="/account" className="text-gray-600 hover:text-gray-900">Account</Link>
                    <button type="button" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                      Logout
                    </button>
                  </>
                )
              : (
                  <>
                    <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                    <Link href="/register" className="text-gray-600 hover:text-gray-900">Register</Link>
                  </>
                )
          )}
          <Link href="/cart" className="text-gray-600 hover:text-gray-900">
            Cart {count > 0 ? `(${count})` : ''}
          </Link>
        </div>
      </nav>
    </header>
  );
}
