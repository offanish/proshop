import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const listProductsThunk = createAsyncThunk(
  'productList/listProducts',
  async (req, thunkAPI) => {
    try {
      const { data } = await axios.get('/api/products')
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

const initialState = {
  products: [],
  loading: false,
  error: '',
}

const productListSlice = createSlice({
  name: 'productList',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(listProductsThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(listProductsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(listProductsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default productListSlice.reducer
