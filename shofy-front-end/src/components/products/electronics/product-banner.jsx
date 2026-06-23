'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// internal
import offer_img from '@assets/img/banner/banner-slider-offer.png';
import banner_img_1 from '@assets/img/banner/banner-slider-1.png';
import banner_img_2 from '@assets/img/banner/banner-slider-2.png';
import banner_img_3 from '@assets/img/banner/banner-slider-3.png';
import { useGetBannersQuery } from '@/redux/features/bannerApi';

// banner products
const bannerProducts = [
  {
    id: 1,
    banner_bg_txt: 'POWER',
    subtitle: 'MHP Collection 2026',
    title: 'Impact Hydration Electrolyte + Creatine',
    oldPrice: 4000,
    newPrice: 2500,
    img: banner_img_1,
  },
  {
    id: 2,
    banner_bg_txt: 'POWER',
    subtitle: 'MHP Collection 2026',
    title: 'Up Your Mass, mass building weight gainer',
    oldPrice: 4000,
    newPrice: 2500,
    img: banner_img_2,
  },
  {
    id: 3,
    banner_bg_txt: 'POWER',
    subtitle: 'MHP Collection 2026',
    title: 'Probolic-SR. Muscle Feeder',
    oldPrice: 4000,
    newPrice: 2500,
    img: banner_img_3,
  },
]

// slider setting 
const slider_setting = {
  slidesPerView: 1,
  spaceBetween: 0,
  effect: 'fade',
  rewind: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: {
    el: ".tp-product-banner-slider-dot",
    clickable: true,
  }
}

const ProductBanner = () => {
  const { data: uploadedBannerData } = useGetBannersQuery("product-banner-slider");
  const uploadedBanners = uploadedBannerData?.data || [];

  return (
    <>
      <div className="tp-product-banner-area pb-90">
        <div className="container">
          <div className="tp-product-banner-slider fix">
            <Swiper {...slider_setting} modules={[Pagination, EffectFade, Autoplay]} className="tp-product-banner-slider-active swiper-container">
              {uploadedBanners.length > 0 ? uploadedBanners.map((item) => (
                <SwiperSlide
                  key={item._id}
                  className="tp-product-banner-inner tp-product-banner-uploaded include-bg p-relative z-index-1 fix"
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}
                >
                  <Link
                    href={item.redirectLink || "/shop"}
                    aria-label={item.title || "Shop banner"}
                    className="position-absolute top-0 start-0 w-100 h-100"
                  />
                </SwiperSlide>
              )) : bannerProducts.map((item) => (
                <SwiperSlide key={item.id} className="tp-product-banner-inner theme-bg p-relative z-index-1 fix">
                  <h4 className="tp-product-banner-bg-text">{item.banner_bg_txt}</h4>
                  <div className="row align-items-center">
                    <div className="col-xl-6 col-lg-6">
                      <div className="tp-product-banner-content p-relative z-index-1">
                        <span className="tp-product-banner-subtitle">{item.subtitle}</span>
                        <h3 className="tp-product-banner-title">{item.title}</h3>
                        <div className="tp-product-banner-price mb-40">
                          <span className="old-price">₹{item.oldPrice.toFixed(2)}</span>
                          <p className="new-price">₹{item.newPrice.toFixed(2)}</p>
                        </div>
                        <div className="tp-product-banner-btn">
                          <Link href="/shop" className="tp-btn tp-btn-2">Shop now</Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <div className="tp-product-banner-thumb-wrapper p-relative">
                        <div className="tp-product-banner-thumb-shape">
                          <span className="tp-product-banner-thumb-gradient"></span>
                          {/* <Image className="tp-offer-shape" src={offer_img} alt="tp-offer-shape" /> */}
                        </div>

                        <div className="tp-product-banner-thumb text-end p-relative z-index-1">
                          <Image src={item.img} alt="banner-slider img" />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <div
                slot="container-end"
                className="tp-product-banner-slider-dot tp-swiper-dot"
              ></div>
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductBanner;
