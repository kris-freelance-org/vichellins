import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  updateUserProfileDetails,
  regiterAdmin,
  forgotPassswordHandler,
  resetPassword,
  changeUserPassword,
  register,
  updateAdminProfileDetails,
  getAdminProfile,
} from "./authThunk";
import { IUserDetials } from "@/types/users";
import { IStaff } from "@/types/staff";

interface profileSliceState {
  userProfile: IUserDetials | null;
  adminProfile: IStaff | null;
  redirectPath: string;
  isLoading: boolean;
  token: string | null;
  otp: string;
  showLoginModal: boolean;
  error: string;
}

// type UserProfileKeys = keyof UserProfile;

const userProfileRetrieved =
  typeof window !== "undefined" ? sessionStorage.getItem("user") : null;

const initialState: profileSliceState = {
  userProfile: userProfileRetrieved ? JSON.parse(userProfileRetrieved) : null,
  isLoading: false,
  redirectPath: "/",
  adminProfile: null,
  token:
    typeof window !== "undefined"
      ? sessionStorage.getItem("authToken") || ""
      : "",
  otp: "",
  showLoginModal: true,
  error: "",
};

const profileSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveOtp: (state, action) => {
      state.otp = action.payload;
    },
    updateRedirectPath: (state, action) => {
      state.redirectPath = action.payload;
    },
    setShowLoginModal: (state, action) => {
      state.showLoginModal = action.payload;
    },

    logout: (state) => {
      sessionStorage.removeItem("userProfile");
      sessionStorage.removeItem("authToken");
      state.userProfile = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })
      .addCase(forgotPassswordHandler.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassswordHandler.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassswordHandler.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(regiterAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(regiterAdmin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(regiterAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })

      .addCase(updateUserProfileDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfileDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload.user;
      })
      .addCase(updateUserProfileDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })

      .addCase(getAdminProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminProfile = action.payload;
      })
      .addCase(getAdminProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })

      .addCase(updateAdminProfileDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAdminProfileDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminProfile = action.payload;
      })
      .addCase(updateAdminProfileDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })

      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      });
  },
});

export const { saveOtp, updateRedirectPath, logout, setShowLoginModal } =
  profileSlice.actions;

export default profileSlice.reducer;
