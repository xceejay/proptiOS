import { configureStore } from '@reduxjs/toolkit'

const noopReducer = (state = {}) => state

export const store = configureStore({
  reducer: {
    app: noopReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
