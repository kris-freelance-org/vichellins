import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  getAllUsers,
  toggleUserStatus,
} from "./userManagmtThunk";
import { IUser } from "@/types/users";

interface UserManagemntSliceState {
  [key: string]: unknown;
  selectedUser: IUser | null;
  allUsers: IUser[] | null;
  currentPage: number;
  isLoading: boolean;
  isSearching: boolean;
  searchList: IUser[] | null;
  limit: number;
  error?: string;
  numberOfPages: number;
}

interface UpdateStatePayload {
  name: keyof UserManagemntSliceState;
  value: unknown;
}

const initialState: UserManagemntSliceState = {
  selectedUser: null,
  selectedRole: null,
  allUsers: null,
  allMdas: null,
  allStaffs: null,
  allRoles: null,
  isSearching: false,
  searchList: null,
  currentPage: 1,
  isLoading: false,
  limit: 10,
  numberOfPages: 0,
};

const UserManagemntSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    updateStateValues: (state, action: PayloadAction<UpdateStatePayload>) => {
      state[action.payload.name] = action.payload.value;
    },
    selectPage: (state, action) => {
      if (action.payload <= state.numberOfPages && action.payload >= 0) {
        state.currentPage = action.payload;
      }
    },
    moveNextPage: (state) => {
      if (state.currentPage < state.numberOfPages) {
        state.currentPage += 1;
      }
    },
    movePrevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder

      
      .addCase(toggleUserStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleUserStatus.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(toggleUserStatus.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload.users;
        state.numberOfPages = action.payload.numberOfPages;
        state.isLoading = false;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setSelectedUser,
  setSelectedRole,
  updateStateValues,
  selectPage,
  moveNextPage,
  movePrevPage,
} = UserManagemntSlice.actions;

export default UserManagemntSlice.reducer;
