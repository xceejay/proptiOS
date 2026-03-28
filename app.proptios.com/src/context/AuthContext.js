// ** React Imports
import { createContext, useEffect, useState } from 'react'

import jwt from 'jsonwebtoken'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'src/pages/middleware/axios'
import { buildTenantAppUrl, normalizeSiteHost, resolveCurrentSiteHost } from 'src/utils/siteHost'
import { clearAccessToken, getStoredAccessToken, persistAccessToken, syncAccessTokenFromCookie } from 'src/utils/authStorage'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  const isGuestRoute = pathname => {
    return (
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/forgot-password') ||
      pathname.startsWith('/onboarding')
    )
  }

  const clearStoredAuth = () => {
    clearAccessToken()
    }

  const redirectToTenantSiteIfNeeded = (activeUser, fallbackPath = '/') => {
    if (typeof window === 'undefined' || !activeUser?.site_id) {
      return false
    }

    const currentHost = normalizeSiteHost(window.location.hostname)
    const requestedSiteHost = resolveCurrentSiteHost()
    const targetUrl = buildTenantAppUrl(activeUser.site_id, currentHost, fallbackPath)

    if (!targetUrl.startsWith('https://')) {
      return false
    }

    const targetHost = normalizeSiteHost(new URL(targetUrl).hostname)
    if (!targetHost || targetHost === currentHost || targetHost === requestedSiteHost) {
      return false
    }

    window.location.assign(targetUrl)

    return true
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = getStoredAccessToken() || syncAccessTokenFromCookie()

        if (!storedToken) {
          setLoading(false)

          return
        }

        //this is used to validate the token (the backend does everything, if it returns 403 or 401 the axios interceptor intercepts it)
        await axios
          .get(process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          .then(async response => {
            setLoading(false)
          })
          .catch(error => {
            console.log('encountered this error', error)
            setLoading(true)

            clearStoredAuth()
            setUser(null)

            setLoading(false)

            if (!isGuestRoute(window.location.pathname)) {
              router.push('/login')
            }
          })

        const decoded = jwt.decode(storedToken, { complete: true })
        const decodedUser = decoded?.payload || null

        setLoading(false)
        console.log('decoded-data', decoded)

        setUser(decodedUser)
        setLoading(false)
        redirectToTenantSiteIfNeeded(decodedUser, window.location.pathname || '/')
      } catch (error) {
        console.log(error)
        setLoading(false)

        clearStoredAuth()
        setUser(null)

        if (!isGuestRoute(window.location.pathname)) {
          router.push('/login')
        }
      }
    }

    // console.log('are you null?:', JSON.parse(userData))

    // await axios
    //   .get(authConfig.meEndpoint, {
    //     headers: {
    //       Authorization: storedToken
    //     }
    //   })
    //   .then(async response => {
    //     setLoading(false)
    //     setUser({ ...response.data.userData })
    //   })
    //   .catch(() => {
    //     localStorage.removeItem('userData')
    //     localStorage.removeItem('refreshToken')
    //     localStorage.removeItem('accessToken')
    //     setUser(null)
    //     setLoading(false)
    //     if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
    //       router.replace('/login')
    //     }
    //   })
    initAuth()
  }, [])

  const handleLogin = (params, errorCallback) => {
    console.log('logging in')
    console.log('url:' + process.env.NEXT_PUBLIC_API_BASE_URL)
    axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/login', params)

      .then(async response => {
        if (params.rememberMe) {
          persistAccessToken(response.data.data.token)
        }
        const returnUrl = router.query.returnUrl
        const authenticatedUser = { ...response.data.data.user }
        setUser(authenticatedUser)

        // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.data.user)) : null
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/' // can change domain
        const redirectedToTenant = redirectToTenantSiteIfNeeded(authenticatedUser, redirectURL)
        if (!redirectedToTenant) {
          router.replace(redirectURL)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    console.log('logged out')
    setUser(null)
    clearStoredAuth()
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
