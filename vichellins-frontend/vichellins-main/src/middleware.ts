import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import routes from "./lib/routes";

const secret = process.env.NEXTAUTH_SECRET;

console.log('NEXT_PUBLIC_API_BASE_URL', process.env.NEXT_PUBLIC_API_BASE_URL)

const protectedRoutes = [
  routes.admin,
  routes.account,
  routes.accountOrders,
  routes.accountUpdatePassword,
  routes.accountWishlist,
  routes.adminCustomers,
  routes.adminProduct,
  routes.adminOrders,
  routes.adminProfile,
];

const unProtectedRoutes = [
  routes.login,
  routes.loginAsStaff,
  routes.register,
  routes.enterOTP,
  routes.resetPassword,
  routes.forgotPassword,
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const token = await getToken({ req, secret });

  if (pathname === "/api/auth/signout") {
    return NextResponse.next();
  }

  if (protectedRoutes.includes(pathname) && !token?.user) {
    const redirectUrl = new URL(routes.login, req.url);
    redirectUrl.searchParams.set("redirect", pathname);
    console.log({ token, redirectUrl });
    return NextResponse.redirect(redirectUrl);
  }

  if (unProtectedRoutes.includes(pathname) && token?.user) {
    return NextResponse.redirect(new URL(routes.admin, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
