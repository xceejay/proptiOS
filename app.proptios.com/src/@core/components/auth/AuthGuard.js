// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { getStoredAccessToken } from 'src/utils/authStorage'

const AuthGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  useEffect(
    () => {
      if (!router.isReady) {
        return
      }
      if (auth.user === null && !getStoredAccessToken()) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }
    },
    [router.route]
  )

  // auth.loading && auth.user === null
  if (auth.loading && auth.user === null) {
    console.log('user is empty here::', auth.user)

    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
