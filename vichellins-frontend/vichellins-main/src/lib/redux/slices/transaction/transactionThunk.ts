import axios, { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";

// Add a request interceptor
const axiosInstance = axios.create({
  baseURL: "https://api.voranaija.com/api",
});
axiosInstance.interceptors.request.use(
  function (config) {
    const authToken = sessionStorage.getItem("authToken");

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export const getAllTransactions = createAppAsyncThunk(
  "transactions/getAllTransactions ",
  async (page: number | undefined, thunkAPI) => {
    try {
      const path = page ? `/transactions?page=${page}` : "/transactions";
      const res = await axiosInstance.get(path);

      return {
        transactions: res.data.data.transactions,
        currentPage: res.data.data.current_page,
        total: res.data.data.total,
        numberOfPages: res.data.data.last_page,
        limit: res.data.data.per_page,
        nextPageUrl: res.data.data.next_page_url,
        prevPageUrl: res.data.data.prev_page_url,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Get All Transactions");
    }
  }
);

export const searchTransaction = createAppAsyncThunk(
  "transaction/searchTransaction ",
  async (search_term: string, thunkAPI) => {
    try {
      const res = await axios.get(`/transactions/search/${search_term}`);

      return res.data.data.transactions;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Search for Transaction");
    }
  }
);
