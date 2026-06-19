'use client';
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { formatPrice, getLineTotal } from "@/utils/pricing";

const CartCheckout = () => {
  const { cart_products } = useSelector((state) => state.cart);
  const productCount = cart_products.reduce(
    (count, product) => count + Number(product?.orderQuantity || 0),
    0
  );
  const cartTotal = cart_products.reduce(
    (total, product) => total + getLineTotal(product),
    0
  );

  return (
    <div className="tp-cart-checkout-wrapper">
      <div className="tp-cart-checkout-top d-flex align-items-center justify-content-between">
        <span className="tp-cart-checkout-top-title">
          Cart Summary  
          {/* <span className="tp-cart-checkout-top-count">({productCount} items)</span> */}
        </span>
        {/* <span className="tp-cart-checkout-top-price">{formatPrice(cartTotal)}</span> */}
      </div>

      <div className="tp-cart-checkout-shipping">
        <h4 className="tp-cart-checkout-shipping-title">Products</h4>
        <div className="tp-cart-checkout-shipping-option-wrapper">
          {cart_products.map((product) => (
            <div
              key={product._id || product.productId}
              className="tp-cart-checkout-shipping-option d-flex justify-content-between gap-3"
            >
              <span>
                {product.title} x {Number(product.orderQuantity || 0)}
              </span>
              <span>{formatPrice(getLineTotal(product))}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-cart-checkout-total d-flex align-items-center justify-content-between">
        <span>Total</span>
        <span>{formatPrice(cartTotal)}</span>
      </div>

      <div className="tp-cart-checkout-proceed">
        <Link href="/checkout" className="tp-cart-checkout-btn w-100">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartCheckout;
