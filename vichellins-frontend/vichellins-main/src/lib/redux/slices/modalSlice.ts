
import { createSlice } from "@reduxjs/toolkit";

interface ModalSliceState {
  isOpen: boolean;
  dialogInfo: [] | null;
  showFilterDialog: boolean;
  showSidebar: boolean;
}

const initialState: ModalSliceState = {
  isOpen: false,
  dialogInfo: null,
  showFilterDialog: false,
  showSidebar: true,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      if (action.payload) {
        state.dialogInfo = action.payload;
      }
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.showFilterDialog = false;
    },
    setShowFilter: (state) => {
      state.showFilterDialog = true;
    },
    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
  },
});

export const { openModal, closeModal, setShowFilter, setShowSidebar } = modalSlice.actions;

export default modalSlice.reducer;
