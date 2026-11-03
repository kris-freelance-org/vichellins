import  { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { IProduct } from "@/types/products";
import { ICart } from "@/types/cart";
import { checkIfItemsInCart } from "@/kits/helpers/checkIfItemsInCart";
import { axiosPrivate } from "@/lib/axios";



export const getCartItems = createAppAsyncThunk(
  "cart/getCartItems ",
  async (_, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(`/carts`);

      return {
        cartItems: res.data.data,
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
      return thunkAPI.rejectWithValue("Could not get all Cart Items ");
    }
  }
);
export const addItemToCart = createAppAsyncThunk(
  "cart/addItemToCart ",
  async (
    {
      product_id,
      quantity,
      user_id,
    }: {
      product_id: string;
      quantity: number;
      user_id: string;
    },
    thunkAPI
  ) => {
    try {
      await axiosPrivate.post(`/carts`, {
        product_id,
        quantity,
        user_id,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Add Item to Cart Store");
    }
  }
);
export const getCartItemInLocalStorage = createAppAsyncThunk(
  "cart/getCartItemInLocalStorage ",
  async (_, thunkAPI) => {
    try {
      const localCartItemsString = localStorage.getItem("cartItems");

      const localCartItem = localCartItemsString
        ? JSON.parse(localCartItemsString)
        : [];

      return localCartItem;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Get All Cart from Store");
    }
  }
);
export const storeCartItemInLocalStorage = createAppAsyncThunk(
  "cart/storeCartItemInLocalStorage ",
  async (
    {
      product,
      quantity,
    }: {
      product: IProduct;
      quantity: number;
    },
    thunkAPI
  ) => {
    try {
      if (checkIfItemsInCart(thunkAPI.getState().cart.cartItems, product.id)) {
        return;
      }
      const localCartItemsString = localStorage.getItem("cartItems");

      let localCartItem = localCartItemsString
        ? JSON.parse(localCartItemsString)
        : [];

      localCartItem = [
        ...localCartItem,
        {
          id: product.id,
          unit_price: product.price,
          total: quantity * product.price,
          quantity: quantity,
          product: product,
        },
      ];
      localStorage.setItem("cartItems", JSON.stringify(localCartItem));
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Get All Categories");
    }
  }
);

export const updateItemQuantity = createAppAsyncThunk(
  "cart/updateItemQuantity ",
  async (
    {
      cart_id,
      quantity,
    }: {
      cart_id: string;
      quantity: number;
    },
    thunkAPI
  ) => {
    try {
      await axiosPrivate.put(`/carts/${cart_id}`, {
        quantity,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Update Cart Item Quantity");
    }
  }
);
export const updateItemQuantityInLocalStorage = createAppAsyncThunk(
  "cart/updateItemQuantityInLocalStorage ",
  async (
    {
      product_id,
      quantity,
    }: {
      product_id: string;
      quantity: number;
    },
    thunkAPI
  ) => {
    try {
      const localCartItemsString = localStorage.getItem("cartItems");
      const localCartItem = localCartItemsString
        ? (JSON.parse(localCartItemsString) as ICart[])
        : [];

      localCartItem.forEach((item: ICart) =>
        item.id === product_id ? (item.quantity = quantity) : item
      );
      localStorage.setItem("cartItems", JSON.stringify(localCartItem));
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Update Cart Item Quantity");
    }
  }
);
export const removeCartItemFromLocalStorage = createAppAsyncThunk(
  "cart/removeCartItemFromLocalStorage ",
  async (product_id: string, thunkAPI) => {
    try {
      const localCartItemsString = localStorage.getItem("cartItems");

      let localCartItem = localCartItemsString
        ? JSON.parse(localCartItemsString)
        : [];

      localCartItem = localCartItem.filter(
        (item: ICart) => item.id != product_id
      );
      localStorage.setItem("cartItems", JSON.stringify(localCartItem));
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Update Cart Item Quantity");
    }
  }
);
export const removeFromCart = createAppAsyncThunk(
  "cart/removeFromCart",
  async (product_id: string, thunkAPI) => {
    try {
      await axiosPrivate.delete(`/carts/${product_id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Update Cart Item Quantity");
    }
  }
);
export const emptyCart = createAppAsyncThunk(
  "cart/emptyCart ",
  async (_, thunkAPI) => {
    try {
      await axiosPrivate.delete(`/cart/empty`);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Update Cart Item Quantity");
    }
  }
);
export const emptyLocalCart = createAppAsyncThunk(
  "cart/emptyLocalCart ",
  async (_, thunkAPI) => {
    try {
      localStorage.removeItem("cartItems");
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Update Cart Item Quantity");
    }
  }
);

interface IMassLoadCart {
  product_id: string;
  quantity: number;
}

export const massLoadCartItems = createAppAsyncThunk(
  "cart/massLoadCartItems ",
  async (items: IMassLoadCart[], thunkAPI) => {
    console.log(items, "items");
    try {
      await axiosPrivate.post(`/cart/mass-load`, { items });
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Update Cart Item Quantity");
    }
  }
);
