'use client';
import React, { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
// internal
import { AskQuestion, CompareTwo, WishlistTwo } from '@/svg';
import DetailsBottomInfo from './details-bottom-info';
import ProductDetailsCountdown from './product-details-countdown';
import ProductQuantity from './product-quantity';
import { add_cart_product } from '@/redux/features/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist-slice';
import { add_to_compare } from '@/redux/features/compareSlice';
import { handleModalClose } from '@/redux/features/productModalSlice';
import { getProductDetailsUrl } from '@/utils/product-url';
import ProductPrice from '@/components/common/product-price';

const DetailsWrapper = ({ productItem, handleImageActive, activeImg, detailsBottom = false }) => {
  const { title, category, description, status, reviews, offerDate } = productItem || {};
  const [ratingVal, setRatingVal] = useState(0);
  const [textMore, setTextMore] = useState(false);
  const [productUrl, setProductUrl] = useState("");
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const dispatch = useDispatch()
  const router = useRouter();
  const whatsappQuery = encodeURIComponent(
    `Hi, I have a question about ${title || "this product"}. ${productUrl}`
  );
  const whatsappUrl = `https://wa.me/918796200495?text=${whatsappQuery}`;

  useEffect(() => {
    if (productItem?._id) {
      setProductUrl(`${window.location.origin}${getProductDetailsUrl(productItem)}`);
    }
  }, [productItem]);

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

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };

  // handle buy now product
  const handleBuyNow = async (prd) => {
    if (!prd || status === 'out-of-stock' || isBuyingNow) return;

    setIsBuyingNow(true);

    try {
      await dispatch(add_cart_product(prd)).unwrap();
      dispatch(handleModalClose());
      router.push('/checkout');
    } finally {
      setIsBuyingNow(false);
    }
  };

  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  // handle compare product
  const handleCompareProduct = (prd) => {
    dispatch(add_to_compare(prd));
  };

  return (
    <div className="tp-product-details-wrapper">
      <div className="tp-product-details-category">
        <span>{category.name}</span>
      </div>
      <h3 className="tp-product-details-title">{title}</h3>

      {/* inventory details */}
      <div className="tp-product-details-inventory d-flex align-items-center mb-10">
        <div className="tp-product-details-stock mb-10">
          <span>{status}</span>
        </div>
        <div className="tp-product-details-rating-wrapper d-flex align-items-center mb-10">
          <div className="tp-product-details-rating">
            <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
          </div>
          <div className="tp-product-details-reviews">
            <span>({reviews && reviews.length > 0 ? reviews.length : 0} Review)</span>
          </div>
        </div>
      </div>
      <p>{textMore ? description : `${description.substring(0, 100)}...`}
        <span onClick={() => setTextMore(!textMore)}>{textMore ? 'See less' : 'See more'}</span>
      </p>

      {/* price */}
      <div className="tp-product-details-price-wrapper mb-20">
        <ProductPrice product={productItem} priceClassName="tp-product-details-price" />
      </div>

      {/* if ProductDetailsCountdown true start */}
      {offerDate?.endDate && <ProductDetailsCountdown offerExpiryTime={offerDate?.endDate} />}
      {/* if ProductDetailsCountdown true end */}

      {/* actions */}
      <div className="tp-product-details-action-wrapper">
        <h3 className="tp-product-details-action-title">Quantity</h3>
        <div className="tp-product-details-action-item-wrapper d-sm-flex align-items-center">
          {/* product quantity */}
          <ProductQuantity />
          {/* product quantity */}
          <div className="tp-product-details-add-to-cart mb-15 w-100">
            <button onClick={() => handleAddProduct(productItem)} disabled={status === 'out-of-stock'} className="tp-product-details-add-to-cart-btn w-100">Add To Cart</button>
          </div>
        </div>
        <button
          onClick={() => handleBuyNow(productItem)}
          disabled={status === 'out-of-stock' || isBuyingNow}
          className="tp-product-details-buy-now-btn w-100"
        >
          {isBuyingNow ? 'Processing...' : 'Buy Now'}
        </button>
      </div>
      {/* product-details-action-sm start */}
      <div className="tp-product-details-action-sm">
        <button disabled={status === 'out-of-stock'} onClick={() => handleCompareProduct(productItem)} type="button" className="tp-product-details-action-sm-btn">
          <CompareTwo />
          Compare
        </button>
        <button disabled={status === 'out-of-stock'} onClick={() => handleWishlistProduct(productItem)} type="button" className="tp-product-details-action-sm-btn">
          <WishlistTwo />
          Add Wishlist
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tp-product-details-action-sm-btn"
        >
          <AskQuestion />
          Ask a question
        </a>
      </div>
      {/* product-details-action-sm end */}

      {detailsBottom && <DetailsBottomInfo product={productItem} />}
    </div>
  );
};

export default DetailsWrapper;
