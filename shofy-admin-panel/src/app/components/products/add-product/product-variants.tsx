import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Drug, SmClose } from "@/svg";
import Loading from "../../common/loading";
import { ImageURL } from "@/hooks/useProductSubmit";
import { useUploadImageMutation } from "@/redux/cloudinary/cloudinaryApi";
import { notifyError } from "@/utils/toast";

const MAX_GALLERY_IMAGES = 5;
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type IPropType = {
  isSubmitted: boolean;
  setImageURLs: React.Dispatch<React.SetStateAction<ImageURL[]>>;
  default_value?: ImageURL[];
};

const ProductImages = ({
  isSubmitted,
  setImageURLs,
  default_value,
}: IPropType) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasLoadedDefault = useRef(false);
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [galleryImages, setGalleryImages] = useState<ImageURL[]>(
    default_value?.filter((item) => item?.img).slice(0, MAX_GALLERY_IMAGES) || []
  );

  useEffect(() => {
    if (default_value && !hasLoadedDefault.current) {
      const defaultImages = default_value
        .filter((item) => item?.img)
        .slice(0, MAX_GALLERY_IMAGES);
      setGalleryImages(defaultImages);
      setImageURLs(defaultImages);
      hasLoadedDefault.current = true;
    }
  }, [default_value, setImageURLs]);

  useEffect(() => {
    if (isSubmitted) {
      setGalleryImages([]);
      setImageURLs([]);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [isSubmitted, setImageURLs]);

  const validateImage = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      notifyError("Only JPG, PNG, or WEBP images are allowed");
      return false;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      notifyError("Image size must be 3MB or less");
      return false;
    }

    return true;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!validateImage(file)) {
      e.target.value = "";
      return;
    }

    if (galleryImages.length >= MAX_GALLERY_IMAGES) {
      notifyError(`You can upload maximum ${MAX_GALLERY_IMAGES} product images`);
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const result = await uploadImage(formData);

    if ("data" in result && result.data?.data?.url) {
      const updatedImages = [
        ...galleryImages,
        { img: result.data.data.url },
      ].slice(0, MAX_GALLERY_IMAGES);
      setGalleryImages(updatedImages);
      setImageURLs(updatedImages);
    } else {
      notifyError("Image upload failed");
    }

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
    setImageURLs(updatedImages);
  };

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h4 className="text-[22px] mb-0">Product Images</h4>
          <span className="text-tiny leading-4">
            Add up to {MAX_GALLERY_IMAGES} extra product images. Maximum size 3MB each.
          </span>
        </div>
        <div>
          <input
            ref={inputRef}
            onChange={handleImageUpload}
            type="file"
            name="product_gallery_image"
            id="product_gallery_image"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            disabled={isLoading}
          />
          <label
            htmlFor="product_gallery_image"
            className="border-2 border-gray6 dark:border-gray-600 border-dashed rounded-md cursor-pointer flex items-center justify-center h-[44px] w-[120px] hover:bg-slate-100 transition-all linear ease"
          >
            {isLoading ? (
              <Loading loading={isLoading} spinner="scale" />
            ) : (
              <span className="mx-auto flex justify-center">
                <Drug />
              </span>
            )}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {galleryImages.map((item, index) => (
          <div key={`${item.img}-${index}`} className="relative">
            <Image
              className="w-full h-[120px] object-contain border rounded-md border-gray6 p-2"
              src={item.img}
              alt={`product gallery ${index + 1}`}
              width={160}
              height={120}
            />
            <button
              onClick={() => handleRemoveImage(index)}
              type="button"
              className="absolute -top-3 -right-3 text-red-500 focus:outline-none"
              aria-label="Remove product image"
            >
              <SmClose />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
