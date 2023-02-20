import { configureStore } from '@reduxjs/toolkit'
import productListReducer from './features/product/productListSlice'
import productDetailsReducer from './features/product/productDetailsSlice'
import cartReducer from './features/cart/cartSlice'
import userReducer from './features/user/userSlice'
import orderReducer from './features/order/orderSlice'

const store = configureStore({
  reducer: {
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
  },
})

export default store
