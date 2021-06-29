import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { unsplashInstance } from "../../util/axios_unsplash"

const initialState = {
  status: "idle",
  photos: [],
  total_pages: 1
}

export const fetchAsyncPhotos = createAsyncThunk(
  "photos/search",
  async (query) => {
    const data = await unsplashInstance(`/search/photos?query=${query}&per_page=30`).then(res => res.data)
    console.log(data)
    return {
      photos: data.results,
      total_pages: data.total_pages
    }
  }
)

export const fetchAsyncMorePhotos = createAsyncThunk(
  "photos/addMorePhoto",
  async (query, page) => {
    const data = await unsplashInstance(`/search/photos?query=${query}&per_page=30&page=${page}`).then(res => res.data)
    return {
      photos: data.results,
      total_pages: data.total_pages
    }
  }
)

export const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncPhotos.fulfilled, (state, action) => {
      state.photos = action.payload.photos
      state.total_pages = action.payload.total_pages
      state.status = "complete"
    })
    builder.addCase(fetchAsyncPhotos.pending, (state, action) => {
      state.status = "loading"
    })
    builder.addCase(fetchAsyncPhotos.rejected, (state, action) => {
      state.status = "failed"
    })

    builder.addCase(fetchAsyncMorePhotos.fulfilled, (state, action) => {
      console.log("了")
      state.photos = [...state.photos, ...action.payload.photos]
      state.status = "complete"
    })
    builder.addCase(fetchAsyncMorePhotos.pending, (state, action) => {
      state.status = "loading"
    })
    builder.addCase(fetchAsyncMorePhotos.rejected, (state, action) => {
      state.status = "failed"
    })
  }
})

export const selectPhotos = (state) => state.photos

export default photosSlice.reducer