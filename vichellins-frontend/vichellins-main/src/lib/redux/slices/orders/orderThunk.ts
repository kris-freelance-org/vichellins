import axios from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { DeliveryStatus, PaymentStatus } from "@/lib/utils";
import { axiosPrivate } from "@/lib/axios";

export const getAllOrders = createAppAsyncThunk(
  "order/getAllOrders ",
  async (
    {
      page,
      delivery_status,
      user_id,
    }: {
      page?: number;
      delivery_status?: string;
      user_id?: string;
    },
    thunkAPI
  ) => {
    try {
      let pathurl = "/orders";

      const params = new URLSearchParams();

      if (page) {
        params.append("page", page.toString());
      }

      if (delivery_status) {
        params.append("delivery_status", delivery_status);
      }
      if (user_id) {
        params.append("user_id", user_id);
      }

      const queryString = params.toString();

      if (queryString) {
        pathurl += `?${queryString}`;
      }

      const res = await axiosPrivate.get(pathurl);

      return {
        orders: res.data.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.per_page,
        nextPageUrl: res.data.nextPage,
        prevPageUrl: res.data.prevPage,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Categories");
    }
  }
);

export const getAllOrdersByUser = createAppAsyncThunk(
  "order/getAllOrdersByUser ",
  async (user_id: string, thunkAPI) => {
    try {
      const pathurl = `/orders?user_id=${user_id}`;

      const res = await axiosPrivate.get(pathurl);

      return {
        orders: res.data.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.per_page,
        nextPageUrl: res.data.nextPage,
        prevPageUrl: res.data.prevPage,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Order By User");
    }
  }
);

export const getAllOrdersByMe = createAppAsyncThunk(
  "order/getAllOrdersByMe",
  async (_, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(`/orders`);

      return {
        orders: res.data.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.limit,
        nextPageUrl: res.data.nextPageUrl,
        prevPageUrl: res.data.prevPageUrl,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Orders by me ");
    }
  }
);
export const getSingleOrder = createAppAsyncThunk(
  "order/getSingleOrder ",
  async (order_id: number, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(`/admin/orders/${order_id}`);
      const singleOrder = res.data;

      const userRes = await axiosPrivate.get(
        `/admin/users/${singleOrder.user_id}`
      );

      singleOrder.user = userRes.data.user;

      return singleOrder;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get Single Order");
    }
  }
);

export const createOrder = createAppAsyncThunk(
  "order/createOrder ",
  async (
    {
      cart_item_ids,
      user_id,
    }: {
      user_id: string;
      cart_item_ids: string[];
    },
    thunkAPI
  ) => {
    try {
      const res = await axiosPrivate.post(`/orders/`, {
        user_id,
        cart_item_ids,
      });

      return res.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Order By User");
    }
  }
);

export const updateOrderStatus = createAppAsyncThunk(
  "order/updateOrderStatus ",
  async (
    data: {
      order_id: number;
      delivery_status: DeliveryStatus;
      payment_status: PaymentStatus;
    },
    thunkAPI
  ) => {
    try {
      await axiosPrivate.put(`/admin/orders/${data?.order_id}`, data);
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Update Order details");
    }
  }
);

export const searchOrders = createAppAsyncThunk(
  "order/searchOrders ",
  async (search_term: string, thunkAPI) => {
    try {
      const res = await axios.get(`/orders/search/${search_term}`);

      return res.data.data.orders;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Search for Order");
    }
  }
);
