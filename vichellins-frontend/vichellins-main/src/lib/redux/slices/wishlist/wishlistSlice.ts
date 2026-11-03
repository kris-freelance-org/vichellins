import { createSlice } from "@reduxjs/toolkit";
import {
  addWishList,
  deleteFromWishList,
  getUserWishList,
} from "./wishlistThunk";
import { IWishList } from "@/types/wishlist";

interface WisglistSliceState {
  [key: string]: unknown;
  wishlist: IWishList[] | null;
  isSearching: false;

  searchList: null;
  isLoading: boolean;
  currentPage: number;
  limit: number;
  numberOfPages: number;
  total: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

const initialState: WisglistSliceState = {
  wishlist: null,
  isSearching: false,
  searchList: null,
  currentPage: 1,
  isLoading: false,
  limit: 10,
  numberOfPages: 1,
  total: 1,
  nextPageUrl: null,
  prevPageUrl: null,
};

const WisglistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
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
      .addCase(getUserWishList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserWishList.fulfilled, (state, action) => {
        state.wishlist = action.payload.wishlist;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getUserWishList.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(addWishList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addWishList.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addWishList.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(deleteFromWishList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFromWishList.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteFromWishList.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { selectPage, moveNextPage, movePrevPage } = WisglistSlice.actions;

export default WisglistSlice.reducer;
