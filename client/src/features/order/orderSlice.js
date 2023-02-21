import axios from 'axios'
import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'

const initialState = {
  loading: true,
  orderLoading: true,
  createdOrder: {},
  orderDetails: {},
  success: false,
  deliverSuccess: false,
  paymentSuccess: false,
  myOrders: [],
  orders: [],
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

export const deliverOrder = createAsyncThunk(
  'order/deliverOrder',
  async (orderId, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.put(
        `/api/orders/${orderId}/deliver`,
        {},
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

export const getOrders = createAsyncThunk(
  'order/getOrders',
  async (req, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.get(`/api/orders/`, config)
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
      state.orders = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(payOrder.fulfilled, (state) => {
      state.loading = false
      state.paymentSuccess = true
    })
    builder.addCase(deliverOrder.fulfilled, (state) => {
      state.loading = false
      state.deliverSuccess = true
    })
    builder.addMatcher(
      isAnyOf(payOrder.pending, deliverOrder.pending),
      (state) => {
        state.loading = true
      }
    )
    builder.addMatcher(
      isAnyOf(
        createOrder.pending,
        getOrderDetails.pending,
        getMyOrders.pending,
        getOrders.pending
      ),
      (state) => {
        state.loading = true
        state.orderLoading = true
      }
    )
    builder.addMatcher(
      isAnyOf(
        createOrder.fulfilled,
        getOrderDetails.fulfilled,
        getMyOrders.fulfilled,
        getOrders.fulfilled
      ),
      (state, action) => {
        state.loading = false
        if (action.type === 'order/createOrder/fulfilled') {
          state.success = true
          state.createdOrder = action.payload
        }
        if (action.type === 'order/getOrderDetails/fulfilled') {
          state.orderDetails = action.payload
          state.orderLoading = false
        }
        if (action.type === 'order/getMyOrders/fulfilled') {
          state.myOrders = action.payload
        }
        if (action.type === 'order/getOrders/fulfilled') {
          state.orders = action.payload
        }
      }
    )
    builder.addMatcher(
      isAnyOf(
        createOrder.rejected,
        getOrderDetails.rejected,
        getMyOrders.rejected,
        getOrders.rejected,
        payOrder.rejected,
        deliverOrder.rejected
      ),
      (state, action) => {
        state.loading = false
        state.error = action.payload
        state.orderLoading = false
      }
    )
  },
})

export const { resetOrders } = orderSlice.actions
export default orderSlice.reducer
