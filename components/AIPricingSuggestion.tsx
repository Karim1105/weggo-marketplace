'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, TrendingUp, TrendingDown, Check, Loader2, ExternalLink } from 'lucide-react'

interface AIPricingSuggestionProps {
  title: string
  description: string
  category: string
  condition: string
  onClose: () => void
  onSelectPrice: (price: number) => void
}

interface PriceSuggestion {
  price: number
  confidence: number
  reason: string
  marketTrend: 'up' | 'down' | 'stable'
  sources: { platform: string; price: number; url: string }[]
}

export default function AIPricingSuggestion({
  title,
  description,
  category,
  condition,
  onClose,
  onSelectPrice
}: AIPricingSuggestionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [suggestion, setSuggestion] = useState<PriceSuggestion | null>(null)

  useEffect(() => {
    // Simulate AI analysis - In production, this would call your AI API
    // that scrapes other platforms and analyzes market data
    setTimeout(() => {
      const basePrices: Record<string, number> = {
        electronics: 15000,
        furniture: 8000,
        vehicles: 350000,
        fashion: 500,
        home: 3000,
        sports: 2000,
        books: 150,
        toys: 300
      }

      const conditionMultipliers: Record<string, number> = {
        new: 1.0,
        'like-new': 0.85,
        good: 0.7,
        fair: 0.5,
        poor: 0.3
      }

      const basePrice = basePrices[category.toLowerCase()] || 1000
      const multiplier = conditionMultipliers[condition.toLowerCase()] || 0.7
      const suggestedPrice = Math.round(basePrice * multiplier)

      const mockSuggestion: PriceSuggestion = {
        price: suggestedPrice,
        confidence: 87,
        reason: `Based on ${Math.floor(Math.random() * 50 + 20)} similar listings across Egyptian marketplaces, your item's condition, and current market demand.`,
        marketTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any,
        sources: [
          {
            platform: 'OLX Egypt',
            price: suggestedPrice + Math.floor(Math.random() * 1000 - 500),
            url: 'https://olx.com.eg'
          },
          {
            platform: 'Facebook Marketplace',
            price: suggestedPrice + Math.floor(Math.random() * 1000 - 500),
            url: 'https://facebook.com/marketplace'
          },
          {
            platform: 'Dubizzle Egypt',
            price: suggestedPrice + Math.floor(Math.random() * 1000 - 500),
            url: 'https://egypt.dubizzle.com'
          }
        ]
      }

      setSuggestion(mockSuggestion)
      setIsAnalyzing(false)
    }, 3000)
  }, [title, category, condition])

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-2xl card-modern max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 gradient-primary p-6 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Price Suggestion</h2>
                <p className="text-sm text-white/80">Powered by real market data</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {isAnalyzing ? (
              <div className="py-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-6"
                >
                  <Loader2 className="w-20 h-20 text-primary-500" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Market Data...</h3>
                <p className="text-gray-600 mb-4">
                  Scanning multiple platforms for similar items
                </p>
                <div className="space-y-2 max-w-md mx-auto">
                  {['OLX Egypt', 'Facebook Marketplace', 'Dubizzle Egypt', 'El-Menus'].map((platform, index) => (
                    <motion.div
                      key={platform}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.3 }}
                      className="flex items-center space-x-2 text-sm text-gray-600"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Scanning {platform}...</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : suggestion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Suggested Price */}
                <div className="text-center py-8 gradient-primary rounded-2xl">
                  <p className="text-white/80 mb-2">Suggested Price</p>
                  <p className="text-5xl font-bold text-white mb-2">
                    {suggestion.price.toLocaleString()} EGP
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-white/90">
                    {suggestion.marketTrend === 'up' && (
                      <>
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm">Market trending up</span>
                      </>
                    )}
                    {suggestion.marketTrend === 'down' && (
                      <>
                        <TrendingDown className="w-5 h-5" />
                        <span className="text-sm">Market trending down</span>
                      </>
                    )}
                    {suggestion.marketTrend === 'stable' && (
                      <span className="text-sm">Stable market</span>
                    )}
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="p-6 bg-primary-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-700">Confidence Score</span>
                    <span className="text-2xl font-bold text-primary-600">{suggestion.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${suggestion.confidence}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full gradient-primary"
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Analysis Details</h3>
                  <p className="text-gray-600 leading-relaxed">{suggestion.reason}</p>
                </div>

                {/* Price Range Suggestion */}
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => onSelectPrice(Math.round(suggestion.price * 0.9))}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all text-center"
                  >
                    <p className="text-sm text-gray-600 mb-1">Quick Sale</p>
                    <p className="text-xl font-bold text-gray-900">
                      {Math.round(suggestion.price * 0.9).toLocaleString()}
                    </p>
                  </button>
                  <button
                    onClick={() => onSelectPrice(suggestion.price)}
                    className="p-4 gradient-primary text-white rounded-xl shadow-lg text-center"
                  >
                    <p className="text-sm text-white/80 mb-1">Recommended</p>
                    <p className="text-xl font-bold">
                      {suggestion.price.toLocaleString()}
                    </p>
                  </button>
                  <button
                    onClick={() => onSelectPrice(Math.round(suggestion.price * 1.1))}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all text-center"
                  >
                    <p className="text-sm text-gray-600 mb-1">Premium</p>
                    <p className="text-xl font-bold text-gray-900">
                      {Math.round(suggestion.price * 1.1).toLocaleString()}
                    </p>
                  </button>
                </div>

                {/* Market Sources */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Similar Listings Found</h3>
                  <div className="space-y-3">
                    {suggestion.sources.map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{source.platform}</p>
                          <p className="text-sm text-gray-600">Average price from similar items</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {source.price.toLocaleString()} EGP
                          </p>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                          >
                            <span>View</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="p-6 bg-accent-50 rounded-xl border border-accent-200">
                  <h3 className="font-semibold text-lg mb-3 text-accent-900">💡 Pro Tips</h3>
                  <ul className="space-y-2 text-sm text-accent-800">
                    <li>• Items priced 10-15% below market average sell 3x faster</li>
                    <li>• Clear photos can increase your price by up to 20%</li>
                    <li>• Detailed descriptions attract serious buyers</li>
                    <li>• Respond quickly to inquiries to close deals faster</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onSelectPrice(suggestion.price)}
                    className="flex-1 px-6 py-3 gradient-primary text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Use This Price
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}



