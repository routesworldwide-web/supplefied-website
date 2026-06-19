'use client';
import React from 'react';

const BootstrapIcon = ({ children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

const TruckIcon = () => (
  <BootstrapIcon>
    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85A1.5 1.5 0 0 1 16 8.35V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H6a2 2 0 1 1-4 0h-.5A1.5 1.5 0 0 1 0 10.5v-7Zm1.5-.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5H2a2 2 0 0 1 4 0h4a2 2 0 0 1 1-1.732V3.5a.5.5 0 0 0-.5-.5h-9Zm11 3H12v3.268A2 2 0 0 1 14 11h.5a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12.5ZM4 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
  </BootstrapIcon>
);

const BagCheckIcon = () => (
  <BootstrapIcon>
    <path
      fillRule="evenodd"
      d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0Z"
    />
    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h1.191a1.5 1.5 0 0 1 1.496 1.366l.7 8A1.5 1.5 0 0 1 12.393 15H3.607a1.5 1.5 0 0 1-1.494-1.634l.7-8A1.5 1.5 0 0 1 4.309 4H5.5v-.5A2.5 2.5 0 0 1 8 1ZM6.5 4h3v-.5a1.5 1.5 0 0 0-3 0V4Zm-2.19 1a.5.5 0 0 0-.499.455l-.7 8A.5.5 0 0 0 3.607 14h8.786a.5.5 0 0 0 .498-.545l-.7-8A.5.5 0 0 0 11.691 5H4.309Z" />
  </BootstrapIcon>
);

const ShieldLockIcon = () => (
  <BootstrapIcon>
    <path d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a10.8 10.8 0 0 1-2.517 2.453c-.386.273-.744.482-1.048.622-.149.068-.3.125-.45.159a1.4 1.4 0 0 1-.758 0 2.5 2.5 0 0 1-.45-.159 6.5 6.5 0 0 1-1.048-.622 10.8 10.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56ZM8 1c-.592 0-1.676.247-2.666.514a62 62 0 0 0-2.838.856.54.54 0 0 0-.362.453c-.553 4.157.726 7.167 2.266 9.181a9.8 9.8 0 0 0 2.275 2.22c.34.24.632.41.849.51q.217.1.299.118a.4.4 0 0 0 .354 0q.082-.018.299-.119c.217-.1.51-.27.849-.51a9.8 9.8 0 0 0 2.275-2.22c1.54-2.013 2.819-5.023 2.266-9.18a.54.54 0 0 0-.362-.454 62 62 0 0 0-2.838-.855C9.676 1.247 8.592 1 8 1Z" />
    <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415V10.5a.5.5 0 0 1-1 0V7.915A1.5 1.5 0 1 1 9.5 6.5Z" />
  </BootstrapIcon>
);

const HeadsetIcon = () => (
  <BootstrapIcon>
    <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a2 2 0 0 1-2-2V6a7 7 0 0 1 14 0v4a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5Z" />
    <path d="M11 13.5a.5.5 0 0 1-.5.5H9a1 1 0 0 1 0-2h1.5a.5.5 0 0 1 .5.5v1Z" />
  </BootstrapIcon>
);

export const feature_data = [
  {
    icon: <TruckIcon />,
    title: 'Fast Shipping',
    subtitle: 'Dispatch within 24-48 hours',
  },
  {
    icon: <BagCheckIcon />,
    title: 'Quality Products',
    subtitle: 'quality-checked products',
  },
  {
    icon: <ShieldLockIcon />,
    title: 'Secure Payments',
    subtitle: 'Safe checkout',
  },
  {
    icon: <HeadsetIcon />,
    title: 'Customer Support',
    subtitle: 'Get help before and after purchase',
  },
];

const FeatureAreaTwo = () => {
  return (
    <section className="tp-feature-area tp-feature-border-2 pb-80">
      <div className="container">
        <div className="tp-feature-inner-2">
          <div className="row align-items-center">
            {feature_data.map((item, i) => (
              <div key={i} className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="tp-feature-item-2 d-flex align-items-center mb-40">
                  <div className="tp-feature-icon-2 mr-10">
                    <span>{item.icon}</span>
                  </div>
                  <div className="tp-feature-content-2">
                    <h3 className="tp-feature-title-2">{item.title}</h3>
                    {/* <p>{item.subtitle}</p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureAreaTwo;
