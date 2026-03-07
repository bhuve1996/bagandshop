import Link from 'next/link';

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="bg-white shadow px-8 py-4 flex gap-4">
        <Link href="/" className="text-gray-600 hover:text-gray-900">Admin</Link>
        <Link href="/orders" className="text-blue-600 font-medium">Orders</Link>
      </nav>
      {children}
    </div>
  );
}
