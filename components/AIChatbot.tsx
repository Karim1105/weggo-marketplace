'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react'
import { generateAIResponseWithRAG, getSearchContext } from '@/lib/rag'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI shopping assistant. How can I help you find the perfect item today? سلام! أنا مساعدك للتسوق.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Use RAG system for intelligent responses
    setTimeout(() => {
      const context = getSearchContext()
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponseWithRAG(input, context),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('phone') || lowerQuery.includes('mobile')) {
      return 'I found some great phones for you! Here are top picks:\n\n📱 iPhone 13 Pro - 15,000 EGP (Cairo)\n📱 Samsung Galaxy S22 - 12,500 EGP (Alexandria)\n📱 OnePlus 10 Pro - 11,000 EGP (Giza)\n\nWould you like to see more details about any of these?'
    }
    
    if (lowerQuery.includes('laptop') || lowerQuery.includes('computer')) {
      return 'I found excellent laptops in your area:\n\n💻 Dell XPS 15 - 18,000 EGP (Cairo)\n💻 MacBook Pro M1 - 25,000 EGP (Alexandria)\n💻 Lenovo ThinkPad - 14,500 EGP (Giza)\n\nAll are in great condition with warranty!'
    }
    
    if (lowerQuery.includes('furniture') || lowerQuery.includes('sofa')) {
      return 'Here are some beautiful furniture pieces:\n\n🛋️ Modern L-Shaped Sofa - 8,000 EGP (Cairo)\n🛋️ Vintage Armchair - 3,500 EGP (Alexandria)\n🛋️ Office Desk Set - 5,000 EGP (Giza)\n\nAll items are gently used and well-maintained!'
    }
    
    if (lowerQuery.includes('price') || lowerQuery.includes('سعر')) {
      return 'I can help you with pricing! Our AI analyzes similar items across multiple platforms to suggest the best price. When you list an item, just click "Get AI Price Suggestion" and I\'ll provide a competitive price based on:\n\n✓ Current market trends\n✓ Item condition\n✓ Similar listings\n✓ Location demand'
    }
    
    if (lowerQuery.includes('how') || lowerQuery.includes('كيف')) {
      return 'Here\'s how Weggo works:\n\n1️⃣ Browse personalized listings\n2️⃣ Chat with me to find items\n3️⃣ Contact sellers directly\n4️⃣ Meet safely in public places\n5️⃣ Complete your purchase\n\nSelling is easy too! Just click "Sell" and I\'ll help you price it right.'
    }

    return 'I\'m here to help you find exactly what you\'re looking for! You can ask me about:\n\n🔍 Finding specific items\n💰 Price suggestions\n📍 Items in your area\n❓ How Weggo works\n\nWhat would you like to know?'
  }

  const quickQuestions = [
    'Show me phones',
    'Find laptops',
    'Furniture deals',
    'How does pricing work?'
  ]

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 gradient-primary rounded-full shadow-2xl flex items-center justify-center z-50"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] card-modern z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-primary p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Weggo AI Assistant</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl">
                    <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-3 border-t border-gray-200 bg-white">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(question)
                        setTimeout(() => handleSend(), 100)
                      }}
                      className="text-xs px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

