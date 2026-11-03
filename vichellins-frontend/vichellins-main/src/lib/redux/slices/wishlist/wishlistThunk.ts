import { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { axiosPrivate } from "@/lib/axios";

export const getUserWishList = createAppAsyncThunk(
  "wishlist/getUserWishList ",
  async (_, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(`/wishlists`);

      return {
        wishlist: res.data.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.limit,
        nextPageUrl: res.data.nextPageUrl,
        prevPageUrl: res.data.prevPageUrl,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Get All Categories");
    }
  }
);

export const addWishList = createAppAsyncThunk(
  "wishlist/addWishList ",
  async (product_id: number, thunkAPI) => {
    try {
      await axiosPrivate.post(`/wishlists`, {
        product_id,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not add to wishlist");
    }
  }
);

export const deleteFromWishList = createAppAsyncThunk(
  "wishlist/deleteFromWishList ",
  async (product_id: number, thunkAPI) => {
    try {
      await axiosPrivate.delete(`/wishlists/${product_id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not remove from wishlist");
    }
  }
);
