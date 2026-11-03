import { ICategory } from "@/types/categories";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface SingleCategoryProps {
  category: ICategory;
}
const SingleCategory: FC<SingleCategoryProps> = ({ category }) => {
  return (
    <Link
      href={`/shop/categories${category.id}`}
      className="flex-1 min-w-[25rem] mb-8 pb-6 border rounded-2xl  flex flex-col items-center hover:shadow-md"
    >
      <Image
        width={400}
        height={400}
        className="lg:h-[32rem] w-full object-contain"
        src={category.image || "/images/no-image-placeholder.png"}
        alt={category.name}
      />
      <span className="text-[1.2rem] lg:text-[1.6rem] text-center font-semibold flex mt-8">
        {category.name}
      </span>
    </Link>
  );
};

export default SingleCategory;
