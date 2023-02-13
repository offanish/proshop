import { configureStore } from '@reduxjs/toolkit'
import productListReducer from './features/product/productListSlice'
import productDetailsReducer from './features/product/productDetailsSlice'

const store = configureStore({
  reducer: {
    productList: productListReducer,
    productDetails: productDetailsReducer,
  },
})

export default store
