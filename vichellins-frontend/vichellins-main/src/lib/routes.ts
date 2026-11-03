const routes = {
  // default routes
  home: "/",

  // auth routes
  login: "/login",
  loginAsStaff: "/login-staff",
  register: "/register",
  enterOTP: "/enter-otp",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  // protected routes
  admin: "/admin",
  account: "/account",
  accountOrders: "/account/orders",
  accountUpdatePassword: "/account/update-password",
  accountWishlist: "/account/wishlist",
  adminProduct: "/admin/products",
  adminOrders: "/admin/orders",
  adminProfile: "/admin/profile",
  adminCustomers: "/admin/customers",

  // error route
  error: "/api/auth/error",
};

export default routes;
