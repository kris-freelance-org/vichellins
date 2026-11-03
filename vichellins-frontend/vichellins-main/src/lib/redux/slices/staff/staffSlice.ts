import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  createStaff,
  deleteStaff,
  getAllStaffs,
  getSingleStaff,
  searchStaffs,
} from "./staffThunk";
import { IStaff } from "@/types/staff";

interface FaqSliceState {
  [key: string]: unknown;
  staffList: IStaff[] | null;
  filteredStaffs: IStaff[] | null;
  selectedStaff: IStaff | null;
  isSearching: false;
  currentPage: number;
  isLoading: boolean;
  limit: number;
  numberOfPages: number;
  total: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

interface UpdateStatePayload {
  name: keyof FaqSliceState;
  value: unknown;
}

const initialState: FaqSliceState = {
  staffList: null,
  filteredStaffs: null,
  selectedStaff: null,
  isSearching: false,
  currentPage: 1,
  isLoading: false,
  limit: 10,
  numberOfPages: 0,
  total: 1,
  nextPageUrl: null,
  prevPageUrl: null,
};

const FaqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    updateStaffStateValues: (
      state,
      action: PayloadAction<UpdateStatePayload>
    ) => {
      state[action.payload.name] = action.payload.value;
    },
    selectStaffPage: (state, action) => {
      if (action.payload <= state.numberOfPages && action.payload >= 0) {
        state.currentPage = action.payload;
      }
    },
    moveNextStaffPage: (state) => {
      if (state.currentPage < state.numberOfPages) {
        state.currentPage += 1;
      }
    },
    movePrevStaffPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllStaffs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllStaffs.fulfilled, (state, action) => {
        state.staffList = action.payload.admins;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getAllStaffs.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getSingleStaff.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleStaff.fulfilled, (state, action) => {
        state.selectedStaff = action.payload;
        state.isLoading = false;
      })
      .addCase(getSingleStaff.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(createStaff.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStaff.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createStaff.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(searchStaffs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchStaffs.fulfilled, (state, action) => {
        state.filteredStaffs = action.payload;
        state.isLoading = false;
      })
      .addCase(searchStaffs.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(deleteStaff.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStaff.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteStaff.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  updateStaffStateValues,
  selectStaffPage,
  moveNextStaffPage,
  movePrevStaffPage,
} = FaqSlice.actions;

export default FaqSlice.reducer;
