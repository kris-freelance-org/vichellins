import React, { FC } from "react";
import ProductCard from "./molecules/ProductCard";
import { IProduct } from "@/types/products";

interface ProductGridsProps {
  allProducts: IProduct[];
  filterId?: string;
  isInWishList?: boolean;
}
const ProductGrids: FC<ProductGridsProps> = ({
  allProducts,
  isInWishList,
  filterId,
}) => {
  return (
    <div className="grid gap-3 lg:gap-8 grid-cols-2  md:grid-cols-3 lg:grid-cols-3">
      {allProducts
        .filter((product) => product.id !== filterId)
        .map((product) => (
          <React.Fragment key={product.id}>
            <ProductCard isInWishList={isInWishList} product={product} />
          </React.Fragment>
        ))}
    </div>
  );
};

export default ProductGrids;
