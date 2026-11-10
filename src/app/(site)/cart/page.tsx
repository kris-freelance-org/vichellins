import { getSitePage, sitePageMetadata } from "@/lib/site-content";
import { CartClient } from "./CartClient";
export const generateMetadata = () => sitePageMetadata("cart");
export default async function Page() { return <CartClient copy={(await getSitePage("cart")).values} />; }
