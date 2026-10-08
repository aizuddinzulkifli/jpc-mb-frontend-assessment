import { configureStore } from '@reduxjs/toolkit'
import placeReducer from './placeSlice'

export const store = configureStore({
  reducer: {
    place: placeReducer,
  },
})