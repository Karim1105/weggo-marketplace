import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function useUserVerification() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch current user on mount
  useEffect(() => {
    setIsLoading(true)
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const handleVerificationFlow = useCallback((redirectPath = '/sell') => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to continue')
      router.push('/login?redirect=/auth/upload-id')
      return
    }

    // Check if already verified
    if (user.sellerVerified) {
      toast.success('You are already a verified seller!')
      router.push(redirectPath)
      return
    }

    // Redirect to ID upload
    router.push('/auth/upload-id')
  }, [user, router])

  return { user, isLoading, handleVerificationFlow }
}
