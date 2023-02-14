import { configureStore } from '@reduxjs/toolkit'
import productListReducer from './features/product/productListSlice'
import productDetailsReducer from './features/product/productDetailsSlice'
import cartReducer from './features/cart/cartSlice'

const store = configureStore({
  reducer: {
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
  },
})

export default store
