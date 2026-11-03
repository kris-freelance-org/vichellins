import { configureStore } from "@reduxjs/toolkit";
import ModalSlice from "./slices/modalSlice";
import AuthSlice from "./slices/auth/authSlice";
import Analytics from "./slices/analytics/analyticsSlice";
import UserManagmtSlice from "./slices/userManagmt/userManagmtSlice";
import CategorySlice from "./slices/category/categorySlice";
import ProductSlice from "./slices/products/productSlice";
import CartSlice from "./slices/cart/cartSlice";
import OrderSlice from "./slices/orders/orderSlice";
import TransactionSlice from "./slices/transaction/transactionSlice";
import WishlistSlice from "./slices/wishlist/wishlistSlice";
import CheckoutSlice from "./slices/checkout/checkoutSlice";
import CustomerSlice from "./slices/customers/customerSlice";
import StaffSlice from "./slices/staff/staffSlice";
import TicketSlice from "./slices/tickets/ticketSlice";

export const store = configureStore({
  reducer: {
    modal: ModalSlice,
    auth: AuthSlice,
    userMgmt: UserManagmtSlice,
    analytics: Analytics,
    categories: CategorySlice,
    cart: CartSlice,
    products: ProductSlice,
    orders: OrderSlice,
    transactions: TransactionSlice,
    wishlist: WishlistSlice,
    checkout: CheckoutSlice,
   
    customer: CustomerSlice,
    staff: StaffSlice,
    ticket: TicketSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
