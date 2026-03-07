import Link from 'next/link';

export default function AdminHome() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bag and Shop Admin</h1>
      <nav className="space-y-2">
        <Link href="/pages" className="block text-blue-600 hover:underline">
          Pages
        </Link>
        <Link href="/categories" className="block text-blue-600 hover:underline">
          Categories
        </Link>
        <Link href="/products" className="block text-blue-600 hover:underline">
          Products
        </Link>
        <Link href="/combos" className="block text-blue-600 hover:underline">
          Combos
        </Link>
        <Link href="/vendors" className="block text-blue-600 hover:underline">
          Vendors
        </Link>
        <Link href="/orders" className="block text-blue-600 hover:underline">
          Orders
        </Link>
        <Link href="/discounts" className="block text-blue-600 hover:underline">
          Discount codes
        </Link>
        <Link href="/email" className="block text-blue-600 hover:underline">
          Email (templates & workflows)
        </Link>
        <Link href="/reviews" className="block text-blue-600 hover:underline">
          Reviews (moderate)
        </Link>
        <Link href="/chatbot" className="block text-blue-600 hover:underline">
          Chatbot knowledge
        </Link>
        <Link href="/social" className="block text-blue-600 hover:underline">
          Social feed config
        </Link>
      </nav>
    </div>
  );
}
