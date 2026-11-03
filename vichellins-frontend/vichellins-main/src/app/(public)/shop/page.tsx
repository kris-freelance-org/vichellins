import ShopPage from "@/components/shop/ShopPage";
import { Suspense } from "react";

const Shop = () => {
  return (
    <div className="w-frame">
      <Suspense>
        <ShopPage />
      </Suspense>
    </div>
  );
};

export default Shop;
