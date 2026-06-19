"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  useAddBannerMutation,
  useDeleteBannerMutation,
  useGetAllBannersQuery,
  useUpdateBannerMutation,
} from "@/redux/banner/bannerApi";
import {
  BannerPlacement,
  BannerStatus,
  IBanner,
} from "@/types/banner-type";
import { notifyError, notifySuccess } from "@/utils/toast";

const MAX_BANNER_SIZE = 4 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const PLACEMENT_OPTIONS: { value: BannerPlacement; label: string; size: string }[] = [
  { value: "home-hero-slider", label: "Home Page Hero Slider", size: "Top Supplefied hero slider. Recommended: full-width hero banner image." },
  { value: "home-banner-section-1", label: "Home Promo Banner - Large", size: "Homepage promo row, left large banner. Recommended: wide banner." },
  { value: "home-banner-section-2", label: "Home Promo Banner - Small", size: "Homepage promo row, right small banner. Recommended: compact banner." },
  { value: "product-gadget-banner", label: "Product Section Slider Banner", size: "Homepage product section carousel banner." },
  { value: "product-gadget-sidebar", label: "Product Section Sidebar Image", size: "Homepage product section left sidebar image." },
  { value: "product-banner-slider", label: "Home Featured Product Slider", size: "Full-width featured product slider near the bottom of the homepage." },
];

const getPlacementLabel = (value: BannerPlacement) => {
  return PLACEMENT_OPTIONS.find((option) => option.value === value)?.label || value;
};

const isSafeRedirectLink = (value: string) => {
  return value.startsWith("/") && !value.startsWith("//") && !value.toLowerCase().includes("javascript:");
};

const validateBannerFile = (file: File) => {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(file.type) || !ALLOWED_EXTENSIONS.includes(extension)) {
    return "Only JPG, PNG, or WEBP images are allowed";
  }

  if (file.size > MAX_BANNER_SIZE) {
    return "Banner image must be 4MB or smaller";
  }

  return "";
};

