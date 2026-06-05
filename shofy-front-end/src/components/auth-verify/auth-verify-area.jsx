'use client';
import React from "react";
import Link from "next/link";
// internal
import AuthVerifyForm from "./auth-verify-form";
import LoginShapes from "../login-register/login-shapes";

const AuthVerifyArea = () => {
  return (
    <>
      <section className="tp-login-area pb-140 p-relative z-index-1 fix py-5">
        <LoginShapes />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="tp-login-wrapper">
                <div className="tp-login-top text-center mb-30">
                  <h3 className="tp-login-title">Verify Your Account</h3>
                  <p>
                    Enter your details and the authentication code to verify your account.
                  </p>
                  {/* Contact Link */}
                  <p style={{ marginTop: "10px", fontSize: "12px" }}>
                    Need help?{" "}
                    <span>
                      <Link href="/contact">Contact Us</Link>
                    </span>
                  </p>
                </div>
                <div className="tp-login-option">
                  <AuthVerifyForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AuthVerifyArea;
