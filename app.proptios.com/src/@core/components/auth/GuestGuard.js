// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { getStoredAccessToken } from 'src/utils/authStorage'

const GuestGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady || auth.loading) {
      return
    }

    if (auth.user || getStoredAccessToken()) {
      const returnUrl = typeof router.query.returnUrl === 'string' ? router.query.returnUrl : '/'
      router.replace(returnUrl)
    }
  }, [auth.loading, auth.user, router])

  if (auth.loading || (!auth.loading && (auth.user !== null || getStoredAccessToken()))) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
