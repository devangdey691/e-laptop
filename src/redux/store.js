import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { cartSyncMiddleware } from "./cartSlicer"; // adjust path

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cartSyncMiddleware),
});