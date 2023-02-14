import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

const initialState = {
  cartItems: cartItemsFromStorage,
}

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (req, { dispatch, getState }) => {
    const { data } = await axios.get(`/api/products/${req.productId}`)
    dispatch(
      addToCart({
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty: req.qty,
      })
    )
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  }
)

export const removeItemFromCart = (id) => (dispatch, getState) => {
  dispatch(removeFromCart(id))
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existItem = state.cartItems.find((x) => x.product === item.product)
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        )
      } else {
        state.cartItems.push(item)
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      )
    },
  },
})

export const { addToCart, removeFromCart } = cartSlice.actions

export default cartSlice.reducer
