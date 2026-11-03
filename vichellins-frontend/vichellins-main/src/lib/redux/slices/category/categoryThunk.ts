import axios, { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { axiosPrivate } from "@/lib/axios";

export const getAllCategories = createAppAsyncThunk(
  "catgeories/getAllCategories ",
  async (page: number | undefined, thunkAPI) => {
    try {
      const path = page
        ? `/admin/categories?page=${page}`
        : "/admin/categories";
      const res = await axiosPrivate.get(path);

      return {
        categories: res.data?.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.limit,
        nextPageUrl: res.data.nextPageUrl,
        prevPageUrl: res.data.prevPageUrl,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Categories");
    }
  }
);
export const getAllCategoriesByCustomer = createAppAsyncThunk(
  "catgeories/getAllCategoriesByCustomer ",
  async (name: string | undefined, thunkAPI) => {
    try {
      let path = `/products/categories/search`;
      if (name) {
        path += `?name=${name}`;
      }
      const res = await axiosPrivate.get(path);

      return {
        categories: res.data?.data,
        currentPage: res.data.currentPage,
        total: res.data.totalItems,
        numberOfPages: res.data.totalPages,
        limit: res.data.limit,
        nextPageUrl: res.data.nextPageUrl,
        prevPageUrl: res.data.prevPageUrl,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Could not Get All Categories");
    }
  }
);

export const getSingleCategory = createAppAsyncThunk(
  "catgeories/getSingleCategory ",
  async (category_id: string, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(`/admin/categories/${category_id}`);

      return res.data.category;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Get All Categories");
    }
  }
);
export const createCategory = createAppAsyncThunk(
  "catgeories/createCategory ",
  async (formData: FormData, thunkAPI) => {
    try {
      const res = await axiosPrivate.post(`/admin/categories`, formData);

      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Create Categories");
    }
  }
);
export const updateCategory = createAppAsyncThunk(
  "catgeories/updateCategory ",
  async (
    data: {
      formData: FormData;
      category_id: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axiosPrivate.put(
        `/admin/categories/${data.category_id}`,
        data.formData
      );

      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Update Categories");
    }
  }
);

export const updateCategoryImage = createAppAsyncThunk(
  "catgeories/updateCategoryImage",
  async (data: FormData, thunkAPI) => {
    try {
      await axiosPrivate.post(
        `/categories/upload-image`,

        data
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Update Category Image");
    }
  }
);
export const deleteCategory = createAppAsyncThunk(
  "catgeories/deleteCategory",
  async (category_id: string, thunkAPI) => {
    try {
      await axiosPrivate.delete(`/admin/categories/${category_id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Delete Category");
    }
  }
);

export const searchCategories = createAppAsyncThunk(
  "catgeories/searchCategories ",
  async (search_term: string, thunkAPI) => {
    try {
      const res = await axios.get(`/categories/search/${search_term}`);

      return res.data.data.categories;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Search for FAQ");
    }
  }
);
