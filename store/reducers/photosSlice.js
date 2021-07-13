import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { unsplashInstance } from "../../util/axios_unsplash"

const initialState = {
  status: "idle",
  photos: [],
  total_pages: 1,
  type: null,
}

export const fetchAsyncPhotos = createAsyncThunk(
  "photos/search",
  async (query) => {
    const data = await unsplashInstance(`/search/photos?query=${query}&per_page=30`).then(res => res.data)
    return {
      photos: data.results,
      total_pages: data.total_pages,
    }
  }
)

export const fetchAsyncMorePhotos = createAsyncThunk(
  "photos/addMorePhoto",
  async ({query, newPage}) => {
    const data = await unsplashInstance(`/search/photos?query=${query}&per_page=30&page=${newPage}`).then(res => res.data)
    return {
      page: newPage,
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
      state.photos = [{
        "page": 1,
        "data": action.payload.photos
      }]
      state.total_pages = action.payload.total_pages
      state.status = "complete"
    })
    builder.addCase(fetchAsyncPhotos.pending, (state, action) => {
      state.status = "loading"
      state.type = "new"
    })
    builder.addCase(fetchAsyncPhotos.rejected, (state, action) => {
      state.status = "failed"
    })

    builder.addCase(fetchAsyncMorePhotos.fulfilled, (state, action) => {
      state.photos = [...state.photos,
        {
          "page": action.payload.page,
          "data": action.payload.photos
        }
      ]
      // state.photos = action.payload.photos
      state.status = "complete"
    })
    builder.addCase(fetchAsyncMorePhotos.pending, (state, action) => {
      state.status = "loading"
      state.type = "add"
    })
    builder.addCase(fetchAsyncMorePhotos.rejected, (state, action) => {
      state.status = "failed"
    })
  }
})

export const selectPhotos = (state) => state.photos

export default photosSlice.reducer