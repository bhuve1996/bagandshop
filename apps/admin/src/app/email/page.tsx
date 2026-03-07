import Link from 'next/link';

export default function EmailPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Email & marketing</h1>
      <nav className="space-y-2">
        <Link href="/email/templates" className="block text-blue-600 hover:underline">
          Email templates
        </Link>
        <Link href="/email/workflows" className="block text-blue-600 hover:underline">
          Email workflows
        </Link>
        <Link href="/discounts" className="block text-blue-600 hover:underline">
          Discount codes
        </Link>
      </nav>
    </div>
  );
}
