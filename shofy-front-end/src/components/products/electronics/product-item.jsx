import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
// internal
import { Cart, CompareThree, QuickView, Wishlist } from "@/svg";
import Timer from "@/components/common/timer";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { getProductDetailsUrl } from "@/utils/product-url";
import ProductPrice from "@/components/common/product-price";
import useProductCardActions from "@/hooks/use-product-card-actions";

const ProductItem = ({ product, offer_style = false }) => {
  const { img, category, title, reviews, status, offerDate } = product || {};
  const productUrl = getProductDetailsUrl(product);
  const dispatch = useDispatch();
  const {
    isInCart,
    isInWishlist,
    isInCompare,
    cartLabel,
    wishlistLabel,
    compareLabel,
    addToCart,
    toggleWishlist,
    toggleCompare,
  } = useProductCardActions(product);
  const [ratingVal, setRatingVal] = useState(0);
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

  return (
    <>
      <div
        className={`${offer_style ? "tp-product-offer-item" : "mb-25"
          } tp-product-item transition-3`}
      >
        <div className="tp-product-thumb p-relative fix">
          <Link href={productUrl}>
            <Image
              src={img}
              width="0"
              height="0"
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
              alt={title || "product"}
            />

            <div className="tp-product-badge">
              {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
            </div>
          </Link>

          {/*  product action */}
          <div className="tp-product-action">
            <div className="tp-product-action-item d-flex flex-column">
              <button
                onClick={addToCart}
                type="button"
                className={`tp-product-action-btn ${isInCart ? 'active' : ''} tp-product-add-cart-btn`}
                disabled={status === 'out-of-stock'}
              >
                <Cart />
                <span className="tp-product-tooltip">{cartLabel}</span>
              </button>
              <button
                onClick={() => dispatch(handleProductModal(product))}
                type="button"
                className="tp-product-action-btn tp-product-quick-view-btn"
              >
                <QuickView />

                <span className="tp-product-tooltip">Quick View</span>
              </button>
              <button
                type="button"
                className={`tp-product-action-btn ${isInWishlist ? 'active' : ''} tp-product-add-to-wishlist-btn`}
                onClick={toggleWishlist}
                disabled={status === 'out-of-stock'}
              >
                <Wishlist />
                <span className="tp-product-tooltip">{wishlistLabel}</span>
              </button>
              <button
                type="button"
                className={`tp-product-action-btn ${isInCompare ? 'active' : ''} tp-product-add-to-compare-btn`}
                onClick={toggleCompare}
                disabled={status === 'out-of-stock'}
              >
                <CompareThree />
                <span className="tp-product-tooltip">{compareLabel}</span>
              </button>
            </div>
          </div>
        </div>
        {/*  product content */}
        <div className="tp-product-content">
          <div className="tp-product-category">
            <a href="#">{category?.name}</a>
          </div>
          <h3 className="tp-product-title">
            <Link href={productUrl}>{title}</Link>
          </h3>
          <div className="tp-product-rating d-flex align-items-center">
            <div className="tp-product-rating-icon">
              <Rating
                allowFraction
                size={16}
                initialValue={ratingVal}
                readonly={true}
              />
            </div>
            <div className="tp-product-rating-text">
              <span>
                ({reviews && reviews.length > 0 ? reviews.length : 0} Review)
              </span>
            </div>
          </div>
          <div className="tp-product-price-wrapper">
            <ProductPrice product={product} />
          </div>
          {offer_style && offerDate?.endDate && !dayjs().isAfter(offerDate.endDate) && (
            <div className="tp-product-countdown">
              <div className="tp-product-countdown-inner">
                <Timer expiryTimestamp={new Date(offerDate.endDate)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductItem;
