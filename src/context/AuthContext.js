// ** React Imports
import { createContext, useEffect, useState } from 'react'

import jwt from 'jsonwebtoken'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'src/pages/middleware/axios'

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
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

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

            handleLogout()

            setLoading(false)
          })

        if (storedToken) {
          const decoded = jwt.decode(storedToken, { complete: true })

          setLoading(false)
          console.log('decoded-data', decoded)

          setUser(decoded.payload)
          setLoading(false)
        } else {
          console.log('else: NO token')
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
        setLoading(false)

        handleLogout()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    console.log('logging in')
    console.log('url:' + process.env.NEXT_PUBLIC_API_BASE_URL)
    axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/login', params)

      .then(async response => {
        params.rememberMe ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.data.token) : null
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.data.user })

        // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.data.user)) : null
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/' // can change domain
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    console.log('logged out')
    setUser(null)
    window.localStorage.removeItem('accessToken')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
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
