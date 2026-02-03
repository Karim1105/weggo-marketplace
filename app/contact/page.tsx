'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Thank you. We will get back to you soon.')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact us</h1>
        <p className="text-gray-600 mb-8">Send us a message.</p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700">
              <Send className="w-5 h-5" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
