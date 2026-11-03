"use client"

import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import CustomLoader from "@/components/shared/atom/CustomLoader";
import { sumCartTotal } from "@/lib/redux/slices/cart/cartSlice";
import {
  getCartItemInLocalStorage,
  getCartItems,
} from "@/lib/redux/slices/cart/cartThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useSession } from "next-auth/react";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// interface CartProps {}
const Cart: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { cartItems, cartTotal } = useSelector(
    (store: RootState) => store.cart
  );
const { data:session } = useSession()

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(sumCartTotal());
  }, [cartItems, dispatch]);



  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        if (!session?.user) {
          dispatch(getCartItemInLocalStorage());
        } else {
          await dispatch(getCartItems());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [dispatch, session?.user]);

  return (
    <div className="w-frame mt-8 space-y-12">
      <h4 className="text-[1.8rem]">Cart</h4>

      <div className="grid  lg:grid-cols-2 gap-24 justify-between ">
        <div className="space-y-8 flex-1 order-2 lg:order-1">
          {cartItems &&
            !isLoading &&
            cartItems.map((item) => (
              <React.Fragment key={item.id}>
                <CartItem cartItem={item} />
              </React.Fragment>
            ))}

          {isLoading && <CustomLoader width={24} height={24} />}
          {!isLoading && cartItems?.length === 0 && (
            <div className="text-2xl text-primary font-semibold flex h-[20rem] justify-center items-center">
              No Items in Cart
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2 flex justify-end h-fit">
          <OrderSummary items={cartItems} total={cartTotal} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
