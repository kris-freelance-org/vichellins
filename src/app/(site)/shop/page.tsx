import { getSitePage, sitePageMetadata } from "@/lib/site-content";
import { ShopView } from "@/components/ShopView";

export const generateMetadata = () => sitePageMetadata("shop");

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams;
  const { values } = await getSitePage("shop");
  return (
    <ShopView
      basePath="/shop"
      params={params}
      heading={values.title}
      intro={values.intro}
    />
  );
}
