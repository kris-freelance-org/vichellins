import axios, { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { IGuestPaymentVerification } from "@/types/payment";

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

interface IPaymentVerification {
  ref: string;
  address: string;
  sub_total: string;
  delivery_fee: string;
  total: string;
}

export const paymentVerification = createAppAsyncThunk(
  "checkout/paymentVerification ",
  async (data: IPaymentVerification, thunkAPI) => {
    try {
      await axiosInstance.post(
        `/processpay?ref=${data.ref}&address=${data.address}&sub_total=${data.sub_total}&delivery_fee=${data.delivery_fee}&total=${data.total}`
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Verify Payment");
    }
  }
);
export const guestPaymentVerification = createAppAsyncThunk(
  "checkout/guestPaymentVerification ",
  async (data: IGuestPaymentVerification, thunkAPI) => {
    data = {
      ...data,
      cart: data.cart.map((item) => ({ ...item, product_id: item.id })),
    };
    try {
      await axios.post(`/process-guest-pay`, data);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Verify Payment");
    }
  }
);
