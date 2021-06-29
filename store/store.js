import { configureStore } from "@reduxjs/toolkit"
import photosReducer from "./reducers/photosSlice"

export const store = configureStore({
  reducer: {
    photos: photosReducer,
  },
})