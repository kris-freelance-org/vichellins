import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/useToast";
import { updateCategoryStateValues } from "@/lib/redux/slices/category/categorySlice";
import {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "@/lib/redux/slices/category/categoryThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { AxiosError } from "axios";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";

interface NewCategoryFormProps {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewCategory?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedId?: string | null;
}
const NewCategoryForm: FC<NewCategoryFormProps> = ({
  setIsOpen,
  setIsNewCategory,
  selectedId,
}) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const { selectedCategory } = useSelector(
    (store: RootState) => store.categories
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = () => {
      dispatch(
        updateCategoryStateValues({
          name: "selectedCategory",
          value: null,
        })
      );
      if (!selectedId) return;
      try {
        dispatch(getSingleCategory(selectedId));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch, selectedId]);

  useEffect(() => {
    if (selectedCategory) {
      setNewCategory({
        name: selectedCategory.name,
        description: selectedCategory.description,
      });
      setPreview(selectedCategory.image);
    }
  }, [selectedCategory]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setImage(acceptedFiles[0]);

    const file = new FileReader();

    file.onload = function () {
      setPreview(file.result);
    };

    file.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCreateCategory = async () => {
    const postData = new FormData();
    if (!image) {
      throw new Error("Please Select an Image");
    }
    postData.append("image", image);
    postData.append("name", newCategory.name);
    postData.append("description", newCategory.description);
    return await dispatch(createCategory(postData));
  };
  const handleUpdateCategory = async () => {
    const postData = new FormData();

    if (!selectedId) {
      throw new Error("Please Select a Category");
    }

    if (image) {
      postData.append("image", image);
    }

    postData.append("name", newCategory.name);
    postData.append("description", newCategory.description);
    return await dispatch(
      updateCategory({
        category_id: selectedId,
        formData: postData,
      })
    );
  };

  const handleAddCategory = async () => {
    try {
      setIsLoading(true);
      if (!newCategory) {
        return toast({
          title: "Invalid Input",
          description: "Please provide Category Name",
          variant: "destructive",
        });
      }

      //   Upload Category Information
      const resInfo = !selectedId
        ? await handleCreateCategory()
        : await handleUpdateCategory();
      if (resInfo.type.includes("rejected")) {
        return toast({
          title: "An Error Occurred",
          description: resInfo.payload as string,

          variant: "destructive",
        });
      }

      if (typeof resInfo !== "string") {
        // dispatch(setSelectedCategory(resInfo?.payload));

        await dispatch(getAllCategories());
        if (setIsOpen) {
          setIsOpen(false);
        }
        if (setIsNewCategory) {
          setIsNewCategory(false);
        }
      }

      setImage(null);
      setPreview("");
      setNewCategory({
        name: "",
        description: "",
      });

      return toast({
        title: selectedId
          ? "Category Updated successfully"
          : "Category Added successfully",

        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: selectedId ? "Error Updating" : "Error Adding",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }
      return toast({
        title: selectedId ? "Error Updating" : "Error Adding",
        description: "Something Went Wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div {...getRootProps()} className=" rounded-lg text-base p-6 w-full">
        <div className="text-2xl font-manjari font-bold  mb-4">Upload file</div>
        <input {...getInputProps()} accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" />
        {preview ? (
          <Image
            width={500}
            height={200}
            className="object-cover object-center w-full h-[20rem]"
            src={preview as string}
            alt="Product Image"
          />
        ) : (
          <div className="border-2 border-dashed w-full border-gray-300 rounded-lg p-6 text-center mb-8">
            <div className=" mb-8 space-y-8 flex flex-col items-center">
              <div className="p-6 rounded-full bg-slate-200 w-fit ">
                <CloudUpload />
              </div>
              <div className="font-normal text-base">
                {isDragActive ? (
                  <p className="font-semibold ">Drop Files Here...</p>
                ) : (
                  <>
                    <p>
                      <span className="font-semibold ">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-[1.2rem] font-normal text-gray-400">
                      jpeg, png, jpg
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {preview && (
          <div className="flex justify-center mt-3">
            <Button
              variant={"outline"}
              className="font-semibold py-2 px-4 rounded-xl"
            >
              Browse files
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <Input
          value={newCategory.name}
          placeholder="Enter Category Name"
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />
        <Textarea
          value={newCategory.description}
          placeholder="Enter new Category Description"
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
        />
        <div className="flex justify-end">
          <Button isLoading={isLoading} onClick={handleAddCategory}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewCategoryForm;
