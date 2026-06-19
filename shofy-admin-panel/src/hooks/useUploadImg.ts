import { useUploadImageMutation } from "@/redux/cloudinary/cloudinaryApi";
import { notifyError } from "@/utils/toast";

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const useUploadImage = () => {
  const [uploadImage, { data: uploadData, isError, isLoading, error }] =
    useUploadImageMutation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        notifyError("Only JPG, PNG, or WEBP images are allowed");
        e.target.value = "";
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        notifyError("Image size must be 3MB or less");
        e.target.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      uploadImage(formData);
    }
  };
  

  return {
    handleImageUpload,
    uploadData,
    isError,
    isLoading,
    error,
  };
};

export default useUploadImage;
