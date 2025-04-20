import { configureStore } from "@reduxjs/toolkit";
// import AuthSlice from "./auth/authSlice";
import productSlice from "./product/productSlice";
import authorizedSlice from "./authorized/authorizedSlice";
import orderSlice from "./order/orderSlice";

const Store = configureStore({
  reducer: {
    product: productSlice,
    auth: authorizedSlice,
    order: orderSlice,
  },
});

export default Store;
