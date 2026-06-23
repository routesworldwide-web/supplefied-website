'use client';
import React, { useEffect, useState } from "react";
import { getProductDetailsUrl } from "@/utils/product-url";

const DetailsBottomInfo = ({ product }) => {
  const { _id, sku, category, tags, title } = product || {};
  const [productUrl, setProductUrl] = useState("");
  const shareText = `${title || "Product"} - ${productUrl}`;
  const encodedUrl = encodeURIComponent(productUrl);
  const encodedText = encodeURIComponent(shareText);

  useEffect(() => {
    if (_id) {
      setProductUrl(`${window.location.origin}${getProductDetailsUrl(product)}`);
    }
  }, [_id, product]);

  const handleInstagramShare = async (e) => {
    e.preventDefault();

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: shareText,
          url: productUrl,
        });
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }

      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    } catch {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {/* product-details-query */}
      <div className="tp-product-details-query">
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>SKU: </span>
          <p>{sku}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>Category: </span>
          <p>{category?.name}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>Tag: </span>
          <p>{tags?.[0]}</p>
        </div>
      </div>

      {/*  product-details-social*/}

      <div className="tp-product-details-social">
        <span>Share: </span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <i className="fa-brands fa-facebook"></i>
        </a>
        <a
          href={`https://wa.me/?text=${encodedText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
        >
          <i className="fa-brands fa-whatsapp"></i>
        </a>
        <a
          href="https://www.instagram.com/"
          onClick={handleInstagramShare}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Instagram"
        >
          <i className="fa-brands fa-instagram"></i>
        </a>
       
      </div>

      {/* product-details-msg */}

      <div className="tp-product-details-msg mb-15">
        <ul>
         <li>100% genuine products from trusted brands</li>
<li>Fast dispatch with safe, secure packaging</li>
<li>Secure payments and reliable order support</li>
        </ul>
      </div>
      {/* product-details-payment */}
      {/* <div className="tp-product-details-payment d-flex align-items-center flex-wrap justify-content-between">
        <p>
          Guaranteed safe <br /> & secure checkout
        </p>
        <Image src={payment_option_img} alt="payment_option_img" />
      </div> */}
    </>
  );
};

export default DetailsBottomInfo;
