"use client";

import { AppDispatch, RootState } from "@/lib/redux/store";
import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../ui/Input";
import { IAddProduct } from "@/types/products";
import { getAllCategories } from "@/lib/redux/slices/category/categoryThunk";
import { Textarea } from "../ui/textarea";
import UploadProductImages from "./UploadProductImages";
import CategoryPopover from "./molecules/CategoryPopover";
import { useOnClickOutside } from "@/hooks/useOnclickOutside";
import Image from "next/image";
import Link from "next/link";
import { ICategory } from "@/types/categories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ProductFormProps {
  readonly?: boolean;
  productUpdateMode?: boolean;
  productInfo: IAddProduct;
  setProductInfo: React.Dispatch<React.SetStateAction<IAddProduct>>;
}
const ProductForm: FC<ProductFormProps> = ({
  readonly,
  productUpdateMode,
  productInfo,
  setProductInfo,
}) => {
  const { selectedProductAdmin } = useSelector(
    (store: RootState) => store.products
  );
  const { allCategories } = useSelector((store: RootState) => store.categories);

  const [categorySearch, setCategorySearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(getAllCategories());
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [dispatch]);

  useEffect(() => {
    if (selectedProductAdmin) {
      setCategorySearch(selectedProductAdmin?.category?.name);
    }
  }, [selectedProductAdmin]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setProductInfo({ ...productInfo, [name]: value });
  };

  const handleUpdateSelectedCategory = (category: ICategory) => {
    if (!category) return;

    if (category.id && allCategories) {
      const result = allCategories.find((item) => item.id === category.id);

      if (result) {
        setCategorySearch(result.name);
        setProductInfo({ ...productInfo, categoryId: result.id });
      }
    }
  };

  return (
    <div className="space-y-6 py-12 text-base border-t  font-medium">
      <>
        <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
          <label htmlFor="">Name</label>
          <div className="flex gap-4 items-center md:w-[80%]">
            <Input
              value={productInfo.name}
              onChange={handleChange}
              readOnly={readonly}
              name="name"
              placeholder="Name"
              className=" focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <hr />
        <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
          <label htmlFor="">Unit Price</label>

          <div className="flex gap-4 items-center md:w-[80%]">
            <Input
              value={productInfo.price}
              onChange={handleChange}
              type="number"
              name="price"
              readOnly={readonly}
              placeholder="Enter a unit price"
              className=" focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        <hr />
        <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
          <label htmlFor="">Stock</label>

          <div className="flex gap-4 items-center md:w-[80%]">
            <Input
              value={productInfo.stock}
              onChange={handleChange}
              type="number"
              name="stock"
              readOnly={readonly}
              placeholder="Enter Product stock"
              className=" focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        <hr />
        {productUpdateMode && selectedProductAdmin && (
          <>
            <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr] ">
              <div className="flex flex-col  gap-3">
                <label htmlFor="">Media</label>
                <Link
                  className="font-semibold text-green-500"
                  href={`/admin/products/${selectedProductAdmin.id}/update-product-images`}
                >
                  Update Media
                </Link>
              </div>

              <div className="flex gap-4 h-[10rem] md:w-[80%] ">
                <div className="flex w-full gap-4  ">
                  <button
                    type="button"
                    className="border flex rounded-xl h-[10rem] w-full lg:w-[14.5rem]"
                  >
                    <Image
                      width={150}
                      height={150}
                      className="h-full w-fit object-cover"
                      src={
                        selectedProductAdmin.leftImage ||
                        "/images/no-image-placeholder.png"
                      }
                      alt={selectedProductAdmin?.name}
                    />
                  </button>
                  <button
                    type="button"
                    className="border rounded-xl h-[10rem] w-full lg:w-[14.5rem]"
                  >
                    <Image
                      width={150}
                      height={120}
                      className="h-full w-fit object-cover"
                      src={
                        selectedProductAdmin.mainImage ||
                        "/images/no-image-placeholder.png"
                      }
                      alt={selectedProductAdmin?.name}
                    />
                  </button>
                  <button
                    type="button"
                    className="border rounded-xl h-[10rem] w-full lg:w-[14.5rem]"
                  >
                    <Image
                      width={150}
                      height={120}
                      className="h-full w-fit object-cover"
                      src={
                        selectedProductAdmin.rightImage ||
                        "/images/no-image-placeholder.png"
                      }
                      alt={selectedProductAdmin.name}
                    />
                  </button>
                  <button
                    type="button"
                    className="border rounded-xl h-[10rem] w-full lg:w-[14.5rem]"
                  >
                    <Image
                      width={150}
                      height={120}
                      className="h-full w-fit object-cover"
                      src={
                        selectedProductAdmin.extraImage ||
                        "/images/no-image-placeholder.png"
                      }
                      alt={selectedProductAdmin.name}
                    />
                  </button>
                </div>
              </div>
            </div>
            <hr />
          </>
        )}

        <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
          <label htmlFor="Category" className="font-semibold text-gray-600">
            Category
          </label>
          <div className="md:w-[80%] relative" ref={ref}>
            <Select value={productInfo?.categoryId} onValueChange={(val) => setProductInfo({...productInfo, categoryId: val})}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories?.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* <Input
              value={categorySearch}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                if (!isOpen && categorySearch.length > 1) {
                  setIsOpen(true);
                }
              }}
              readOnly={readonly}
              placeholder="Enter Category"
              className=" focus-visible:ring-0 focus-visible:ring-offset-0"
            /> */}

            <CategoryPopover
              handleUpdateSelectedCategory={handleUpdateSelectedCategory}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              categorySearch={categorySearch}
            />
          </div>
        </div>
        <hr />

        <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
          <label htmlFor="">Description</label>

          <Textarea
            value={productInfo.description}
            onChange={handleChange}
            name="description"
            readOnly={readonly}
            placeholder="Describe Product"
            className=" focus-visible:ring-0 min-h-[30rem] focus-visible:ring-offset-0 md:w-[80%]"
          />
        </div>
        <hr />

        {!productUpdateMode && <UploadProductImages addProductImage />}
      </>
    </div>
  );
};

export default ProductForm;
