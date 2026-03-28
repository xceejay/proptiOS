import axios from 'axios'

import toast from 'react-hot-toast'
import { resolveCurrentSiteHost } from 'src/utils/siteHost'
import { clearAccessToken } from 'src/utils/authStorage'

// Add a request interceptor
// axios.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     console.log(config)

//     return config
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error)
//   }
// )

axios.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const requestedSiteHost = resolveCurrentSiteHost()
      if (requestedSiteHost) {
        config.headers = config.headers || {}
        config.headers['X-Site-Host'] = requestedSiteHost
      }
    }

    return config
  },
  error => Promise.reject(error)
)

axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (403 === error.response.status || 401 === error.response.status) {
      console.log('Unauthorized. Logging out..')
      clearAccessToken()

      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        toast.error('Unauthorized Access, redirecting to login page', { duration: 3000 })
        setTimeout(function () {
          console.log('redirecting')
          window.location.href = '/login'
        }, 3000)
      }
    } else if (402 === error.response.status) {
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        toast.error('Please upgrade or renew your subscription😃', { duration: 3000 })
        setTimeout(function () {
          console.log('Renew your subscription')
          // window.history.back()
        }, 6000)
      }
    } else if (405 === error.response.status) {
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        toast.error('Unauthorized Access to this resource, Contact your admin😅', { duration: 3000 })
        setTimeout(function () {
          console.log('redirecting you back')
          window.history.back()
        }, 3000)
      }
    } else {
      return Promise.reject(error)
    }
  }
)

export default axios
