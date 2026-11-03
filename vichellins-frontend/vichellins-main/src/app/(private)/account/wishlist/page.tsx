"use client";

import PageLoader from "@/components/shared/PageLoader";
import ProductGrids from "@/components/shared/ProductGrids";
import { getUserWishList } from "@/lib/redux/slices/wishlist/wishlistThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// interface WishlistProps {}
const Wishlist: FC = () => {
  const { isLoading, wishlist } = useSelector(
    (store: RootState) => store.wishlist
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      await dispatch(getUserWishList());
    };

    getData();
  }, []);

  return (
    <div className="w-frame mt-8 space-y-12">
      <h4 className="text-[1.8rem]">Wishlist</h4>

      {isLoading  ? (
        <PageLoader />
      ) : wishlist && wishlist.length > 0 && !isLoading ? (
        <ProductGrids
          isInWishList
          allProducts={wishlist.map((i) => {
            let product = i.product;
            product = { ...product, wishlistId: i.id.toString() };
            return product;
          })}
        />
      ) : (
        <div className="h-[30rem] flex justify-center items-center ">
          <h5 className="text-2xl font-semibold  text-green-700">
            No Items in wish List
          </h5>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
