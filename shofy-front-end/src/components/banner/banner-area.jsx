'use client';
import React from "react";
import Link from "next/link";
// internal
import { ArrowRight } from "@/svg";
import banner_1 from "@assets/img/product/banner/product-banner-1.png";
import banner_2 from "@assets/img/product/banner/product-banner-2.png";
import { useGetBannersQuery } from "@/redux/features/bannerApi";


// banner item
function BannerItem({ sm = false, bg, title }) {
  return (
    <div
      className={`tp-banner-item ${
        sm ? "tp-banner-item-sm" : ""
      } tp-banner-height p-relative mb-30 z-index-1 fix`}
    >
      <div
        className="tp-banner-thumb include-bg transition-3"
        style={{ backgroundImage: `url(${bg.src})` }}
      ></div>
      <div className="tp-banner-content">
        {!sm && <span>Sale 20% Off </span>}
        <h3 className="tp-banner-title">
          <Link href="/shop">{title}</Link>
        </h3>
        {sm && <p>Sale 35% Off</p>}
        <div className="tp-banner-btn">
          <Link href="/shop" className="tp-link-btn">
            Shop Now
            <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

function UploadedBannerItem({ banner, sm = false }) {
  return (
    <Link
      href={banner.redirectLink || "/shop"}
      className={`tp-banner-item ${
        sm ? "tp-banner-item-sm" : ""
      } tp-banner-height p-relative mb-30 z-index-1 fix d-block`}
      aria-label={banner.title || "Shop banner"}
    >
      <div
        className="tp-banner-thumb include-bg transition-3"
        style={{ backgroundImage: `url(${banner.image})` }}
      ></div>
    </Link>
  );
}

const BannerArea = () => {
  const { data: sectionOne } = useGetBannersQuery("home-banner-section-1");
  const { data: sectionTwo } = useGetBannersQuery("home-banner-section-2");
  const bannerOne = sectionOne?.data?.[0];
  const bannerTwo = sectionTwo?.data?.[0];

  return (
    <section className="tp-banner-area pb-70">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-7">
            {bannerOne ? (
              <UploadedBannerItem banner={bannerOne} />
            ) : (
              <BannerItem
                bg={banner_1}
                title={
                  <>
                   L-Carnitine 3800mg<br /> Grape & Watermelon
                  </>
                }
              />
            )}
          </div>
          <div className="col-xl-4 col-lg-5">
            {bannerTwo ? (
              <UploadedBannerItem sm={true} banner={bannerTwo} />
            ) : (
              <BannerItem
                sm={true}
                bg={banner_2}
                title={
                  <>
                    Omega-3 <br /> Fish Oil
                  </>
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerArea;
