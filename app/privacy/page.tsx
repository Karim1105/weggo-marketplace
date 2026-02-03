import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">Last updated: 2025</p>
        <div className="space-y-4 text-gray-700">
          <p>Weggo respects your privacy. We collect information you provide when you register and create listings. We use it to operate the platform and do not sell your data.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-6">Contact</h2>
          <p>For privacy requests, see <Link href="/contact" className="text-primary-600 hover:underline">Contact</Link>.</p>
        </div>
      </div>
    </div>
  )
}
