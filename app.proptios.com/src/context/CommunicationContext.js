import { createContext, useEffect, useState } from 'react'
import axios from 'src/pages/middleware/axios'
import { getStoredAccessToken } from 'src/utils/authStorage'

const defaultProvider = {
  loading: true,
  accessToken: null,
  setAccessToken: () => {},
  setLoading: () => {},
  getIssues: () => Promise.resolve(),
  getIssue: () => Promise.resolve(),
  addIssue: () => Promise.resolve(),
  addIssueComment: () => Promise.resolve(),
  updateIssueStatus: () => Promise.resolve(),
}

const CommunicationContext = createContext(defaultProvider)

const CommunicationProvider = ({ children }) => {
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [accessToken, setAccessToken] = useState(defaultProvider.accessToken)

  useEffect(() => {
    const storedToken = getStoredAccessToken()
    if (storedToken) {
      setAccessToken(storedToken)
    }
    setLoading(false)
  }, [])

  const getToken = errorCallback => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return null
    }

    return token
  }

  const getIssues = (successCallback, errorCallback) => {
    const token = getToken(errorCallback)
    if (!token) return

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + '/communication/issues', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        if (successCallback) successCallback(response.data)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const getIssue = (id, successCallback, errorCallback) => {
    const token = getToken(errorCallback)
    if (!token) return

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + `/communication/issues/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        if (successCallback) successCallback(response.data)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const addIssue = (data, successCallback, errorCallback) => {
    const token = getToken(errorCallback)
    if (!token) return

    axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + '/communication/issues', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        if (successCallback) successCallback(response.data)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const addIssueComment = (issueId, data, successCallback, errorCallback) => {
    const token = getToken(errorCallback)
    if (!token) return

    axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + `/communication/issues/${issueId}/comments`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        if (successCallback) successCallback(response.data)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const updateIssueStatus = (issueId, data, successCallback, errorCallback) => {
    const token = getToken(errorCallback)
    if (!token) return

    axios
      .patch(process.env.NEXT_PUBLIC_API_BASE_URL + `/communication/issues/${issueId}/status`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        if (successCallback) successCallback(response.data)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    loading,
    accessToken,
    setAccessToken,
    setLoading,
    getIssues,
    getIssue,
    addIssue,
    addIssueComment,
    updateIssueStatus,
  }

  return <CommunicationContext.Provider value={values}>{children}</CommunicationContext.Provider>
}

export { CommunicationContext, CommunicationProvider }
