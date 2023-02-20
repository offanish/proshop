import axios from 'axios'
import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'

const initialState = {
  loading: true,
  createdOrder: {},
  orderDetails: {},
  success: false,
  paymentSuccess: false,
  myOrders: [],
  error: '',
}

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.post('/api/orders', order, config)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.get(`/api/orders/${id}`, config)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const payOrder = createAsyncThunk(
  'order/payOrder',
  async ({ orderId, paymentResult }, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      )
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (req, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.get(`/api/orders/myorders`, config)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrders(state) {
      state.myOrders = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(payOrder.pending, (state) => {
      state.loading = true
    })
    builder.addCase(payOrder.fulfilled, (state) => {
      state.loading = false
      state.paymentSuccess = true
    })
    builder.addCase(payOrder.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    builder.addMatcher(
      isAnyOf(
        createOrder.pending,
        getOrderDetails.pending,
        getMyOrders.pending
      ),
      (state) => {
        state.loading = true
      }
    )
    builder.addMatcher(
      isAnyOf(
        createOrder.fulfilled,
        getOrderDetails.fulfilled,
        getMyOrders.fulfilled
      ),
      (state, action) => {
        state.loading = false
        if (action.type === 'order/createOrder/fulfilled') {
          state.success = true
          state.createdOrder = action.payload
        }
        if (action.type === 'order/getOrderDetails/fulfilled') {
          state.orderDetails = action.payload
        }
        if (action.type === 'order/getMyOrders/fulfilled') {
          state.myOrders = action.payload
        }
      }
    )
    builder.addMatcher(
      isAnyOf(
        createOrder.rejected,
        getOrderDetails.rejected,
        getMyOrders.rejected
      ),
      (state, action) => {
        state.loading = false
        state.error = action.payload
      }
    )
  },
})

export const { resetOrders } = orderSlice.actions
export default orderSlice.reducer
