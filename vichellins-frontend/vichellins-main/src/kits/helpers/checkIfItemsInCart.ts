import { ICart } from "@/types/cart";

export const checkIfItemsInCart = (cartItems: ICart[] | null, id: string) => {
  return cartItems?.find((item) => item.product.id === id);
};
