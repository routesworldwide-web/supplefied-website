import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Rating } from "react-simple-star-rating";
import DeleteReviews from "./delete-reviews";
import { useUpdateReviewMutation } from "@/redux/review/reviewApi";
import { notifyError, notifySuccess } from "@/utils/toast";

export type ReviewRow = {
  product: {
    _id: string;
    title: string;
    img: string;
  };
  review: {
    _id: string;
    userId?: {
      _id: string;
      name: string;
      email: string;
    };
    rating: number;
    comment?: string;
    status?: "Show" | "Hide";
    updatedAt: string;
    createdAt: string;
  };
};

const ReviewItem = ({
  item,
  isHighlighted = false,
}: {
  item: ReviewRow;
  isHighlighted?: boolean;
}) => {
  const { product, review } = item;
  const reviewStatus = review.status || "Show";
  const [updateReview, { isLoading }] = useUpdateReviewMutation();

  const handleVisibilityToggle = async () => {
    try {
      await updateReview({
        id: review._id,
        status: reviewStatus === "Show" ? "Hide" : "Show",
      }).unwrap();
      notifySuccess("Review visibility updated");
    } catch (error) {
      notifyError("Review could not be updated");
    }
  };

  return (
    <tr
      id={`review-${review._id}`}
      className={`border-b border-gray6 last:border-0 text-start transition-colors ${
        isHighlighted ? "bg-themeLight/60" : "bg-white"
      }`}
    >
      <td className="pr-5 py-5 align-middle">
        <div className="flex min-w-0 items-center gap-4">
          <Image
            className="h-[60px] w-[60px] shrink-0 rounded-md object-cover"
            src={product.img}
            alt="product-img"
            width={60}
            height={60}
          />
          <span className="min-w-0 break-words font-medium leading-5 text-heading">
            {product.title}
          </span>
        </div>
      </td>
      <td className="px-3 py-3 align-middle font-normal text-[#55585B]">
        <span className="block break-words font-medium leading-5 text-heading">
          {review.userId?.name || "Unknown user"}
        </span>
        {review.userId?.email && (
          <span className="mt-1 block break-all text-tiny leading-5">
            {review.userId.email}
          </span>
        )}
      </td>
      <td className="px-3 py-3 align-middle font-normal text-[#55585B]">
        <p className="mb-0 whitespace-normal break-words leading-5">
          {review.comment || "No review content"}
        </p>
      </td>
      <td className="px-3 py-3 align-middle font-normal text-heading text-end">
        <div className="flex items-center justify-end gap-1 whitespace-nowrap text-tiny">
          <span className="flex shrink-0 items-center text-yellow">
            <Rating
              allowFraction
              size={18}
              initialValue={review.rating}
              readonly={true}
            />
          </span>
          <span>{review.rating}</span>
        </div>
      </td>
      <td className="px-3 py-3 align-middle text-end">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleVisibilityToggle}
          className="inline-flex items-center gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            className={`relative inline-flex h-6 w-11 items-center rounded-full border border-black shadow-sm transition-colors duration-200 ${
              reviewStatus === "Show" ? "bg-success" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full border border-black bg-white shadow-md transition-transform duration-200 ${
                reviewStatus === "Show" ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </span>
          <span
            className={`text-[11px] font-medium ${
              reviewStatus === "Show" ? "text-success" : "text-[#55585B]"
            }`}
          >
            {reviewStatus === "Show" ? "Shown" : "Hidden"}
          </span>
        </button>
      </td>
      <td className="px-3 py-3 align-middle font-normal leading-5 text-[#55585B] text-end">
        {dayjs(review.updatedAt).format("MMM D, YYYY h:mm A")}
      </td>
      <td className="px-3 py-3 align-middle text-end">
        <DeleteReviews id={product._id} />
      </td>
    </tr>
  );
};

export default ReviewItem;
