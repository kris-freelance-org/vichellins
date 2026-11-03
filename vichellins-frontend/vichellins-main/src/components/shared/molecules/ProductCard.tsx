"use client";

import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/useToast";
import { checkIfItemsInCart } from "@/kits/helpers/checkIfItemsInCart";
import { formatToNaira } from "@/kits/helpers/formatToNaira";
import {
  addItemToCart,
  getCartItemInLocalStorage,
  getCartItems,
  storeCartItemInLocalStorage,
} from "@/lib/redux/slices/cart/cartThunk";
import {
  addWishList,
  deleteFromWishList,
  getUserWishList,
} from "@/lib/redux/slices/wishlist/wishlistThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { IProduct } from "@/types/products";
import { AxiosError } from "axios";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ProductCardProps {
  product: IProduct;
  isInWishList?: boolean;
}
const ProductCard: FC<ProductCardProps> = ({ product, isInWishList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRemoveFromWishlist, setIsLoadingRemoveFromWishlist] =
    useState(false);
  
  const pathname = usePathname();

  const { cartItems } = useSelector((store: RootState) => store.cart);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useRouter();

  const { data: session } = useSession();

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setIsLoadingRemoveFromWishlist(true);
      const res = await dispatch(deleteFromWishList(Number(productId)));
      if (res.type.includes("rejected")) {
        return toast({
          title: "An Error Occurred",
          description: res.payload as string,
          variant: "destructive",
        });
      }
      await dispatch(getUserWishList());
      toast({
        title: "Product removed from wishlist Successfully",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Removing from Wishlist",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }
      toast({
        title: "Error Removing from wishlist",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRemoveFromWishlist(false);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      setIsLoadingRemoveFromWishlist(true);
      const res = await dispatch(addWishList(Number(productId)));
      if (res.type.includes("rejected")) {
        return toast({
          title: "An Error Occurred",
          description: res.payload as string,
          variant: "destructive",
        });
      }
      await dispatch(getUserWishList());
      toast({
        title: "Product added to wishlist Successfully",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error adding to Wishlist",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }
      toast({
        title: "Error adding to Wishlist",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRemoveFromWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!session?.user) {
        if (!checkIfItemsInCart(cartItems, product.id)) {
          dispatch(
            storeCartItemInLocalStorage({
              product,
              quantity: 1,
            })
          );
        } else {
          return toast({
            title: "Items Already In Cart",
          });
        }

        dispatch(getCartItemInLocalStorage());
      } else {
        setIsLoading(true);
        const res = await dispatch(
          addItemToCart({
            product_id: product.id,
            quantity: 1,
            user_id: session?.user.id,
          })
        );
        if (res.type.includes("rejected"))
          return toast({
            title: "An Error Occurred",
            description: res.payload as string,
            variant: "destructive",
          });

        dispatch(getCartItems());
      }

      toast({
        title: "Product Added to Cart Successfully",
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

  return (
    <div
      onClick={() =>
        navigate.push(
          `/shop/${product.id}?n=${product.name.replaceAll(" ", "_")}`
        )
      }
      className="   cursor-pointer flex flex-col justify-between space-y-6 border p-4 rounded-xl group  transition-all hover:shadow-md"
    >
      <div className=" h-[33.6rem] lg:h-[43.6rem]  overflow-hidden relative ">
        <Image
          width={380}
          height={436}
          className="rounded-xl w-full h-full  object-cover transition-all group-hover:scale-105"
          src={
            product.mainImage ||
            product.leftImage ||
            product.rightImage ||
            product.extraImage ||
            "/images/no-image-placeholder.png"
          }
          alt={product.name}
        />
        {isInWishList && (
          <Button
            isLoading={isLoadingRemoveFromWishlist}
            onClick={(e) => {
              e.stopPropagation();
              if (product.wishlistId) {
                handleRemoveFromWishlist(product.wishlistId);
              }
            }}
            variant={"outline"}
            className="text-rose-500 hover:bg-rose-200 absolute top-[1rem] right-[1rem]"
          >
            <Trash2 />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <h6 className="font-bold whitespace-nowrap truncate w-[80%] text-[1.2rem] lg:text-base">
            {product.name}
          </h6>

          <div className="flex lg:gap-6">
            <Button
              isLoading={isLoading}
              onClick={(e) => {
                e.stopPropagation()
                handleAddToCart()
              }
              }
              variant={"ghost"}
              className="p-2 m-0 w-fit h-fit"
            >
              <ShoppingCart className="text-gray-600 hover:text-primary w-6 h-6 lg:w-fit lg:h-fit" />
            </Button>
            <Button
              isLoading={isLoadingRemoveFromWishlist}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToWishlist(product.id);
              }}
              variant={"ghost"}
              className="p-2 m-0 w-fit h-fit"
            >
              <Heart className={`text-rose-600 hover:text-rose-800 ${pathname === '/account/wishlist' ? "fill-rose-600" : "" } w-6 h-6 lg:w-fit lg:h-fit`} />
            </Button>
          </div>
        </div>

        <h6 className="font-medium text-base lg:text-[1.8rem]">
          {formatToNaira.format(product.price)}
        </h6>
      </div>
    </div>
  );
};

export default ProductCard;
