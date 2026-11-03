import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getAllCategoriesByCustomer,
  getSingleCategory,
  searchCategories,
  updateCategory,
} from "./categoryThunk";
import { ICategory } from "@/types/categories";

interface CategorySliceState {
  [key: string]: unknown;
  allCategories: ICategory[] | null;
  filteredCategories: ICategory[] | null;
  selectedCategory: ICategory | null;
  isSearching: false;
  searchList: null;
  currentPage: number;
  isLoading: boolean;
  limit: number;
  numberOfPages: number;
}

interface UpdateStatePayload {
  name: keyof CategorySliceState;
  value: unknown;
}

const initialState: CategorySliceState = {
  allCategories: null,
  filteredCategories: null,
  selectedCategory: null,
  isSearching: false,
  searchList: null,
  currentPage: 1,
  isLoading: false,
  limit: 10,
  numberOfPages: 0,
};

const CategorySlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    updateCategoryStateValues: (
      state,
      action: PayloadAction<UpdateStatePayload>
    ) => {
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
      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.allCategories = action.payload.categories;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getAllCategories.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllCategoriesByCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCategoriesByCustomer.fulfilled, (state, action) => {
        state.allCategories = action.payload.categories;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getAllCategoriesByCustomer.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getSingleCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleCategory.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
        state.isLoading = false;
      })
      .addCase(getSingleCategory.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
        state.isLoading = false;
      })
      .addCase(createCategory.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCategory.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(searchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.filteredCategories = action.payload;
        state.isLoading = false;
      })
      .addCase(searchCategories.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setSelectedCategory,
  updateCategoryStateValues,
  selectPage,
  moveNextPage,
  movePrevPage,
} = CategorySlice.actions;

export default CategorySlice.reducer;
