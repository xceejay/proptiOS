import axios from 'axios'

import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

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

// Add a response interceptor
// axios.interceptors.response.use(
//   function (response) {
//     // Do something with response data
//     return response
//   },
//   function (error) {
//     // Do something with response error
//     return Promise.reject(error)
//   }
// )

axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (403 === error.response.status) {
      console.log('Unauthorized. Logging out..')
      window.localStorage.removeItem('accessToken')

      toast.error('Unauthorized Access', { duration: 3000 })
    } else {
      return Promise.reject(error)
    }
  }
)

export default axios
