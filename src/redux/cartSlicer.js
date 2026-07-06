import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosconfig";

// Helper to load cached state instantly on page refresh
const loadLocalCart = () => {
    try {
        const saved = localStorage.getItem("cartItems");
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const initialItems = loadLocalCart();

// ASYNC THUNK: Sync the state with MongoDB in the background
export const syncCartToMongoDB = createAsyncThunk(
    "cart/syncCartToMongoDB",
    async (cartItems, { rejectWithValue }) => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
            return rejectWithValue("User not logged in");
        }
        try {
            const response = await axios.patch(
                "/users/cart",
                { cartItems }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to sync cart");
        }
    }
);

// ASYNC THUNK: Fetch saved cart from MongoDB on application/page reload
export const fetchCartFromMongoDB = createAsyncThunk(
    "cart/fetchCartFromMongoDB",
    async (_, { rejectWithValue }) => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
            return [];
        }
        try {
            const response = await axios.get(
                "/users/cart"
            );
            return response.data.cart || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch cart");
        }
    }
);

const cartSlicer = createSlice({
    name: "cart",
    initialState: {
        cartItems: initialItems,
        totalQuantity: initialItems.reduce((acc, item) => acc + (item.quantity || 1), 0),
        totalAmount: initialItems.reduce((acc, item) => acc + ((item.discountPrice || item.price) * (item.quantity || 1)), 0),
        status: "idle",
        error: null,
    },
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existing = state.cartItems.find((p) => p._id === item._id);
            const priceToAdd = item.discountPrice || item.price;

            if (existing) {
                existing.quantity += 1;
                existing.totalPrice += priceToAdd;
            } else {
                state.cartItems.push({
                    ...item,
                    quantity: 1,
                    totalPrice: priceToAdd,
                });
            }
            state.totalQuantity++;
            state.totalAmount += priceToAdd;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        removeFromCart: (state, action) => {
            const id = action.payload;
            const existing = state.cartItems.find((p) => p._id === id);

            if (existing) {
                state.totalQuantity -= existing.quantity;
                state.totalAmount -= existing.totalPrice;
                state.cartItems = state.cartItems.filter((p) => p._id !== id);
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        increaseQuantity: (state, action) => {
            const id = action.payload;
            const existing = state.cartItems.find((p) => p._id === id);

            if (existing) {
                const itemPrice = existing.discountPrice || existing.price;
                existing.quantity++;
                existing.totalPrice += itemPrice;
                state.totalQuantity++;
                state.totalAmount += itemPrice;
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        decreaseQuantity: (state, action) => {
            const id = action.payload;
            const existing = state.cartItems.find((p) => p._id === id);

            if (existing) {
                const itemPrice = existing.discountPrice || existing.price;

                if (existing.quantity > 1) {
                    existing.quantity--;
                    existing.totalPrice -= itemPrice;
                    state.totalQuantity--;
                    state.totalAmount -= itemPrice;
                } else {
                    state.totalQuantity--;
                    state.totalAmount -= itemPrice;
                    state.cartItems = state.cartItems.filter((item) => item._id !== id);
                }
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        clearCart: (state) => {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            localStorage.removeItem("cartItems");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartFromMongoDB.fulfilled, (state, action) => {
                const items = action.payload;
                state.cartItems = items;
                state.totalQuantity = items.reduce((total, item) => total + (item.quantity || 1), 0);
                state.totalAmount = items.reduce((total, item) => {
                    const price = item.discountPrice || item.price || 0;
                    return total + (price * (item.quantity || 1));
                }, 0);
                localStorage.setItem("cartItems", JSON.stringify(items));
                state.status = "succeeded";
            })
            .addCase(fetchCartFromMongoDB.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} = cartSlicer.actions;

export default cartSlicer.reducer;

// --- MIDDLEWARE FOR AUTO-SYNCING TO MONGO ---
export const cartSyncMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    // Check if the action belongs to our cart slice and isn't an async thunk action itself
    if (action.type.startsWith("cart/") && !action.type.includes("syncCartToMongoDB")) {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (isLoggedIn) {
            const fallbackCart = store.getState().cart.cartItems;
            // Run background database synchronization
            store.dispatch(syncCartToMongoDB(fallbackCart));
        }
    }

    return result;
};