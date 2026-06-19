"use client";
import React, { useMemo, useState } from "react";
import { useGetReviewProductsQuery } from "@/redux/product/productApi";
import { Search } from "@/svg";
import ErrorMsg from "../../common/error-msg";
import ReviewItem, { ReviewRow } from "./review-item";
import Pagination from "../../ui/Pagination";
import usePagination from "@/hooks/use-pagination";
import { useSearchParams } from "next/navigation";

const ReviewProductArea = () => {
  const { data: reviewProducts, isError, isLoading } = useGetReviewProductsQuery();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");
  const searchParams = useSearchParams();
  const targetedReviewId = searchParams.get("review");

  const reviewRows = useMemo<ReviewRow[]>(() => {
    return (reviewProducts?.data || []).flatMap((product) =>
      (product.reviews || []).map((review) => ({
        review,
        product: {
          _id: product._id,
          title: product.title,
          img: product.img,
        },
      }))
    );
  }, [reviewProducts?.data]);

  const filteredRows = useMemo(() => {
    let rows = [...reviewRows];

    if (searchValue) {
      const term = searchValue.toLowerCase();
      rows = rows.filter(({ product, review }) =>
        product.title.toLowerCase().includes(term) ||
        review.userId?.name?.toLowerCase().includes(term) ||
        review.comment?.toLowerCase().includes(term)
      );
    }

    if (selectValue) {
      rows = rows.filter(({ review }) => Math.floor(review.rating) === parseInt(selectValue));
    }

    if (targetedReviewId) {
      rows.sort((a, b) => {
        if (a.review._id === targetedReviewId) return -1;
        if (b.review._id === targetedReviewId) return 1;
        return 0;
      });
    }

    return rows;
  }, [reviewRows, searchValue, selectValue, targetedReviewId]);

  const paginationData = usePagination(filteredRows, 5);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  const handleSearchReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSelectField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value.slice(0, 1));
  };

  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && reviewRows.length === 0) {
    content = <ErrorMsg msg="No Review Found" />;
  }

  if (!isError && reviewProducts?.success && reviewRows.length > 0) {
    content = (
      <>
        <div className="tp-search-box flex items-center justify-between px-8 py-8 flex-wrap">
          <div className="search-input relative mb-5 md:mb-0 mr-3">
            <input
              onChange={handleSearchReview}
              className="input h-[44px] w-full pl-14"
              type="text"
              placeholder="Search by product, user, or review"
            />
            <button className="absolute top-1/2 left-5 translate-y-[-50%] hover:text-theme">
              <Search />
            </button>
          </div>
          <div className="flex sm:justify-end sm:space-x-6 flex-wrap">
            <div className="search-select mr-3 flex items-center space-x-3 ">
              <span className="text-tiny inline-block leading-none -translate-y-[2px]">
                Rating :{" "}
              </span>
              <select onChange={handleSelectField}>
                <option value="">All Ratings</option>
                <option value="5">5 Star</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star</option>
                <option value="2">2 Star</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>
        <div className="relative overflow-x-auto mx-8">
          <table className="w-full min-w-[1320px] table-fixed text-base text-left text-gray-500">
            <colgroup>
              <col className="w-[24%]" />
              <col className="w-[16%]" />
              <col className="w-[24%]" />
              <col className="w-[10%]" />
              <col className="w-[11%]" />
              <col className="w-[11%]" />
              <col className="w-[4%]" />
            </colgroup>
            <thead className="bg-white">
              <tr className="border-b border-gray6 text-tiny">
                <th scope="col" className="pr-5 py-3 text-tiny text-text2 uppercase font-semibold">
                  Product
                </th>
                <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">
                  Reviewed By
                </th>
                <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">
                  Review Content
                </th>
                <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end">
                  Rating
                </th>
                <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end">
                  Visibility
                </th>
                <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end">
                  Date
                </th>
                <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <ReviewItem
                  key={item.review._id}
                  item={item}
                  isHighlighted={item.review._id === targetedReviewId}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center flex-wrap mx-8">
          <p className="mb-0 text-tiny mr-3">
            Showing {currentItems.length} of {filteredRows.length}
          </p>
          <div className="pagination py-3 flex justify-end items-center mr-8 pagination">
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-4">
      {content}
    </div>
  );
};

export default ReviewProductArea;
