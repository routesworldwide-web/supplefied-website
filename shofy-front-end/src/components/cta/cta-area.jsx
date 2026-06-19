"use client";
import React, { useState } from 'react';
import Image from 'next/image';
// internal
import { AnimatedLine } from '@/svg';
import { useSubscribeNewsletterMutation } from '@/redux/features/newsletterApi';
import { notifyError, notifySuccess } from '@/utils/toast';
import shape_1 from '@assets/img/subscribe/subscribe-shape-1.png';
import shape_2 from '@assets/img/subscribe/subscribe-shape-2.png';
import shape_3 from '@assets/img/subscribe/subscribe-shape-3.png';
import shape_4 from '@assets/img/subscribe/subscribe-shape-4.png';
import plane from '@assets/img/subscribe/plane.png';

function Shape({ img, num }) {
  return (
    <Image className={`tp-subscribe-shape-${num}`} src={img} alt="shape" />
  );
}

const CtaArea = () => {
  const [email, setEmail] = useState("");
  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      notifyError("Please enter your email address");
      return;
    }

    const result = await subscribeNewsletter({
      email: trimmedEmail,
      source: "home-subscribe-section",
    });

    if (result.error) {
      notifyError(result.error?.data?.message || "Subscription failed. Please try again.");
      return;
    }

    notifySuccess(result.data?.message || "Thanks for subscribing.");
    setEmail("");
  };

  return (
    <section className="tp-subscribe-area pt-70 pb-65 theme-bg p-relative z-index-1">
      <div className="tp-subscribe-shape">
        <Shape img={shape_1} num="1" />
        <Shape img={shape_2} num="2" />
        <Shape img={shape_3} num="3" />
        <Shape img={shape_4} num="4" />
        <div className="tp-subscribe-plane">
          <Image className="tp-subscribe-plane-shape" src={plane} alt="img" />
          <AnimatedLine />
        </div>
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-7 col-lg-7">
            <div className="tp-subscribe-content">
              {/* <span>Sale 20% off all store</span> */}
              <h3 className="tp-subscribe-title">Subscribe for supplement tips, new launches, and exclusive Supplefied offers.</h3>
            </div>
          </div>
          <div className="col-xl-5 col-lg-5">
            <div className="tp-subscribe-form">
              <form onSubmit={handleSubmit}>
                <div className="tp-subscribe-input">
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={isLoading}
                  />
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaArea;
