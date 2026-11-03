import { createSlice } from "@reduxjs/toolkit";
import {
  getAnalytics,
  getPeriodsOrdersPerDay,
  getPeriodsTotalOrders,
} from "./analyticsThunk";

interface IPerDayAnalytics {
  date: string;
  count: number;
}

interface IAnalytics {
  totalUsers: number;
  totalOrders: number;
  totalCategories: number;
  totalProducts: number;
}

interface contentSliceState {
  isLoading: boolean;
  periodsTotalOrder: number | null;
  periodsOrdersPerDay: IPerDayAnalytics[] | null;
  analytics: IAnalytics | null;
}

// type UsercontentsKeys = keyof Usercontents;

const initialState: contentSliceState = {
  analytics: null,
  periodsTotalOrder: null,
  periodsOrdersPerDay: null,
  isLoading: false,
};

const contentSlice = createSlice({
  name: "contents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAnalytics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload.stats;
        state.periodsOrdersPerDay = action.payload.orderAnalytics;
        state.periodsTotalOrder = action.payload.orderAnalytics.length;
        state.isLoading = false;
      })
      .addCase(getAnalytics.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getPeriodsTotalOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPeriodsTotalOrders.fulfilled, (state, action) => {
        state.periodsTotalOrder = action.payload;
        state.isLoading = false;
      })
      .addCase(getPeriodsTotalOrders.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getPeriodsOrdersPerDay.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPeriodsOrdersPerDay.fulfilled, (state, action) => {
        state.periodsOrdersPerDay = action.payload;
        state.isLoading = false;
      })
      .addCase(getPeriodsOrdersPerDay.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// export const { setFilter } = contentSlice.actions;

export default contentSlice.reducer;
