import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  addItemToCart,
  emptyCart,
  emptyLocalCart,
  getCartItemInLocalStorage,
  getCartItems,
  removeFromCart,
  storeCartItemInLocalStorage,
  updateItemQuantity,
} from "./cartThunk";
import { ICart } from "@/types/cart";

interface CartSliceState {
  [key: string]: unknown;
  cartItems: ICart[] | null;
  isSearching: false;
  searchList: null;
  cartTotal: number;
  currentPage: number;
  isLoading: boolean;
  limit: number;
  numberOfPages: number;
}

interface UpdateStatePayload {
  name: keyof CartSliceState;
  value: unknown;
}

const cartItemsRetrieved =
  typeof window !== "undefined" ? localStorage.getItem("cartItems") : null;

const initialState: CartSliceState = {
  cartItems: cartItemsRetrieved ? JSON.parse(cartItemsRetrieved) : null,
  isSearching: false,
  searchList: null,
  currentPage: 1,
  isLoading: false,
  cartTotal: 0,
  limit: 10,
  numberOfPages: 0,
  total: 1,
  nextPageUrl: null,
  prevPageUrl: null,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    updateCartStateValues: (
      state,
      action: PayloadAction<UpdateStatePayload>
    ) => {
      state[action.payload.name] = action.payload.value;
    },

    sumCartTotal: (state) => {
      state.cartTotal =
        state.cartItems?.reduce((acc, item) => {
          return (acc += item.product.price * item.quantity);
        }, 0) ?? 0;
    },
    selectPage: (state, action) => {
      if (action.payload <= state.numberOfPages && action.payload >= 0) {
        state.currentPage = action.payload;
      }
    },
    moveNextPage: (state) => {
      if (state.currentPage < state.numberOfPages) {
        state.currentPage += 1;
      }
    },
    movePrevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getCartItemInLocalStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItemInLocalStorage.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.isLoading = false;
      })
      .addCase(getCartItemInLocalStorage.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(addItemToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addItemToCart.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(storeCartItemInLocalStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(storeCartItemInLocalStorage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(storeCartItemInLocalStorage.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(updateItemQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateItemQuantity.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateItemQuantity.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(removeFromCart.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(emptyCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(emptyCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(emptyCart.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(emptyLocalCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(emptyLocalCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(emptyLocalCart.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setSelectedUser,
  sumCartTotal,
  updateCartStateValues,
  selectPage,
  moveNextPage,
  movePrevPage,
} = CartSlice.actions;

export default CartSlice.reducer;
