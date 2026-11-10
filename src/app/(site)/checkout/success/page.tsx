import { getSitePage, sitePageMetadata } from "@/lib/site-content";
import { OrderSuccessClient } from "./OrderSuccessClient";
export const generateMetadata = () => sitePageMetadata("order-success");
export default async function Page() { return <OrderSuccessClient copy={(await getSitePage("order-success")).values} />; }
