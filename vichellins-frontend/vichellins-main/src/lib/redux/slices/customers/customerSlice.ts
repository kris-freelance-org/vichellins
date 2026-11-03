import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  getAllCustomers,
  getSingleCustomers,
  searchCustomers,
} from "./customerThunk";
import { ICustomer } from "@/types/customers";
import Fuse from "fuse.js";

interface CustomerSliceState {
  [key: string]: unknown;
  customers: ICustomer[] | null;
  filteredCustomers: ICustomer[] | null;
  selectedCustomer: ICustomer | null;
  isSearching: false;
  currentPage: number;
  isLoading: boolean;
  limit: number;
  numberOfPages: number;
  total: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

interface UpdateStatePayload {
  name: keyof CustomerSliceState;
  value: unknown;
}

const options = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.2,
  keys: ["id", "name", "email"],
};

const initialState: CustomerSliceState = {
  customers: null,
  filteredCustomers: null,
  selectedCustomer: null,
  isSearching: false,
  currentPage: 1,
  isLoading: false,
  limit: 10,
  numberOfPages: 0,
  total: 1,
  nextPageUrl: null,
  prevPageUrl: null,
};

const CustomerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },

    updateCustomerStateValues: (
      state,
      action: PayloadAction<UpdateStatePayload>
    ) => {
      state[action.payload.name] = action.payload.value;
    },
    handleSearchCustomers: (state, action) => {
      if (state.customers) {
        const fuse = new Fuse(state.customers, options);
        const value = action.payload;

        if (value.length === 0) {
          state.filteredCustomers = state.customers;
          return;
        }

        const results = fuse.search(value);
        const items = results.map((result) => result.item);

        state.filteredCustomers = items;
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
      .addCase(getAllCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.customers = action.payload.customers;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getAllCustomers.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getSingleCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleCustomers.fulfilled, (state, action) => {
        state.selectedCustomer = action.payload;
        state.isLoading = false;
      })
      .addCase(getSingleCustomers.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(searchCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.filteredCustomers = action.payload;
        state.isLoading = false;
      })
      .addCase(searchCustomers.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setSelectedCustomer,
  updateCustomerStateValues,
  handleSearchCustomers,
  selectPage,
  moveNextPage,
  movePrevPage,
} = CustomerSlice.actions;

export default CustomerSlice.reducer;
