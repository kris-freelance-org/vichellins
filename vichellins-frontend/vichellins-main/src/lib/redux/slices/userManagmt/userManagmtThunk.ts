import axios, { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { IUser } from "@/types/users";


const axiosInstance = axios.create();

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

export const getAllUsers = createAppAsyncThunk(
  "userManagmt/getAllUsers",
  async (_, thunkAPI) => {
    const { limit } = thunkAPI.getState().userMgmt;
    try {
      const res = await axiosInstance.get(`/user/all`);

      const users = res.data?.data?.user as IUser[];

      const numberOfPages = Math.ceil(users.length / limit);

      return { users: res.data.data.user, numberOfPages };
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Get All Groups");
    }
  }
);

export interface INewUserPayload {
  mda_name: string;
  name: string;
  email: string;
  phone_number: string;
  user_role_id: string;
}

export const getUserById = createAppAsyncThunk(
  "auth/getUserById",
  async (user_id: string, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/user/${user_id}`);

      return { user: res.data.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Create new User");
    }
  }
);
export const createUser = createAppAsyncThunk(
  "auth/createUser",
  async (data: INewUserPayload, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        `/user/create`,

        data
      );

      return { user: res.data.data };
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Create new User");
    }
  }
);

export const toggleUserStatus = createAppAsyncThunk(
  "userManagmt/toggleUserStatus",
  async (
    data: {
      status: boolean;
      user_id: string;
    },
    thunkAPI
  ) => {
    try {
      await axiosInstance.post(
        `/user/enable-disable`,

        data
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Toggle User Status");
    }
  }
);
