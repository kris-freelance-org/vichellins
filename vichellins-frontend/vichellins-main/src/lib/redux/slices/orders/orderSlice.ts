import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  getAllOrders,
  getAllOrdersByMe,
  getAllOrdersByUser,
  getSingleOrder,
  searchOrders,
  updateOrderStatus,
} from "./orderThunk";
import { IOrder, ISelectedOrder } from "@/types/order";
import Fuse from "fuse.js";

interface CartSliceState {
  [key: string]: unknown;
  allOrders: IOrder[] | null;
  filteredOrders: IOrder[] | null;
  selectedOrder: ISelectedOrder | null;
  isSearching: false;
  orderTotal: number;
  currentPage: number;
  isLoading: boolean;
  limit: number;
  numberOfPages: number;
  total: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

interface UpdateStatePayload {
  name: keyof CartSliceState;
  value: unknown;
}

const options = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.2,
  keys: ["id", "user.name", "user.email"],
};

const initialState: CartSliceState = {
  allOrders: null,
  filteredOrders: null,
  selectedOrder: null,
  isSearching: false,
  currentPage: 1,
  isLoading: false,
  orderTotal: 0,
  limit: 10,
  numberOfPages: 1,
  total: 1,
  nextPageUrl: null,
  prevPageUrl: null,
};

const CartSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    updateStateValues: (state, action: PayloadAction<UpdateStatePayload>) => {
      state[action.payload.name] = action.payload.value;
    },
    handleSearchOrders: (state, action) => {
      if (state.allOrders) {
        const fuse = new Fuse(state.allOrders, options);
        const value = action.payload;

        if (value.length === 0) {
          state.filteredOrders = state.allOrders;
          return;
        }

        const results = fuse.search(value);
        const items = results.map((result) => result.item);

        state.filteredOrders = items;
      }
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
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload.orders;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getAllOrders.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getAllOrdersByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUser.fulfilled, (state, action) => {
        state.allOrders = action.payload.orders;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getAllOrdersByUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllOrdersByMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByMe.fulfilled, (state, action) => {
        state.allOrders = action.payload.orders;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getAllOrdersByMe.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getSingleOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        state.isLoading = false;
      })
      .addCase(getSingleOrder.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(searchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchOrders.fulfilled, (state, action) => {
        state.filteredOrders = action.payload;
        state.isLoading = false;
      })
      .addCase(searchOrders.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setSelectedUser,
  updateStateValues,
  handleSearchOrders,
  selectPage,
  moveNextPage,
  movePrevPage,
} = CartSlice.actions;

export default CartSlice.reducer;
