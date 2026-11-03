import { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { axiosPrivate } from "@/lib/axios";

export const getAllStaffs = createAppAsyncThunk(
  "staff/getAllStaffs",
  async (page: number | undefined, thunkAPI) => {
    try {
      const path = page ? `/admin/admins?page=${page}` : "/admin/admins";
      const res = await axiosPrivate.get(path);

      const adminRes = res.data.admins;
      return {
        admins: adminRes.rows,
        currentPage: 1,
        total: adminRes.count,
        numberOfPages: 1,
        limit: 10,
        nextPageUrl: null,
        prevPageUrl: null,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Get All Staffs");
    }
  }
);

export const getSingleStaff = createAppAsyncThunk(
  "staff/getSingleStaff ",
  async (staff_id: string, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(`/admin/admins/${staff_id}`);
      return res.data.admin;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Retrieve single Staff");
    }
  }
);

export const createStaff = createAppAsyncThunk(
  "staff/createStaff ",
  async (
    createData: {
      name: string;
      email: string;
      password: string;
      phone: string;
      role: string;
    },
    thunkAPI
  ) => {
    try {
      await axiosPrivate.post(`/admin/register`, createData);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Create Staff");
    }
  }
);

export const updateStaff = createAppAsyncThunk(
  "staff/updateStaff ",
  async (
    updateData: {
      title: string;
      email: string;
    },
    thunkAPI
  ) => {
    try {
      await axiosPrivate.post(`/staff/update`, updateData);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Update Staff");
    }
  }
);

export const searchStaffs = createAppAsyncThunk(
  "staff/searchStaffs ",
  async (search_term: string, thunkAPI) => {
    try {
      const res = await axiosPrivate.get(`/user/admin/search/${search_term}`);

      return res.data.data.admins;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Search for Admins");
    }
  }
);


export const deleteStaff = createAppAsyncThunk(
  "catgeories/deleteStaff",
  async (staff_id: number, thunkAPI) => {
    try {
      await axiosPrivate.delete(`/admin/admins/${staff_id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Delete Category");
    }
  }
);