const BannerArea = () => {
  const { data, isError, isLoading } = useGetAllBannersQuery();
  const [addBanner, { isLoading: isAdding }] = useAddBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();
  const [title, setTitle] = useState("");
  const [placement, setPlacement] = useState<BannerPlacement>("home-hero-slider");
  const [redirectLink, setRedirectLink] = useState("/shop");
  const [sortOrder, setSortOrder] = useState("0");
  const [status, setStatus] = useState<BannerStatus>("active");
  const [image, setImage] = useState<File | null>(null);

  const placementHelp = useMemo(
    () => PLACEMENT_OPTIONS.find((option) => option.value === placement)?.size,
    [placement]
  );

  const resetForm = () => {
    setTitle("");
    setPlacement("home-hero-slider");
    setRedirectLink("/shop");
    setSortOrder("0");
    setStatus("active");
    setImage(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const error = validateBannerFile(file);

    if (error) {
      notifyError(error);
      event.target.value = "";
      return;
    }

    setImage(file);
  };

  const handleAddBanner = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) {
      return notifyError("Please upload a banner image");
    }

    if (!isSafeRedirectLink(redirectLink)) {
      return notifyError("Redirect link must be an internal link like /shop");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("placement", placement);
    formData.append("redirectLink", redirectLink);
    formData.append("sortOrder", sortOrder);
    formData.append("status", status);
    formData.append("image", image);

    const result = await addBanner(formData);

    if ("error" in result) {
      const errorData = result.error as { data?: { message?: string } };
      return notifyError(errorData.data?.message || "Banner could not be added");
    }

    notifySuccess(result.data.message);
    resetForm();
  };

  const handleStatusChange = async (banner: IBanner, nextStatus: BannerStatus) => {
    const formData = new FormData();
    formData.append("status", nextStatus);

    const result = await updateBanner({ id: banner._id, data: formData });

    if ("error" in result) {
      const errorData = result.error as { data?: { message?: string } };
      return notifyError(errorData.data?.message || "Banner status could not be updated");
    }

    notifySuccess(result.data.message);
  };

  const handleDelete = (banner: IBanner) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete this banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const response = await deleteBanner(banner._id);

      if ("error" in response) {
        const errorData = response.error as { data?: { message?: string } };
        return notifyError(errorData.data?.message || "Banner could not be deleted");
      }

      notifySuccess(response.data.message);
    });
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-4">
        <form onSubmit={handleAddBanner} className="bg-white rounded-md p-6">
          <h4 className="text-xl mb-5">Add Website Banner</h4>
          <div className="mb-4">
            <p className="mb-1 text-base text-black">Admin Title</p>
            <input
              className="input w-full h-[44px] rounded-md border border-gray6 px-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Summer protein hero slide"
              maxLength={120}
            />
          </div>
          <div className="mb-4">
            <p className="mb-1 text-base text-black">Where should this banner appear?</p>
            <select
              className="input w-full h-[44px] rounded-md border border-gray6 px-4"
              value={placement}
              onChange={(e) => setPlacement(e.target.value as BannerPlacement)}
            >
              {PLACEMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-tiny mt-1 mb-0">{placementHelp}</p>
          </div>
          <div className="mb-4">
            <p className="mb-1 text-base text-black">Click Destination</p>
            <input
              className="input w-full h-[44px] rounded-md border border-gray6 px-4"
              value={redirectLink}
              onChange={(e) => setRedirectLink(e.target.value)}
              placeholder="/shop"
              required
            />
            <p className="text-tiny mt-1 mb-0">Use internal links only, for example /shop or /product-details/product-slug.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="mb-1 text-base text-black">Sort Order</p>
              <input
                className="input w-full h-[44px] rounded-md border border-gray6 px-4"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
            <div>
              <p className="mb-1 text-base text-black">Status</p>
              <select
                className="input w-full h-[44px] rounded-md border border-gray6 px-4"
                value={status}
                onChange={(e) => setStatus(e.target.value as BannerStatus)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mb-5">
            <p className="mb-1 text-base text-black">Upload Image</p>
            <input
              className="input w-full rounded-md border border-gray6 p-3"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />
            <p className="text-tiny mt-1 mb-0">JPG, PNG, or WEBP only. Maximum size 4MB. SVG is not allowed.</p>
          </div>
          <button disabled={isAdding} className="tp-btn h-[44px] justify-center w-full" type="submit">
            {isAdding ? "Adding..." : "Add Website Banner"}
          </button>
        </form>
      </div>

      <div className="col-span-12 xl:col-span-8">
        <div className="bg-white rounded-md p-6">
          <h4 className="text-xl mb-5">Current Website Banners</h4>
          {isLoading && <p>Loading...</p>}
          {isError && <p>Unable to load banners.</p>}
          {!isLoading && !isError && data?.data.length === 0 && <p>No banners uploaded yet.</p>}
          <div className="space-y-4">
            {data?.data.map((banner) => (
              <div key={banner._id} className="border border-gray6 rounded-md p-4 flex gap-4 items-center">
                <Image
                  src={banner.image}
                  alt={banner.title || getPlacementLabel(banner.placement)}
                  width={160}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h5 className="text-base text-black mb-1">{banner.title || getPlacementLabel(banner.placement)}</h5>
                  <p className="mb-1 text-tiny">{getPlacementLabel(banner.placement)}</p>
                  <p className="mb-1 text-tiny">Link: {banner.redirectLink}</p>
                  <p className="mb-0 text-tiny">Status: {banner.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(banner, banner.status === "active" ? "inactive" : "active")}
                    className="h-10 px-3 text-tiny bg-warning text-white rounded-md"
                  >
                    {banner.status === "active" ? "Disable" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner)}
                    className="h-10 px-3 text-tiny bg-danger text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerArea;
