import { CloudUpload, Pen, Trash2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback, useContext, useEffect, useState } from "react";
import { FC } from "react";
import { Button } from "@/components/ui/Button";

import Image from "next/image";
import { ProductFileContext } from "@/context/productFile";

interface UploadImgAreaProps {
  imageURL?: string | null;
  name: "main" | "right" | "left" | "extra";
}

const UploadImgArea: FC<UploadImgAreaProps> = ({ imageURL, name }) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const productImageContext = useContext(ProductFileContext);
  if (!productImageContext) {
    throw new Error("ProductFileContext is undefined");
  }

  const { productImageState, updateProductImageState } = productImageContext;

  useEffect(() => {
    if (imageURL) {
      setPreview(imageURL);
    }
  }, [imageURL]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = new FileReader();

      file.onload = function () {
        setPreview(file.result);
      };

      file.readAsDataURL(acceptedFiles[0]);

      return updateProductImageState({
        type: "update",
        payload: {
          ...productImageState,
          [name]: {
            image: acceptedFiles[0],
            imageUrl: preview,
          },
        },
      });
    },
    [name, preview, productImageState]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div className="flex gap-12 items-center ">
      <div className=" border p-6 flex flex-col overflow-hidden rounded-xl items-center justify-center w-[15rem] h-[10rem] ">
        <div {...getRootProps()} className="">
          <div className="flex justify-center items-center">
            {preview ? (
              <Image
                width={150}
                height={100}
                className="object-cover object-center w-full h-full"
                src={preview as string}
                alt="Product Image"
              />
            ) : (
              <div className="border rounded-xl p-3">
                <CloudUpload />
              </div>
            )}
          </div>

          <input
            {...getInputProps()}
            accept="image/png, image/jpeg, image/svg, image/jpg"
          />
          {isDragActive ? (
            <p className="font-semibold ">Drop Files Here...</p>
          ) : (
            !preview && (
              <>
                <Button
                  type="button"
                  variant={"ghost"}
                  className="text-[1.2rem] p-0 h-fit m-0 text-green-500"
                >
                  Click to upload
                </Button>
                <p className="text-[1rem] text-center font-normal text-gray-400">
                  or drag and drop
                </p>
              </>
            )
          )}
        </div>
      </div>
      {preview && (
        <div className="flex gap-4 items-center">
          <Button {...getRootProps()} variant={"ghost"}>
            <Pen size={18} />
          </Button>
          <Button
            onClick={() => {
              setPreview("");
            }}
            variant={"ghost"}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadImgArea;
