import axios from 'axios'
import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'

export const listProductsThunk = createAsyncThunk(
  'productList/listProducts',
  async (keyword = '', thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/products?keyword=${keyword}`)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const deleteProductThunk = createAsyncThunk(
  'productList/deleteProduct',
  async (id, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.delete(`/api/products/${id}`, config)
      thunkAPI.dispatch(listProductsThunk())
      return
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)
export const createProductThunk = createAsyncThunk(
  'productList/createProduct',
  async (req, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.post(`/api/products`, {}, config)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)
export const updateProductThunk = createAsyncThunk(
  'productList/updateProduct',
  async (product, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.put(
        `/api/products/${product._id}`,
        product,
        config
      )
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const createProductReviewThunk = createAsyncThunk(
  'product/createProductReview',
  async ({ productId, review }, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.post(`/api/products/${productId}/reviews`, review, config)
      return
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

const initialState = {
  products: [],
  createdProduct: null,
  updatedProduct: null,
  loading: false,
  error: '',
  success: false,
}

const productListSlice = createSlice({
  name: 'productList',
  initialState,
  reducers: {
    productReset(state) {
      state.createdProduct = null
      state.updatedProduct = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listProductsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(deleteProductThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.loading = false
        state.createdProduct = action.payload
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.loading = false
        state.updatedProduct = action.payload
      })
      .addCase(createProductReviewThunk.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addMatcher(
        isAnyOf(
          listProductsThunk.pending,
          deleteProductThunk.pending,
          createProductThunk.pending,
          updateProductThunk.pending,
          createProductReviewThunk.pending
        ),
        (state) => {
          state.loading = true
        }
      )
      .addMatcher(
        isAnyOf(
          listProductsThunk.rejected,
          deleteProductThunk.rejected,
          createProductThunk.rejected,
          updateProductThunk.rejected,
          createProductReviewThunk.rejected
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  },
})

export const { productReset } = productListSlice.actions
export default productListSlice.reducer
