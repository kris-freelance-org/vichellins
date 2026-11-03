"use client";

import { ICart } from "@/types/cart";
import { FC, useEffect, useState } from "react";
import QuantityBox from "../shared/molecules/QuantityBox";
import { Button } from "../ui/Button";
import { Trash2 } from "lucide-react";
import {
  getCartItemInLocalStorage,
  getCartItems,
  removeCartItemFromLocalStorage,
  removeFromCart,
  updateItemQuantity,
  updateItemQuantityInLocalStorage,
} from "@/lib/redux/slices/cart/cartThunk";
import { toast } from "@/hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { AxiosError } from "axios";
import { sumCartTotal } from "@/lib/redux/slices/cart/cartSlice";
import { formatToNaira } from "@/kits/helpers/formatToNaira";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface CartItemProps {
  cartItem: ICart;
}
const CartItem: FC<CartItemProps> = ({ cartItem }) => {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems } = useSelector((store: RootState) => store.cart);

  const { data: session } = useSession();

  useEffect(() => {
    dispatch(sumCartTotal());
  }, [cartItems, quantity, dispatch]);

  const handleUpdateQuantity = async (qty: number) => {
    if (!cartItem) return;
    setIsLoading(true);
    try {
      if (!session?.user) {
        dispatch(
          updateItemQuantityInLocalStorage({
            product_id: cartItem.product.id,
            quantity: qty,
          })
        );

        dispatch(getCartItemInLocalStorage());
      } else {
        const res = await dispatch(
          updateItemQuantity({
            cart_id: cartItem.id,
            quantity: qty,
          })
        );
        if (res.type.includes("rejected"))
          return toast({
            title: "An Error Occurred",
            description: res.payload as string,
            variant: "destructive",
          });

        await dispatch(getCartItems());
      }

      return toast({
        title: "Item Quantity Updated",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Adding to Cart",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Error Adding to Cart",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async () => {
    if (!cartItem) return;
    setDeleteLoading(true);
    try {
      if (!session?.user) {
        dispatch(removeCartItemFromLocalStorage(cartItem.id));
        dispatch(getCartItemInLocalStorage());
      } else {
        const res = await dispatch(removeFromCart(cartItem.id));
        if (res.type.includes("rejected"))
          return toast({
            title: "An Error Occurred",
            description: res.payload as string,
            variant: "destructive",
          });
        await dispatch(getCartItems());
      }

      return toast({
        title: "Item Removed from Cart",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Removing from Cart",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Error Removing from Cart",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleIncrement = () => {
    const value = Number(quantity) + 1;
    setQuantity(value);
    handleUpdateQuantity(value);
  };
  const handleDecrement = () => {
    if (Number(quantity) === 1) return;
    const value = Number(quantity) - 1;
    setQuantity(value);
    handleUpdateQuantity(value);
  };

  return (
    <div className="flex gap-6 border rounded-lg p-3 items-center justify-between">
      <div className="flex gap-6">
        <Link href={`/shop/${cartItem.product.id}`}>
          <Image
            width={150}
            height={100}
            className="w-[15rem] h-[10rem] object-cover"
            src={
              cartItem.product?.mainImage
                ? cartItem.product?.mainImage
                : "/images/no-image-placeholder.png"
            }
            alt={cartItem.product.name}
          />
        </Link>
        <div className="space-y-4">
          <Link href={`/shop/${cartItem.product.id}`}>
            <h5 className="font-light text-[1.6rem] ">
              {cartItem.product.name}
            </h5>
          </Link>
          <h6 className="text-base font-bold">
            {formatToNaira.format(cartItem.product.price)}
          </h6>
          <QuantityBox
            isLoading={isLoading}
            hideText
            setQuantity={setQuantity}
            quantity={quantity}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
          />
        </div>
      </div>

      <Button
        isLoading={deleteLoading}
        onClick={handleRemoveItem}
        variant={"ghost"}
      >
        <Trash2 className="text-rose-500" size={20} />
      </Button>
    </div>
  );
};

export default CartItem;
