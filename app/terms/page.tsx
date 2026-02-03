import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-gray-700">Weggo is a marketplace. We do not process payments. Buyers and sellers arrange payment and delivery directly. By using Weggo you agree to use the platform responsibly.</p>
        <p className="mt-4"><Link href="/contact" className="text-primary-600 hover:underline">Contact us</Link> for questions.</p>
      </div>
    </div>
  )
}
