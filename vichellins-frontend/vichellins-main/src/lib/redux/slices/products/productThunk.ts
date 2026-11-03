import { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { IProduct } from "@/types/products";
import { productReview } from "@/kits/data/sharedData";
import { axiosPrivate } from "@/lib/axios";

export const getAllProductsAdmin = createAppAsyncThunk(
  "products/getAllProductsAdmin ",
  async (page: number | undefined, thunkAPI) => {
    try {
      const path = page ? `/admin/products?page=${page}` : "/admin/products";
      const res = await axiosPrivate.get(path);

      return {
        products: res.data.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.limit,
        nextPageUrl: res.data.nextPageUrl,
        prevPageUrl: res.data.prevPageUrl,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Products");
    }
  }
);

export const getAllProducts = createAppAsyncThunk(
  "products/getAllProductsCustomer ",
  async (page: number | undefined, thunkAPI) => {
    try {
      const path = page ? `/products?page=${page}` : "/products";
      const res = await axiosPrivate.get(path);

      return {
        products: res.data.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.limit,
        nextPageUrl: res.data.nextPageUrl,
        prevPageUrl: res.data.prevPageUrl,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Products");
    }
  }
);

export const getPopularProducts = createAppAsyncThunk(
  "products/getPopularProducts ",
  async (_, thunkAPI) => {
    try {
      const path = "/products";
      const res = await axiosPrivate.get(path);
      return {
        products: res.data.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.limit,
        nextPageUrl: res.data.nextPageUrl,
        prevPageUrl: res.data.prevPageUrl,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Products");
    }
  }
);
export const getSingleProduct = createAppAsyncThunk(
  "products/getSingleProduct ",
  async (product_id: string, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(`/products/${product_id}`);

      // let data: IProductReview | null = null;

      // if (res) {
      //   data = { ...res.data, reviews: [] };
      // }
      return res.data.product;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Products");
    }
  }
);
export const getProductReview = createAppAsyncThunk(
  "products/getProductReview ",
  async (product_id: string, thunkAPI) => {
    try {
      // const res = await axios.get(`/reviews/${product_id}`);

      // return res.data.data.reviews;

      return productReview;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Products");
    }
  }
);

export const getProductByCategory = createAppAsyncThunk(
  "products/getProductByCategory ",
  async (category_id: string, thunkAPI) => {
    try {
      const path = "/admin/products";
      const res = await axiosPrivate.get(path);

      const data =
        res.data.data.data.filter(
          (product: IProduct) => product.categoryId === category_id
        ) || null;

      return {
        products: data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.limit,
        nextPageUrl: res.data.nextPageUrl,
        prevPageUrl: res.data.prevPageUrl,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Products");
    }
  }
);

export const getProductByPriceAndCategory = createAppAsyncThunk(
  "products/getProductByPriceAndCategory",

  async (
    {
      category_id,
    }: {
      category_id: string;
      min?: number;
      max?: number;
    },
    thunkAPI
  ) => {
    try {
      const res = await axiosPrivate.get(
        `/products/search?categoryId=${category_id}`
      );

      return {
        products: res.data.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.limit,
        nextPageUrl: res.data.nextPageUrl,
        prevPageUrl: res.data.prevPageUrl,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Products");
    }
  }
);

export const searchProducts = createAppAsyncThunk(
  "products/searchProducts ",
  async (search_term: string, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(
        `/products/search?name=${search_term}`
      );

      return {
        products: res.data.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.limit,
        nextPageUrl: res.data.nextPageUrl,
        prevPageUrl: res.data.prevPageUrl,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Search for Products");
    }
  }
);

export const addProduct = createAppAsyncThunk(
  "product/addProduct",
  async (data: FormData, thunkAPI) => {
    try {
      const res = await axiosPrivate.post(
        `/admin/products`,

        data
      );
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Change Password");
    }
  }
);

export const updateProduct = createAppAsyncThunk(
  "product/updateProduct",
  async (
    {
      info,
      product_id,
    }: {
      info: FormData;
      product_id: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axiosPrivate.put(
        `/admin/products/${product_id}`,

        info
      );

      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not update product");
    }
  }
);
export const updateProductStock = createAppAsyncThunk(
  "product/updateProductStock",
  async (
    {
      stockUpdates,
    }: {
      stockUpdates: [
        {
          productId: string;
          newStock: number;
        }
      ];
    },
    thunkAPI
  ) => {
    try {
      const res = await axiosPrivate.post(
        `/admin/products/stock`,

        stockUpdates
      );

      return res.data.data.product;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Change Password");
    }
  }
);

export const deleteProduct = createAppAsyncThunk(
  "product/deleteProduct",
  async (product_id: string, thunkAPI) => {
    try {
      await axiosPrivate.delete(`/admin/products/${product_id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Delete Product ");
    }
  }
);
