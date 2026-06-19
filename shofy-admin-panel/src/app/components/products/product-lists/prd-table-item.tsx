import Image from "next/image";
import React from "react";
import { IProduct } from "@/types/product-type";
import { Rating } from "react-simple-star-rating";
import EditDeleteBtn from "../../button/edit-delete-btn";
import { useEditProductMutation } from "@/redux/product/productApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import { formatPrice, getProductPricing } from "@/utils/pricing";

const ProductTableItem = ({ product }: { product: IProduct }) => {
  const { _id, title, reviews, status, quantity, featured } = product || {};
  const [editProduct, { isLoading: isUpdating }] = useEditProductMutation();
  const pricing = getProductPricing(product);

  const averageRating =
    reviews && reviews?.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  const handleProductToggle = async (
    data: Partial<IProduct>,
    successMessage: string
  ) => {
    try {
      await editProduct({ id: _id, data }).unwrap();
      notifySuccess(successMessage);
    } catch (error) {
      notifyError("Product could not be updated");
    }
  };

  const handleStockToggle = () => {
    const nextStatus = status === "in-stock" ? "out-of-stock" : "in-stock";
    handleProductToggle({ status: nextStatus }, "Product stock status updated");
  };

  const handleFeaturedToggle = () => {
    handleProductToggle({ featured: !featured }, "Product featured status updated");
  };

  return (
    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
      <td className="pr-8 py-5 whitespace-nowrap">
        <a href="#" className="flex items-center space-x-5">
          <Image
            className="w-[60px] h-[60px] rounded-md object-cover bg-[#F2F3F5]"
            src={product.img}
            width={60}
            height={60}
            alt="product img"
          />
          <span className="font-medium text-heading text-hover-primary transition">
            {title}
          </span>
        </a>
      </td>

      <td className="px-3 py-3 font-normal text-[#55585B] text-end">
        {quantity}
      </td>

      <td className="px-3 py-3 font-normal text-[#55585B] text-end">
        <span className="font-semibold text-heading">
          {formatPrice(pricing.discountedPrice)}
        </span>
      </td>

      <td className="px-3 py-3 font-normal text-[#55585B] text-end">
        <span className={pricing.hasDiscount ? "line-through text-[#9CA3AF]" : ""}>
          {formatPrice(pricing.originalPrice)}
        </span>
        {pricing.hasDiscount && (
          <span className="ml-2 text-[11px] font-medium text-success">
            {pricing.discountPercent}% off
          </span>
        )}
      </td>

      <td className="px-3 py-3 font-normal text-heading text-end">
        <div className="flex justify-end items-center space-x-1 text-tiny">
          <span className="text-yellow flex items-center space-x-1">
            <Rating
              allowFraction
              size={18}
              initialValue={averageRating}
              readonly={true}
            />
          </span>
        </div>
      </td>

      <td className="px-3 py-3 text-end">
        <button
          type="button"
          disabled={isUpdating}
          onClick={handleStockToggle}
          className="inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span
            className={`relative inline-flex h-6 w-11 items-center rounded-full border border-black shadow-sm transition-colors duration-200 ${
              status === "in-stock" ? "bg-success" : "bg-danger"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full border border-black bg-white shadow-md transition-transform duration-200 ${
                status === "in-stock" ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </span>
          <span
            className={`text-[11px] font-medium ${
              status === "in-stock" ? "text-success" : "text-danger"
            }`}
          >
            {status === "in-stock" ? "In stock" : "Out of stock"}
          </span>
        </button>
      </td>

      <td className="px-3 py-3 text-end">
        <button
          type="button"
          disabled={isUpdating}
          onClick={handleFeaturedToggle}
          className="inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span
            className={`relative inline-flex h-6 w-11 items-center rounded-full border border-black shadow-sm transition-colors duration-200 ${
              featured ? "bg-success" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full border border-black bg-white shadow-md transition-transform duration-200 ${
                featured ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </span>
          <span
            className={`text-[11px] font-medium ${
              featured ? "text-success" : "text-[#55585B]"
            }`}
          >
            {featured ? "Featured" : "Not featured"}
          </span>
        </button>
      </td>

      <td className="px-9 py-3 text-end">
        <div className="flex items-center justify-end space-x-2">
          <EditDeleteBtn id={_id} />
        </div>
      </td>
    </tr>
  );
};

export default ProductTableItem;
