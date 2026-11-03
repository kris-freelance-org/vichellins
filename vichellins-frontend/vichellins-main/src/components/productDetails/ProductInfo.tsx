"use client";

import { AppDispatch, RootState } from "@/lib/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomLoader from "../shared/atom/CustomLoader";
import { Button, buttonVariants } from "../ui/Button";
import Reviews from "./Reviews";
import QuantityBox from "../shared/molecules/QuantityBox";
import { toast } from "@/hooks/useToast";
import {
  addItemToCart,
  getCartItemInLocalStorage,
  getCartItems,
  storeCartItemInLocalStorage,
  updateItemQuantityInLocalStorage,
} from "@/lib/redux/slices/cart/cartThunk";
import { AxiosError } from "axios";
import { checkIfItemsInCart } from "@/kits/helpers/checkIfItemsInCart";
import { cn } from "@/lib/utils";
import { formatToNaira } from "@/kits/helpers/formatToNaira";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

const ProductInfo = () => {
  const [quantity, setQuantity] = useState(1);
  const [byNowLoading, setByNowLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const { selectedProduct, isLoading } = useSelector(
    (store: RootState) => store.products
  );
  const { cartItems } = useSelector((store: RootState) => store.cart);
  const { data: session } = useSession();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useRouter();

  useEffect(() => {
    if (!selectedProduct) return;
    const itemInCart = checkIfItemsInCart(cartItems, selectedProduct?.id);
    if (itemInCart) {
      setQuantity(itemInCart.quantity);
    }
  }, [cartItems, selectedProduct]);

  const handleUpdateQuantity = async (qty: number) => {
    if (!cartItems || !selectedProduct) return;

    if (!checkIfItemsInCart(cartItems, selectedProduct?.id)) return;
    try {
      if (!session?.token) {
        dispatch(
          updateItemQuantityInLocalStorage({
            product_id: selectedProduct?.id,
            quantity: qty,
          })
        );

        dispatch(getCartItemInLocalStorage());
      } else {
        const res = await dispatch(
          addItemToCart({
            user_id: session?.user?.id,
            product_id: selectedProduct?.id,
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

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    try {
      setCartLoading(true);
      if (!session?.user) {
        dispatch(
          storeCartItemInLocalStorage({
            product: selectedProduct,
            quantity,
          })
        );

        dispatch(getCartItemInLocalStorage());
      } else {
        const res = await dispatch(
          addItemToCart({
            user_id: session?.user?.id,
            product_id: selectedProduct.id,
            quantity: quantity,
          })
        );

        if (res.type.includes("rejected"))
          return toast({
            title: "An Error Occurred",
            description: res.payload as string,
            variant: "destructive",
          });
      }

      navigate.push("/cart");

      return toast({
        title: "User Product Added to Cart Successfully",
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
      setCartLoading(false);
    }
  };

  const handleByNow = async () => {
    if (!selectedProduct) return;
    try {
      setByNowLoading(true);
      if (!checkIfItemsInCart(cartItems, selectedProduct.id)) {
        handleAddToCart();
      }
      navigate.push("/checkout");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Processing to Checkout",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setByNowLoading(false);
    }
  };

  return (
    <div>
      {selectedProduct && !isLoading ? (
        <div className="text-base space-y-10">
          <div className="flex justify-between items-center ">
            <h5 className="font-medium text-2xl max-w-[60%]">
              {selectedProduct.name}
            </h5>

            <h6 className="text-[1.8rem] text-primary font-bold">
              {formatToNaira.format(selectedProduct.price)}
            </h6>
          </div>
          <QuantityBox
            setQuantity={setQuantity}
            quantity={quantity}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
          />

          <div className="flex flex-col sm:flex-row gap-6 lg:gap-12 ">
            <Button
              isLoading={byNowLoading}
              onClick={handleByNow}
              className="w-full"
            >
              Buy Now
            </Button>

            {checkIfItemsInCart(cartItems, selectedProduct?.id) ? (
              <Link
                href="/cart"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    className: "w-full border-primary",
                  })
                )}
              >
                View In Cart
              </Link>
            ) : (
              <Button
                isLoading={cartLoading}
                onClick={handleAddToCart}
                className="w-full border-primary"
                variant={"outline"}
              >
                Add To Cart
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <h5 className="text-[1.8rem]">Product Description</h5>
            <p className=" font-thin text-[1.6rem] text-gray-600 w-full  ">
              {selectedProduct.description}
            </p>
          </div>

          <div className="w-full">
            <Reviews />
          </div>
        </div>
      ) : isLoading ? (
        <CustomLoader width={24} height={24} />
      ) : (
        <div className="h-[20rem] flex justify-center items-center text-2xl text-primary font-bold">
          No Product to display
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
