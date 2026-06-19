'use client';
// external
import React, { useState } from "react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
// internal
import slider_img_1 from "@assets/img/slider/slider-img-1.png";
import slider_img_2 from "@assets/img/slider/slider-img-2.png";
import slider_img_3 from "@assets/img/slider/slider-img-3.png";
import shape_1 from "@assets/img/slider/shape/slider-shape-1.png";
import shape_2 from "@assets/img/slider/shape/slider-shape-2.png";
import shape_3 from "@assets/img/slider/shape/slider-shape-3.png";
import shape_4 from "@assets/img/slider/shape/slider-shape-4.png";
import { useGetBannersQuery } from "@/redux/features/bannerApi";
import { ArrowRightLong, SliderNextBtn, SliderPrevBtn, TextShape } from "@/svg";

// slider data
const sliderData = [
  {
    id: 1,
    pre_title: { text: "Starting at", text2: 274 },

    title: "High-Quality Supplements for Real Progress.",

    subtitle: {
      text_1: "Exclusive offer ",
      percent: 35,
      text_2: "off this week",
    },
    img: slider_img_1,
    green_bg: true,
  },
  {
    id: 2,
    pre_title: { text: "Starting at", text2: 999 },

    title: "Trusted Nutrition for Muscle, Energy, and Wellness.",

    subtitle: {
      text_1: "Exclusive offer ",
      percent: 10,
      text_2: "off this week",
    },
    img: slider_img_2,
    green_bg: true,
  },
  {
    id: 3,
    pre_title: { text: "Starting at", text2: 999 },

    title: "Pure Nutrition Made for Everyday Athletes",

    subtitle: {
      text_1: "Exclusive offer ",
      percent: 10,
      text_2: "off this week",
    },
    img: slider_img_3,
    is_light: true,
  },
];

function Shape({ img, num }) {
  return (
    <Image className={`tp-slider-shape-${num}`} src={img} alt="slider-shape" priority />
  );
}

const HomeHeroSlider = () => {
  const [active, setActive] = useState(false);
  const { data: uploadedHeroData } = useGetBannersQuery("home-hero-slider");
  const uploadedHeroSlides = uploadedHeroData?.data || [];
  const heroSlides = uploadedHeroSlides.length
    ? uploadedHeroSlides.map((banner) => ({
        id: banner._id,
        title: banner.title || "Shop premium supplements for real progress.",
        img: banner.image,
        redirectLink: banner.redirectLink || "/shop",
        uploaded: true,
      }))
    : sliderData;

  const handleActiveIndex = (index) => {
    setActive(Boolean(heroSlides[index]?.is_light));
  };

  return (
    <section className="tp-slider-area p-relative z-index-1">
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={false}
        rewind={true}
        effect="fade"
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          nextEl: ".tp-slider-button-next",
          prevEl: ".tp-slider-button-prev",
        }}
        onSlideChange={(swiper) => handleActiveIndex(swiper.activeIndex)}
        pagination={{ el: ".tp-slider-dot", clickable: true }}
        modules={[Navigation, Pagination, EffectFade, Autoplay]}
        className={`tp-slider-active tp-slider-variation swiper-container ${
          active ? "is-light" : ""
        }`}
      >
        {heroSlides.map((item) => {
          if (item.uploaded) {
            return (
              <SwiperSlide
                key={item.id}
                className="tp-slider-item tp-slider-height tp-slider-uploaded-slide p-relative"
                style={{ backgroundImage: `url(${item.img})` }}
              >
                <Link
                  href={item.redirectLink || "/shop"}
                  aria-label={item.title}
                  className="position-absolute top-0 start-0 w-100 h-100"
                />
              </SwiperSlide>
            );
          }

          return (
            <SwiperSlide
              key={item.id}
              className={`tp-slider-item tp-slider-height d-flex align-items-center ${
                item?.green_bg ? "green-dark-bg" : item?.is_light ? "is-light" : ""
              }`}
              style={{ backgroundColor: item.is_light ? "#E3EDF6" : undefined }}
            >
              <div className="tp-slider-shape">
                <Shape img={shape_1} num="1" />
                <Shape img={shape_2} num="2" />
                <Shape img={shape_3} num="3" />
                <Shape img={shape_4} num="4" />
              </div>
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-xl-5 col-lg-6 col-md-6">
                    <div className="tp-slider-content p-relative z-index-1">
                      <span>

                        {item.pre_title.text} <b>Rs.{item.pre_title.text2}</b>

                      </span>
                      <h3 className="tp-slider-title">{item.title}</h3>
                      <p>
                        {item.subtitle.text_1}
                        <span>
                          -{item.subtitle.percent}%
                          <TextShape />
                        </span>{" "}
                        {item.subtitle.text_2}
                      </p>

                      <div className="tp-slider-btn">
                        <Link href="/shop" className="tp-btn tp-btn-2 tp-btn-white">
                          Shop Now <ArrowRightLong />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-7 col-lg-6 col-md-6">
                    <div className="tp-slider-thumb text-end">
                      <Image src={item.img} alt="slider-img" />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
        <div className="tp-slider-arrow tp-swiper-arrow">
          <button type="button" className="tp-slider-button-prev">
            <SliderPrevBtn />
          </button>
          <button type="button" className="tp-slider-button-next">
            <SliderNextBtn />
          </button>
        </div>
        <div className="tp-slider-dot tp-swiper-dot"></div>
      </Swiper>
    </section>
  );
};

export default HomeHeroSlider;
