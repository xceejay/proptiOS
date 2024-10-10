// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'src/pages/middleware/axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  loading: true,
  accessToken: null,
  setAccessToken: () => {},
  setUser: () => {},
  setLoading: () => {},
  getUsers: () => Promise.resolve(),
  getUser: () => Promise.resolve(),
  addUsers: () => Promise.resolve(),
  editUsers: () => Promise.resolve(),
  user: null,
  setUsers: () => {},
  setUser: () => {},
  users: null
}

const UsersContext = createContext(defaultProvider)

const UsersProvider = ({ children }) => {
  // ** States
  const [users, setUsers] = useState(defaultProvider.users)
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [accessToken, setAccessToken] = useState(null)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const storedToken = window.localStorage.getItem('accessToken')
    if (storedToken) {
      setAccessToken(storedToken)
      console.log('Users Context accessToken Set')
    }
  }, [])

  // Function for getting users
  const getUsers = (params, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get('https://api.pm.manages.homes/users', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          setUsers(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  // Function for getting a single user
  const getUser = (id, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(`https://api.pm.manages.homes/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)

          if (response.data == 'NO_RES') {
            throw new error('NO USER FOUND')
          }
          setUser(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  // Function for adding users
  const addUsers = (data, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .post('https://api.pm.manages.homes/users', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)

          // Map the request data to include empty arrays/default values for other fields
          // const newUser = data.map(user => ({
          //   ...user,
          //   id: response.data.id || null, // Assuming the response contains a unique id
          //   uuid: response.data.uuid || null, // Assuming the response contains a unique UUID
          //   contract_documents: [],
          //   id_documents: [],
          //   maintenance_requests: [],
          //   transactions: [],
          //   property: {},
          //   unit: {
          //     id: null,
          //     floor_no: null,
          //     bedrooms: null,
          //     furnished_status: null,
          //     monthly_rent: null
          //   },
          //   status: 'active',
          //   created_at: new Date().toISOString(),
          //   updated_at: new Date().toISOString(),
          //   logged_in: null,
          //   logged_out: null
          // }))

          // // Update the users state
          // setUsers(prevUsers => ({
          //   ...prevUsers,
          //   data: {
          //     ...prevUsers.data,
          //     items: [...(prevUsers.data.items || []), ...newUser]
          //   }
          // }))

          // console.log('Updated users:', users)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const editUsers = (data, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .put('https://api.pm.manages.homes/users', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    users,
    user,
    setUser,
    setUsers,
    addUsers,
    editUsers,
    loading,
    setLoading,
    setAccessToken,
    accessToken,
    getUsers,
    getUser
  }

  return <UsersContext.Provider value={values}>{children}</UsersContext.Provider>
}

export { UsersContext, UsersProvider }
