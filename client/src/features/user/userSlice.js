import axios from 'axios'
import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'
import { resetOrders } from '../order/orderSlice'

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const initialState = {
  userInfo: userInfoFromStorage,
  userDetails: null,
  loading: false,
  error: '',
}

export const loginUserThunk = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      )
      localStorage.setItem('userInfo', JSON.stringify(data))
      return data
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const registerUserThunk = createAsyncThunk(
  'user/registerUser',
  async ({ name, email, password }, thunkAPI) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await axios.post(
        '/api/users',
        { name, email, password },
        config
      )
      localStorage.setItem('userInfo', JSON.stringify(data))
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const getUserDetailsThunk = createAsyncThunk(
  'user/getUserDetails',
  async (id, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.get(`/api/users/${id}`, config)
      return data
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const updateUserProfileThunk = createAsyncThunk(
  'user/updateUserProfile',
  async ({ name, email, password }, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.put(
        '/api/users/profile',
        { name, email, password },
        config
      )
      localStorage.setItem('userInfo', JSON.stringify(data))
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const logoutUserThunk = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch(logoutUser())
  dispatch(resetOrders())
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser(state) {
      state.userInfo = null
      state.userDetails = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetailsThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserDetailsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.userDetails = action.payload
      })
      .addCase(getUserDetailsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addMatcher(
        isAnyOf(
          loginUserThunk.pending,
          registerUserThunk.pending,
          updateUserProfileThunk.pending
        ),
        (state) => {
          state.loading = true
        }
      )
      .addMatcher(
        isAnyOf(
          loginUserThunk.fulfilled,
          registerUserThunk.fulfilled,
          updateUserProfileThunk.fulfilled
        ),
        (state, action) => {
          state.loading = false
          state.userInfo = action.payload
          state.success = true
        }
      )
      .addMatcher(
        isAnyOf(
          loginUserThunk.rejected,
          registerUserThunk.rejected,
          updateUserProfileThunk.rejected
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  },
})

export const { logoutUser } = userSlice.actions
export default userSlice.reducer
