import CustomLoader from "@/components/shared/atom/CustomLoader";

import Fuse from "fuse.js";

import { AppDispatch, RootState } from "@/lib/redux/store";

import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ICategory } from "@/types/categories";
import { setSelectedCategory } from "@/lib/redux/slices/category/categorySlice";
import NewCategoryForm from "./NewCategoryForm";

interface CategoryPopoverProps {
  categorySearch: string;
  handleUpdateSelectedCategory: (category: ICategory) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const CategoryPopover: FC<CategoryPopoverProps> = ({
  categorySearch,
  handleUpdateSelectedCategory,
  setIsOpen,
  isOpen,
}) => {
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [categoryData, setCategoryData] = useState<ICategory[] | null>(null);

  const { allCategories, isLoading } = useSelector(
    (store: RootState) => store.categories
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!allCategories) return;
    const fuse = new Fuse(allCategories, options);

    if (categorySearch?.length < 1) {
      setCategoryData(allCategories);
    }

    const results = fuse?.search(categorySearch);

    setCategoryData(results.map((result) => result.item));
  }, [allCategories, categorySearch]);



  return isOpen ? (
    <div className="absolute z-10 bg-white w-full top-full">
      <div className="w-full p-8 shadow-xl rounded-xl">
        {isNewCategory ? (
          <NewCategoryForm setIsOpen={setIsOpen} setIsNewCategory={setIsNewCategory} />
        ) : (
          <div className="my-4 text-base">
            {categoryData?.length === 0 && (
              <div className="text-base text-center">No results found.</div>
            )}

            <button
              onClick={() => setIsNewCategory(true)}
              className="font-semibold text-base text-green-500 "
            >
              Add New Category
            </button>
            <hr className="my-4" />

            {categoryData &&
              !isLoading &&
              categoryData.map((item, index) => (
                <React.Fragment key={index}>
                  <div
                    className="cursor-pointer text-base capitalize"
                    onClick={() => {
                      dispatch(setSelectedCategory(item));
                      handleUpdateSelectedCategory(item)
                      setIsOpen(false);
                    }}
                  >
                    {item.name}
                  </div>
                  <hr className="my-4" />
                </React.Fragment>
              ))}

            {!categoryData && isLoading && (
              <CustomLoader width={22} height={22} />
            )}
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default CategoryPopover;

const options = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.2,
  keys: ["name"],
};
