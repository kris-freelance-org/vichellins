import { IProduct } from "./products";

export interface IWishList {
  id: number;
  user_id: number;
  product_id: number;
  createdAt: string;
  updatedAt: string;
  product: IProduct;
}
