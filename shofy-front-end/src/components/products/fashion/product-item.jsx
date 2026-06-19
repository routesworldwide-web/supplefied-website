import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
// internal
import { Cart, CompareThree, QuickView, Wishlist } from "@/svg";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { getProductDetailsUrl } from "@/utils/product-url";
import ProductPrice from "@/components/common/product-price";
import useProductCardActions from "@/hooks/use-product-card-actions";

const ProductItem = ({ product, style_2 = false }) => {
  const { img, title, reviews, tags, status } = product || {};
  const productUrl = getProductDetailsUrl(product);
  const [ratingVal, setRatingVal] = useState(0);
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
    <div className={`tp-product-item-2 ${style_2 ? "" : "mb-40"}`}>
      <div className="tp-product-thumb-2 p-relative z-index-1 fix">
        <Link href={productUrl}>
          <Image
            src={img}
            alt="product img"
            width={284}
            height={302}
          />
        </Link>
        <div className="tp-product-badge">
          {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
        </div>
        {/* product action */}
        <div className="tp-product-action-2 tp-product-action-blackStyle">
          <div className="tp-product-action-item-2 d-flex flex-column">
            <button
              type="button"
              onClick={addToCart}
              className={`tp-product-action-btn-2 ${isInCart ? 'active' : ''} tp-product-add-cart-btn`}
              disabled={status === 'out-of-stock'}
            >
              <Cart />
              <span className="tp-product-tooltip tp-product-tooltip-right">{cartLabel}</span>
            </button>
            <button
              onClick={() => dispatch(handleProductModal(product))}
              className="tp-product-action-btn-2 tp-product-quick-view-btn"
            >
              <QuickView />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Quick View
              </span>
            </button>
            <button disabled={status === 'out-of-stock'} onClick={toggleWishlist} className={`tp-product-action-btn-2 ${isInWishlist ? 'active' : ''} tp-product-add-to-wishlist-btn`}>
              <Wishlist />
              <span className="tp-product-tooltip tp-product-tooltip-right">{wishlistLabel}</span>
            </button>
            <button disabled={status === 'out-of-stock'} onClick={toggleCompare} className={`tp-product-action-btn-2 ${isInCompare ? 'active' : ''} tp-product-add-to-compare-btn`}>
              <CompareThree />
              <span className="tp-product-tooltip tp-product-tooltip-right">{compareLabel}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="tp-product-content-2 pt-15">
        <div className="tp-product-tag-2">
          {tags.map((t, i) => (
            <a key={i} href="#">
              {t}
              {i < tags.length - 1 && ","}
            </a>
          ))}
        </div>
        <h3 className="tp-product-title-2">
          <Link href={productUrl}>{title}</Link>
        </h3>
        <div className="tp-product-rating-icon tp-product-rating-icon-2">
          <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
        </div>
        <div className="tp-product-price-wrapper-2">
          <ProductPrice product={product} priceClassName="tp-product-price-2" />
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
