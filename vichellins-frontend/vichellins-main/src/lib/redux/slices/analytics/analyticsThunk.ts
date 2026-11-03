import { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { axiosPrivate } from "@/lib/axios";

export const getAnalytics = createAppAsyncThunk(
  "analytics/getAnalytics",
  async (_, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(`/admin/dashboard`);

      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not get  Analytics");
    }
  }
);

export const getPeriodsTotalOrders = createAppAsyncThunk(
  "analytics/getPeriodsTotalOrders",
  async (
    data: {
      start_date: string;
      end_date: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axiosPrivate.post(`/analytics/total-orders`, data);

      return res.data.data.total_orders;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue(
        "Could not get  Total Transaction for Duration"
      );
    }
  }
);

export const getPeriodsOrdersPerDay = createAppAsyncThunk(
  "analytics/getPeriodsOrdersPerDay",
  async (
    data: {
      start_date: string;
      end_date: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axiosPrivate.post(`/analytics/orders-per-day`, data);

      return res.data.data.ordersPerDay;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue(
        "Could not get  Total Transaction for Duration"
      );
    }
  }
);
