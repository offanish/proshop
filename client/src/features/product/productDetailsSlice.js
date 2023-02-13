import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const listProductDetails = createAsyncThunk(
  'productDetails/listProducts',
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`)
      return data
    } catch (error) {
      thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

const initialState = {
  product: {},
  loading: true,
  error: '',
}

const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(listProductDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(listProductDetails.fulfilled, (state, action) => {
        state.loading = false
        state.product = action.payload
      })
      .addCase(listProductDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default productDetailsSlice.reducer
