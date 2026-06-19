'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductDetailsUrl } from "@/utils/product-url";
import { useDispatch, useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
// internal
import { add_cart_product } from "@/redux/features/cartSlice";
import { remove_compare_product } from "@/redux/features/compareSlice";
import ProductPrice from "@/components/common/product-price";
import { getProductTypeLabel } from "@/utils/product-type-label";

const getRatingValue = (reviews = []) => {
  if (!reviews.length) return 0;
  return reviews.reduce((acc, review) => acc + Number(review.rating || 0), 0) / reviews.length;
};

const getStockLabel = (item) => {
  if (item?.status === "out-of-stock" || Number(item?.quantity || 0) <= 0) {
    return "Out of stock";
  }

  if (item?.status === "discontinued") {
    return "Discontinued";
  }

  return `In stock${item?.quantity ? ` (${item.quantity})` : ""}`;
};

const getValue = (value, fallback = "-") => value || fallback;

const AdditionalInfo = ({ item }) => {
  const info = item?.additionalInformation || [];

  if (!info.length) {
    return <span>-</span>;
  }

  return (
    <ul className="mb-0 ps-3 text-start">
      {info.map((field, index) => (
        <li key={`${field.key || "info"}-${index}`}>
          <strong>{field.key || "Info"}:</strong> {field.value || "-"}
        </li>
      ))}
    </ul>
  );
};

const CompareArea = () => {
  const { compareItems } = useSelector((state) => state.compare);
  const dispatch = useDispatch();

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
  // handle add product
  const handleRemoveComparePrd = (prd) => {
    dispatch(remove_compare_product(prd));
  };

  return (
    <>
      <section className="tp-compare-area pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              {compareItems.length === 0 && (
                <div className="text-center pt-50">
                  <h3>No Compare Items Found</h3>
                  <Link href="/shop" className="tp-cart-checkout-btn mt-20">
                    Continue Shopping
                  </Link>
                </div>
              )}
              {compareItems.length > 0 && (
                <div className="tp-compare-table table-responsive text-center">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Product</th>
                        {compareItems.map(item => (
                          <td key={item._id} className="">
                            <div className="tp-compare-thumb">
                              <Image
                                src={item.img}
                                alt="compare"
                                width={205}
                                height={176}
                              />
                              <h4 className="tp-compare-product-title">
                                <Link href={getProductDetailsUrl(item)}>
                                  {item.title}
                                </Link>
                              </h4>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Description */}
                      <tr>
                        <th>Description</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-desc">
                              <p>{getValue(item.description)}</p>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Price */}
                      <tr>
                        <th>Price</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-price">
                              <ProductPrice product={item} priceClassName="tp-compare-price" />
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Brand */}
                      <tr>
                        <th>Brand</th>
                        {compareItems.map(item => (
                          <td key={item._id}>{getValue(item.brand?.name)}</td>
                        ))}
                      </tr>
                      {/* Category */}
                      <tr>
                        <th>Category</th>
                        {compareItems.map(item => (
                          <td key={item._id}>{getValue(item.category?.name)}</td>
                        ))}
                      </tr>
                      {/* Product type */}
                      <tr>
                        <th>Product Type</th>
                        {compareItems.map(item => (
                          <td key={item._id} className="text-capitalize">{getValue(getProductTypeLabel(item.productType))}</td>
                        ))}
                      </tr>
                      {/* SKU */}
                      <tr>
                        <th>SKU</th>
                        {compareItems.map(item => (
                          <td key={item._id}>{getValue(item.sku)}</td>
                        ))}
                      </tr>
                      {/* Unit */}
                      <tr>
                        <th>Unit</th>
                        {compareItems.map(item => (
                          <td key={item._id}>{getValue(item.unit)}</td>
                        ))}
                      </tr>
                      {/* Availability */}
                      <tr>
                        <th>Availability</th>
                        {compareItems.map(item => (
                          <td key={item._id} className="text-capitalize">{getStockLabel(item)}</td>
                        ))}
                      </tr>
                      {/* Additional information */}
                      <tr>
                        <th>Additional Information</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <AdditionalInfo item={item} />
                          </td>
                        ))}
                      </tr>
                      {/* Tags */}
                      <tr>
                        <th>Tags</th>
                        {compareItems.map(item => (
                          <td key={item._id}>{item.tags?.length ? item.tags.join(", ") : "-"}</td>
                        ))}
                      </tr>
                      {/* Add to cart */}
                      <tr>
                        <th>Add to cart</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-add-to-cart">
                              <button onClick={() => handleAddProduct(item)} type="button" className="tp-btn">
                                Add to Cart
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Rating */}
                      <tr>
                        <th>Rating</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-rating">
                              <Rating
                                allowFraction
                                size={16}
                                initialValue={getRatingValue(item.reviews)}
                                readonly={true}
                              />
                              <span className="d-block mt-1">
                                {item.reviews?.length || 0} review{item.reviews?.length === 1 ? "" : "s"}
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Remove */}
                      <tr>
                        <th>Remove</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-remove">
                              <button onClick={()=>handleRemoveComparePrd({title:item.title,id:item._id })}>
                                <i className="fal fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CompareArea;
