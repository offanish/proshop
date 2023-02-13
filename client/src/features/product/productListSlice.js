import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const listProducts = createAsyncThunk(
  'productList/listProducts',
  async (req, thunkAPI) => {
    try {
      const { data } = await axios.get('/api/products')
      return data
    } catch (error) {
      thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

const initialState = {
  products: [],
  loading: true,
  error: '',
}

const productListSlice = createSlice({
  name: 'productList',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default productListSlice.reducer
