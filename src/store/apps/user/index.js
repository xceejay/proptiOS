import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const fetchProperties = createAsyncThunk('fetchProperties', async params => {
  const response = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + '/properties', {
    params
  })

  return response.data
})

// ** Add User
export const addProperty = createAsyncThunk('appUsers/addProperty', async (data, { getState, dispatch }) => {
  const response = await axios.post('/properties', {
    data
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async params => {
  const response = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + '/apps/users/list', {
    params
  })

  return response.data
})

// ** Add User
export const addUser = createAsyncThunk('appUsers/addUser', async (data, { getState, dispatch }) => {
  const response = await axios.post('/apps/users/add-user', {
    data
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

// ** Delete User
export const deleteUser = createAsyncThunk('appUsers/deleteUser', async (id, { getState, dispatch }) => {
  const response = await axios.delete('/apps/users/delete', {
    data: id
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.users
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer
