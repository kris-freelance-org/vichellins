import { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { axiosPrivate } from "@/lib/axios";

export const getAllCustomers = createAppAsyncThunk(
  "customer/getAllCustomers",
  async (page: number | undefined, thunkAPI) => {
    const path = page ? `/admin/users?page=${page}` : "/admin/users";

    try {
      const res = await axiosPrivate.get(path);

      return {
        customers: res.data.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: 10,
        nextPageUrl: res.data.hasNext,
        prevPageUrl: res.data.prevPage,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Get All Customers");
    }
  }
);

export const getSingleCustomers = createAppAsyncThunk(
  "customer/getSingleCustomers",
  async (user_id: string, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(`/admin/users/${user_id}`);

      return res.data.user;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Get Single Customer");
    }
  }
);

export const searchCustomers = createAppAsyncThunk(
  "customer/searchCustomers ",
  async (search_term: string, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(
        `/user/customer/search/${search_term}`
      );

      return res.data.data.customers;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Search for Customer");
    }
  }
);
