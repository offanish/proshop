import axios from 'axios'
import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'
import { resetOrders } from '../order/orderSlice'

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const initialState = {
  users: [],
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
// admin thunk
export const listUsersThunk = createAsyncThunk(
  'user/listUsers',
  async (req, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.get('/api/users/', config)
      return data
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)
//admin thunk
export const deleteUserThunk = createAsyncThunk(
  'user/deleteUser',
  async (id, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.delete(`/api/users/${id}`, config)
      thunkAPI.dispatch(listUsersThunk())
      return
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)
//admin thunk
export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  async (user, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().user.userInfo
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.put(`/api/users/${user._id}`, user, config)
      thunkAPI.dispatch(getUserDetailsThunk(user._id))
      return data
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export const logoutUserThunk = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch(logoutUser())
  dispatch(resetOrders())
  dispatch(resetUsers())
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser(state) {
      state.userInfo = null
      state.userDetails = null
      state.success = false
    },
    resetUsers(state) {
      state.users = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          loginUserThunk.pending,
          registerUserThunk.pending,
          updateUserProfileThunk.pending,
          getUserDetailsThunk.pending,
          listUsersThunk.pending,
          deleteUserThunk.pending,
          updateUserThunk.pending
        ),
        (state) => {
          state.loading = true
        }
      )
      .addMatcher(
        isAnyOf(
          loginUserThunk.fulfilled,
          registerUserThunk.fulfilled,
          updateUserProfileThunk.fulfilled,
          getUserDetailsThunk.fulfilled,
          listUsersThunk.fulfilled,
          deleteUserThunk.fulfilled,
          updateUserThunk.fulfilled
        ),
        (state, action) => {
          state.loading = false
          if (action.type === 'user/listUsers/fulfilled') {
            state.users = action.payload
          } else if (action.type === 'user/getUserDetails/fulfilled') {
            state.userDetails = action.payload
          } else if (action.type === 'user/deleteUser/fulfilled') {
            state.success = true
          } else if (action.type === 'user/updateUser/fulfilled') {
            state.success = true
          } else {
            state.userInfo = action.payload
            state.success = true
          }
        }
      )
      .addMatcher(
        isAnyOf(
          loginUserThunk.rejected,
          registerUserThunk.rejected,
          updateUserProfileThunk.rejected,
          getUserDetailsThunk.rejected,
          listUsersThunk.rejected,
          deleteUserThunk.rejected,
          updateUserThunk.rejected
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  },
})

export const { logoutUser, resetUsers } = userSlice.actions
export default userSlice.reducer
