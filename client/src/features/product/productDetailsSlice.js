import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const listProductDetailsThunk = createAsyncThunk(
  'productDetails/listProductDetails',
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

const initialState = {
  product: {},
  loading: false,
  error: '',
}

const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(listProductDetailsThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(listProductDetailsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.product = action.payload
      })
      .addCase(listProductDetailsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default productDetailsSlice.reducer
