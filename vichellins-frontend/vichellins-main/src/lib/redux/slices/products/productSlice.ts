import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  addProduct,
  getAllProducts,
  getAllProductsAdmin,
  getPopularProducts,
  getProductByCategory,
  getProductByPriceAndCategory,
  getProductReview,
  getSingleProduct,
  searchProducts,
  updateProduct,
} from "./productThunk";
import { IProduct, IProductReview } from "@/types/products";
import Fuse from "fuse.js";

interface CategorySliceState {
  [key: string]: unknown;
  allProducts: IProduct[] | null;
  // categoryProducts: IProduct[] | null;
  filteredProducts: IProduct[] | null;
  popularProducts: IProduct[] | null;
  isSearching: false;
  selectedProduct: IProductReview | null;
  selectedProductAdmin: IProduct | null;

  searchList: null;
  isLoading: boolean;
  currentPage: number;
  limit: number;
  numberOfPages: number;
  total: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

interface UpdateStatePayload {
  name: keyof CategorySliceState;
  value: unknown;
}

const initialState: CategorySliceState = {
  allProducts: null,
  popularProducts: null,
  filteredProducts: null,
  // categoryProducts: null,
  selectedProduct: null,
  selectedProductAdmin: null,
  isSearching: false,
  searchList: null,
  currentPage: 1,
  isLoading: false,
  limit: 10,
  numberOfPages: 1,
  total: 1,
  nextPageUrl: null,
  prevPageUrl: null,
};

const options = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.2,
  keys: ["id", "name"],
};

const CategorySlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedUser = action.payload;
    },

    updateProductStateValues: (
      state,
      action: PayloadAction<UpdateStatePayload>
    ) => {
      state[action.payload.name] = action.payload.value;
    },
    handleFilterProductByPrice: (state, action) => {
      state.filteredProducts =
        (state.allProducts &&
          state.allProducts.filter(
            (product) =>
              product.price >= action.payload.min &&
              product.price < action.payload.max
          )) ||
        [];
    },
    handleSortProductByPriceAsc: (state) => {
      state.filteredProducts =
        state.allProducts &&
        state.allProducts.sort((a, b) => a.price - b.price);
    },
    handleSortProductByPriceDesc: (state) => {
      state.filteredProducts =
        state.allProducts &&
        state.allProducts.sort((a, b) => b.price - a.price);
    },
    handleSortProductByDateAsc: (state) => {
      state.filteredProducts =
        state.allProducts &&
        state.allProducts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    },
    handleSortProductByDateDesc: (state) => {
      state.filteredProducts =
        state.allProducts &&
        state.allProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    handleSearchProducts: (state, action) => {
      if (state.allProducts) {
        const fuse = new Fuse(state.allProducts, options);
        const value = action.payload;

        if (value.length === 0) {
          state.filteredProducts = state.allProducts;
          return;
        }

        const results = fuse.search(value);
        const items = results.map((result) => result.item);

        state.filteredProducts = items;
      }
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
      .addCase(getAllProductsAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProductsAdmin.fulfilled, (state, action) => {
        state.allProducts = action.payload.products;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getAllProductsAdmin.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.allProducts = action.payload.products;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getAllProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getSingleProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.selectedProductAdmin = action.payload;
        state.isLoading = false;
      })
      .addCase(getSingleProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getPopularProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPopularProducts.fulfilled, (state, action) => {
        state.popularProducts = action.payload.products;
        state.isLoading = false;
      })
      .addCase(getPopularProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getProductByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductByCategory.fulfilled, (state, action) => {
        state.allProducts = action.payload.products;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getProductByCategory.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getProductByPriceAndCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductByPriceAndCategory.fulfilled, (state, action) => {
        state.allProducts = action.payload.products;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
        state.filteredProducts = null;
      })
      .addCase(getProductByPriceAndCategory.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getProductReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductReview.fulfilled, (state, action) => {
        state.selectedProductReview = action.payload;
        state.isLoading = false;
      })
      .addCase(getProductReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.filteredProducts = action.payload.products;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(searchProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateProduct.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setSelectedProduct,
  handleFilterProductByPrice,
  updateProductStateValues,
  handleSortProductByPriceAsc,
  handleSortProductByPriceDesc,
  handleSortProductByDateAsc,
  handleSortProductByDateDesc,
  handleSearchProducts,
  selectPage,
  moveNextPage,
  movePrevPage,
} = CategorySlice.actions;

export default CategorySlice.reducer;
