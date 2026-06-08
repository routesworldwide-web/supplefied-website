'use client';

import React from "react";
import Link from "next/link";
// internal
import AuthVerifyForm from "./auth-verify-form";
// import LoginShapes from "../login-register/login-shapes";

const AuthVerifyArea = () => {
  return (
    <>
      <section className="auth-verify-area py-5">
        {/* <LoginShapes /> */}

        <div className="container">
          {/* Top Landing Section */}
          <div className="row align-items-center justify-content-between gy-5">
            
            {/* Left Content */}
            <div className="col-xl-6 col-lg-6">
              <div className="auth-landing-content">
                <img
                  src="/assets/img/logo/Supplified_logo.png"
                  alt="Supplefied Logo"
                  className="auth-logo"
                />

                <span className="auth-badge">Coming Soon</span>

                <h1 className="auth-title">
                  We&apos;re launching soon with new updates.
                </h1>

                <p className="auth-description">
                  Supplefied is getting ready to bring you a better, faster, and
                  smoother supplement shopping experience. Verify your account now
                  to stay connected and get early access when we launch.
                </p>

                <div className="auth-feature-list">
                  <div className="auth-feature-item">
                    <span>✓</span>
                    <p>New product collections</p>
                  </div>

                  <div className="auth-feature-item">
                    <span>✓</span>
                    <p>Faster checkout experience</p>
                  </div>

                  <div className="auth-feature-item">
                    <span>✓</span>
                    <p>Exclusive launch offers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Section */}
            <div className="col-xl-5 col-lg-6">
              <div className="auth-form-card">
                <div className="auth-form-header text-center">
                  <h3>Verify Your Account</h3>
                  <p>
                    Enter your details and authentication code to verify your account.
                  </p>

                  <p className="auth-small-link">
                    Need help?{" "}
                    <span>
                      <Link href="/contact">Contact Us</Link>
                    </span>
                  </p>
                </div>

                <div className="auth-form-body">
                  <AuthVerifyForm />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="auth-contact-section">
            <div className="row gy-4">
              <div className="col-xl-4 col-md-6 col-12">
                <div className="auth-contact-card">
                  <div>
                    <h4>Email Us</h4>
                    <p>
                      <a href="mailto:info@routesworldwideexpress.com">
                        info@routesworldwideexpress.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-md-6 col-12">
                <div className="auth-contact-card">
                  <div>
                    <h4>Call Us</h4>
                    <p>
                      <a href="tel:+918796200495">+91 8796200495</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-md-12 col-12">
                <div className="auth-contact-card">
                  <div>
                    <h4>Address</h4>
                    <p>
                      Office 1016/2 Beegreen Plaza, Mahipalpur, New Delhi - 110037
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .auth-verify-area {
            position: relative;
            z-index: 1;
            overflow-x: hidden;
            overflow-y: visible;
            min-height: 100vh;
            font-family: "Poppins", sans-serif;
            background-image: url("https://images.unsplash.com/flagged/photo-1593005510509-d05b264f1c9c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");  
          }

          .auth-landing-content {
            position: relative;
            z-index: 2;
            max-width: 620px;
            font-family: "Poppins", sans-serif;
          }

          .auth-badge {
            display: inline-flex;
            align-items: center;
            padding: 8px 16px;
            border-radius: 999px;
            background: white;
            color: #010f1c;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 22px;
            font-family: "Poppins", sans-serif;
          }

          .auth-logo {
            display: block;
            width: 150px;
            height: auto;
            margin-bottom: 24px;
          }

          .auth-title {
            font-size: 56px;
            line-height: 1.08;
            font-weight: 700;
            color: white;
            margin-bottom: 22px;
            letter-spacing: -1.5px;
            font-family: "Poppins", sans-serif;
          }

          .auth-description {
            font-size: 17px;
            line-height: 1.8;
            color: white;
            margin-bottom: 28px;
            font-family: "Poppins", sans-serif;
          }

          .auth-feature-list {
            display: flex;
            flex-direction: column;
            gap: 14px;
            margin-bottom: 28px;
          }

          .auth-feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .auth-feature-item span {
            width: 26px;
            height: 26px;
            min-width: 26px;
            border-radius: 50%;
            background: #0989ff;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
            font-family: "Poppins", sans-serif;
          }

          .auth-feature-item p {
            margin: 0;
            color: white;
            font-size: 15px;
            font-weight: 500;
            font-family: "Poppins", sans-serif;
          }

          .auth-form-card {
            position: relative;
            z-index: 2;
            background: #ffffff;
            border-radius: 8px;
            padding: 42px 38px;
            box-shadow: 0 24px 70px rgba(1, 15, 28, 0.1);
            border: 1px solid rgba(1, 15, 28, 0.08);
            font-family: "Poppins", sans-serif;
          }

          .auth-form-header {
            margin-bottom: 30px;
          }

          .auth-form-header h3 {
            color: #010f1c;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            font-family: "Poppins", sans-serif;
          }

          .auth-form-header p {
            color: #55585b;
            font-size: 14px;
            line-height: 1.7;
            margin: 0;
            font-family: "Poppins", sans-serif;
          }

          .auth-small-link {
            margin-top: 10px !important;
            font-size: 13px !important;
          }

          .auth-small-link a,
          .auth-contact-card a {
            color: #0989ff;
            font-weight: 600;
            text-decoration: none;
            font-family: "Poppins", sans-serif;
            word-break: break-word;
          }

          .auth-form-body {
            width: 100%;
          }

          .auth-contact-section {
            position: relative;
            z-index: 2;
            width: 100%;
            margin-top: 80px;
            padding: 42px;
            border-radius: 18px;
            backdrop-filter: blur(14px);
            border: 1px solid rgba(255, 255, 255, 0.65);
            font-family: "Poppins", sans-serif;
          }

          .auth-contact-card {
            width: 100%;
            min-height: 120px;
            height: 100%;
            display: flex;
            gap: 18px;
            align-items: flex-start;
            padding: 26px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.88);
            border: 1px solid rgba(9, 137, 255, 0.12);
            transition: all 0.3s ease;
            font-family: "Poppins", sans-serif;
          }

          .auth-contact-card:hover {
            transform: translateY(-4px);
          }

          .auth-contact-card h4 {
            font-size: 18px;
            font-weight: 700;
            color: #010f1c;
            margin-bottom: 8px;
            font-family: "Poppins", sans-serif;
          }

          .auth-contact-card p {
            margin: 0;
            font-size: 15px;
            color: #55585b;
            line-height: 1.6;
            font-family: "Poppins", sans-serif;
          }

          @media (max-width: 1199px) {
            .auth-title {
              font-size: 46px;
            }
          }

          @media (max-width: 991px) {
            .auth-landing-content {
              text-align: center;
              margin: 0 auto;
            }

            .auth-logo {
              margin-left: auto;
              margin-right: auto;
            }

            .auth-feature-item {
              justify-content: center;
            }

            .auth-title {
              font-size: 42px;
            }

            .auth-contact-section {
              margin-top: 60px;
              padding: 34px;
            }
          }

          @media (max-width: 767px) {
            .auth-verify-area {
              padding-top: 32px !important;
              padding-bottom: 32px !important;
            }

            .auth-contact-section {
              display: block;
              margin-top: 36px;
              padding: 0;
              border: none;
              border-radius: 0;
              backdrop-filter: none;
            }

            .auth-contact-card {
              display: block;
              min-height: auto;
              padding: 22px;
              background: rgba(255, 255, 255, 0.94);
              box-shadow: 0 12px 30px rgba(1, 15, 28, 0.12);
            }

            .auth-contact-card:hover {
              transform: none;
            }
          }

          @media (max-width: 575px) {
            .auth-logo {
              width: 120px;
              margin-bottom: 20px;
            }

            .auth-title {
              font-size: 32px;
              line-height: 1.18;
              letter-spacing: -0.8px;
            }

            .auth-description {
              font-size: 15px;
              line-height: 1.7;
            }

            .auth-form-card {
              padding: 28px 18px;
              border-radius: 12px;
            }

            .auth-form-header h3 {
              font-size: 24px;
            }

            .auth-contact-card {
              padding: 20px;
              border-radius: 12px;
            }

            .auth-contact-card h4 {
              font-size: 16px;
            }

            .auth-contact-card p,
            .auth-contact-card a {
              font-size: 14px;
              line-height: 1.6;
            }
          }
        `}</style>
      </section>
    </>
  );
};

export default AuthVerifyArea;