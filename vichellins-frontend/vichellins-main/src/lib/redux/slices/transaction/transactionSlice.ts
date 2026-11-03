import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getAllTransactions, searchTransaction } from "./transactionThunk";
import { ITransaction } from "@/types/transaction";
import Fuse from "fuse.js";

interface TransactionSliceState {
  [key: string]: unknown;
  allTransactions: ITransaction[] | null;
  filteredTransactions: ITransaction[] | null;
  isSearching: false;
  searchList: null;
  cartTotal: number;
  currentPage: number;
  isLoading: boolean;
  limit: number;
  numberOfPages: number;
  total: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

interface UpdateStatePayload {
  name: keyof TransactionSliceState;
  value: unknown;
}

const options = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.2,
  keys: ["id", "reference_code"],
};

const initialState: TransactionSliceState = {
  allTransactions: null,
  filteredTransactions: null,
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

const TransactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    updateTransactionStateValues: (
      state,
      action: PayloadAction<UpdateStatePayload>
    ) => {
      state[action.payload.name] = action.payload.value;
    },
    handleSearchTransactions: (state, action) => {
      if (state.allTransactions) {
        const fuse = new Fuse(state.allTransactions, options);
        const value = action.payload;

        if (value.length === 0) {
          state.filteredTransactions = state.allTransactions;
          return;
        }

        const results = fuse.search(value);
        const items = results.map((result) => result.item);

        state.filteredTransactions = items;
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
      .addCase(getAllTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTransactions.fulfilled, (state, action) => {
        state.allTransactions = action.payload.transactions;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getAllTransactions.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(searchTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchTransaction.fulfilled, (state, action) => {
        state.filteredTransactions = action.payload;
        state.isLoading = false;
      })
      .addCase(searchTransaction.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setSelectedUser,
  updateTransactionStateValues,
  handleSearchTransactions,
  selectPage,
  moveNextPage,
  movePrevPage,
} = TransactionSlice.actions;

export default TransactionSlice.reducer;
