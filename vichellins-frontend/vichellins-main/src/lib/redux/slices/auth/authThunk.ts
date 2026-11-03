import axios, { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { IUserPassword } from "@/types/users";
import { axiosPrivate } from "@/lib/axios";
import { IAddStaff } from "@/types/staff";

interface ILogin {
	email: string;
	password: string;
}

interface IRegisterAdmin {
	name: string;
	email: string;
	role: string;
}

interface IRegister {
	name: string;
	phone: string;
	email: string;
	password: string;
}

export const regiterAdmin = createAppAsyncThunk(
	"auth/regiterAdmin",
	async (data: IRegisterAdmin, thunkAPI) => {
		try {
			const res = await axiosPrivate.post(
				`/user/register-admin`,

				data
			);

			return { user: res.data.data };
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error.response?.data?.message);
			}
			return thunkAPI.rejectWithValue("Could not Get All Groups");
		}
	}
);
export const login = createAppAsyncThunk(
	"auth/login",
	async (postPayload: ILogin, thunkAPI) => {
		try {
			const res = await axios.post(
				`/auth/signin`,

				postPayload
			);
			const userData = res.data?.data;

			return { user: userData, token: res.data.token };
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error.response?.data?.message);
			}
			return thunkAPI.rejectWithValue("Could not Login User");
		}
	}
);
export const register = createAppAsyncThunk(
	"auth/register",
	async (postPayload: IRegister, thunkAPI) => {
		try {
			await axiosPrivate.post(
				`/users/register`,

				postPayload
			);
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error.response?.data?.message);
			}
			return thunkAPI.rejectWithValue("Could not Login User");
		}
	}
);

export const forgotPassswordHandler = createAppAsyncThunk(
	"forgotPasssword",
	async (email: string, thunkAPI) => {
		try {
			const res = await axios.post(
				`/forgot-password`,

				{ email }
			);

			return { user: res.data.data };
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error.response?.data?.message);
			}
			return thunkAPI.rejectWithValue("Could Request Password Reset");
		}
	}
);

export interface IResetPassword {
	otp: string;
	password: string;
	password_confirmation: string;
}

export const resetPassword = createAppAsyncThunk(
	"resetPassword",
	async (data: IResetPassword, thunkAPI) => {
		try {
			const res = await axios.post(
				`/reset-password`,

				data
			);

			return { user: res.data.data };
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error.response?.data?.message);
			}
			return thunkAPI.rejectWithValue("Could not Reset password");
		}
	}
);

export const updateUserProfileDetails = createAppAsyncThunk(
	"auth/updateUserProfileDetails",
	async (
		data: {
			name: string;
			email: string;
			phone: string;
			street: string;
			city: string;
			state: string;
		},
		thunkAPI
	) => {
		try {
			const res = await axiosPrivate.put(`/users/profile`, data);

			return { user: res.data };
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error.response?.data?.message);
			}
			return thunkAPI.rejectWithValue("Could not Update your profile");
		}
	}
);

export const getAdminProfile = createAppAsyncThunk(
	"auth/getAdminProfile",
	async (_, thunkAPI) => {
		try {
			const res = await axiosPrivate.get(`/admin/profile`);
			console.log(res.data, " res.data");
			return res.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error.response?.data?.message);
			}
			return thunkAPI.rejectWithValue("Could not get your profile");
		}
	}
);
export const updateAdminProfileDetails = createAppAsyncThunk(
	"auth/updateAdminProfileDetails",
	async (data: IAddStaff, thunkAPI) => {
		try {
			const res = await axiosPrivate.put(`/admin/profile`, data);

			return res.data.admin;
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error.response?.data?.message);
			}
			return thunkAPI.rejectWithValue("Could not Update your profile");
		}
	}
);

export const changeUserPassword = createAppAsyncThunk(
	"auth/changeUserPassword",
	async (data: IUserPassword, thunkAPI) => {
		try {
			const res = await axiosPrivate.put(`/users/profile`, {
				password: data.password,
			});

			return { user: res.data };
		} catch (error) {
			if (error instanceof AxiosError) {
				return thunkAPI.rejectWithValue(error.response?.data?.message);
			}
			return thunkAPI.rejectWithValue("Could not Update your profile");
		}
	}
);
