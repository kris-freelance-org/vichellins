/* eslint-disable react/prop-types */
import { createContext, Dispatch, ReactNode, useReducer } from "react";

// Named Export

interface IImageData {
  image?: File;
  imageUrl: string | null;
}
interface IProductImage {
  main: IImageData | null;
  right: IImageData | null;
  left: IImageData | null;
  extra: IImageData | null;
}

interface ProductFileContextType {
  productImageState: IProductImage;
  updateProductImageState: Dispatch<Action>;
}

export const ProductFileContext = createContext<
  ProductFileContextType | undefined
>(undefined);

const initialState: IProductImage = {
  main: null,
  right: null,
  left: null,
  extra: null,
};

type Action = { type: "update"; payload: IProductImage };

const reducer = (state: IProductImage, action: Action) => {
  if (action.type === "update") {
    return action.payload;
  } else {
    return state;
  }
};

const ProductFileContextProvider = ({ children }: { children: ReactNode }) => {
  const [productImageState, updateProductImageState] = useReducer(
    reducer,
    initialState
  );
  return (
    <ProductFileContext.Provider
      value={{ productImageState, updateProductImageState }}
    >
      {children}
    </ProductFileContext.Provider>
  );
};

export default ProductFileContextProvider;
