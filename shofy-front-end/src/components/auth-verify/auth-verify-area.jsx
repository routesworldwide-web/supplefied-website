'use client';

import React from "react";
import Link from "next/link";
import {
  Phone,
  ShieldCheck,
  Zap,
  Gift,
  Mail,
  ArrowRight,
  Package,
  Truck,
  Star,
} from "lucide-react";
import AuthVerifyForm from "./auth-verify-form";

const AuthVerifyArea = () => {
  return (
    <>
      <section className="auth-verify-area">
        <div className="auth-bg-noise" />

        <header className="auth-header container">
          <div className="brand-box">
            <img
              src="/assets/img/logo/slogo.png"
              alt="Supplefied Logo"
              className="brand-logo"
            />

            <div>
              <h2>
                Supplef<span className="iclass">i</span>ed
              </h2>
              <p>Supplements. Simplified.</p>
            </div>
          </div>
          <div className="auth-contact-links d-flex flex-column flex-md-row gap-3 gap-md-5 align-items-start align-items-md-center">
  <a
    href="mailto:Supplefied@gmail.com"
    className="d-flex align-items-center gap-2 text-decoration-none"
  >
    <Mail size={18} strokeWidth={2} />
   Supplefied@gmail.com
  </a>

  <a
    href="tel:+919891238727"
    className="d-flex align-items-center gap-2 text-decoration-none"
  >
    <Phone size={18} strokeWidth={2} />
    +91 9891238727
  </a>
</div>

         
        </header>

        <main className="auth-main container">
          <div className="row align-items-center justify-content-between gy-4 auth-hero-row">
            
            <div className="col-xl-4 col-lg-5">
             <div className="auth-badge-wrap">
                <span className="auth-badge">
            <span />
            Coming Soon
          </span>
             </div>
              
              <div className="auth-landing-content">
                <h1 className="auth-title">
                  The Future of <span>Supplements</span> Starts Here.
                </h1>

                <p className="auth-description">
                  Supplefied is getting ready to bring you a better, faster, and
                  smoother supplement shopping experience.
                </p>

                <div className="auth-feature-list">
                  <div className="auth-feature-item">
                    <div className="feature-icon">
                      <ShieldCheck size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h4>100% Authentic Products</h4>
                      <p>Every product verified for your safety.</p>
                    </div>
                  </div>

                  <div className="auth-feature-item">
                    <div className="feature-icon">
                      <Zap size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h4>Fast & Reliable</h4>
                      <p>Quick checkout and express delivery.</p>
                    </div>
                  </div>

                  <div className="auth-feature-item">
                    <div className="feature-icon">
                      <Gift size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h4>Exclusive Launch Offers</h4>
                      <p>Special deals for our early community.</p>
                    </div>
                  </div>
                </div>

                <div className="waitlist-card">
                  <div className="waitlist-icon">
                    <Mail size={20} strokeWidth={2} />
                  </div>

                  <div>
                    <h4>Join the Waitlist</h4>
                    <p>Supplefied@gmail.com</p>
                  </div>

                  <Link href="/contact" className="waitlist-btn">
                    <ArrowRight size={22} strokeWidth={2.4} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-lg-2 d-none d-lg-block">
              <div className="hero-visual">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />

                <div className="logo-s-shape">
                  <img
                    src="/assets/img/logo/slogo.png"
                    alt="Supplefied S Logo"
                    className="orbit-logo-img"
                  />
                </div>

                <div className="platform">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>

            <div className="col-xl-5">
              <div className="auth-form-card">
                <div className="auth-form-header text-center">
                  <h3>Verify Your Product</h3>
                  <p>
                    Enter your details and authentication code to verify your product.
                  </p>
                </div>

                <div className="auth-form-body">
                  <AuthVerifyForm />
                </div>

                <p className="auth-small-link">
                  Need help?{" "}
                  <span>
                    <Link href="/contact">Contact Us</Link>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="auth-stats-section">
            <div className="stat-card">
              <div className="stat-icon">
                <Package size={22} strokeWidth={2} />
              </div>
              <div>
                <h3>10K+</h3>
                <p>Products</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <ShieldCheck size={22} strokeWidth={2} />
              </div>
              <div>
                <h3>100%</h3>
                <p>Authentic</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Truck size={22} strokeWidth={2} />
              </div>
              <div>
                <h3>Fast</h3>
                <p>Delivery</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Star size={22} strokeWidth={2} />
              </div>
              <div>
                <h3>Trusted</h3>
                <p>By Thousands</p>
              </div>
            </div>
          </div>
        </main>

        <style jsx>{`
          .auth-verify-area {
            position: relative;
            z-index: 1;
            min-height: 100vh;
            overflow: hidden;
            padding: 14px 0 16px;
            font-family: Poppins, sans-serif;
            background:
              radial-gradient(circle at 48% 50%, rgba(214, 214, 0, 0.25), transparent 22%),
              radial-gradient(circle at 75% 55%, rgba(214, 214, 0, 0.12), transparent 28%),
              radial-gradient(circle at 8% 90%, rgba(214, 214, 0, 0.1), transparent 28%),
              linear-gradient(135deg, #020403 0%, #050807 45%, #000000 100%);
            color: #ffffff;
          }

          .auth-bg-noise {
            position: absolute;
            inset: 0;
            z-index: -1;
            opacity: 0.5;
            background-image:
              radial-gradient(circle at 20% 20%, rgba(214, 214, 0, 0.75) 0 1px, transparent 2px),
              radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.16) 0 1px, transparent 2px),
              radial-gradient(circle at 85% 70%, rgba(214, 214, 0, 0.42) 0 1px, transparent 2px);
            background-size: 180px 180px, 260px 260px, 220px 220px;
          }

          .auth-header {
            position: relative;
            z-index: 3;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 18px;
          }

          .brand-box {
            display: flex;
            align-items: center;
            gap: 2px;
          }

          .brand-logo {
            width: 46px;
            height: 46px;
            object-fit: contain;
            filter: drop-shadow(0 0 18px rgba(214, 214, 0, 0.25));
          }

          .brand-box h2 {
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.8px;
          }

          .brand-box p {
            margin: 1px 0 0;
            color: rgba(255, 255, 255, 0.62);
            font-size: 12px;
          }

          .iclass {
            color: #d7d700;
          }

          .auth-main {
            position: relative;
            z-index: 2;
          }

          .auth-hero-row {
            min-height: calc(100vh - 118px);
          }

          .auth-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 9px 18px;
            border-radius: 999px;
            margin-bottom: 40px;
            background: rgba(214, 214, 0, 0.08);
            border: 1px solid rgba(214, 214, 0, 0.22);
            color: #d7d700;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            white-space: nowrap;
          }

          .auth-badge span {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #d7d700;
            box-shadow: 0 0 16px rgba(214, 214, 0, 0.9);
          }

          .auth-title {
            margin: 0 0 16px;
            color: #ffffff;
            font-size: clamp(32px, 3.7vw, 48px);
            line-height: 1.02;
            font-weight: 700;
          }

          .auth-title span {
            display: block;
            color: #d7d700;
            text-shadow: 0 0 26px rgba(214, 214, 0, 0.28);
          }

          .auth-description {
            max-width: 430px;
            margin: 0 0 20px;
            color: rgba(255, 255, 255, 0.72);
            font-size: 15px;
            line-height: 1.55;
          }

          .auth-feature-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
          }

          .auth-feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .feature-icon,
          .stat-icon,
          .waitlist-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: white;
            background:
              radial-gradient(circle, rgba(214, 214, 0, 0.18), rgba(255, 255, 255, 0.03));
            border: 1px solid rgba(214, 214, 0, 0.22);
          }

          .feature-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
            font-size: 18px;
          }

          .auth-feature-item h4 {
            margin: 0 0 2px;
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
          }

          .auth-feature-item p {
            margin: 0;
            color: rgba(255, 255, 255, 0.62);
            font-size: 12px;
            line-height: 1.4;
          }

          .waitlist-card {
            max-width: 360px;
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.045);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(18px);
          }

          .waitlist-icon {
            width: 40px;
            height: 40px;
          }

          .waitlist-card h4 {
            margin: 0 0 2px;
            color: #ffffff;
            font-size: 13px;
            font-weight: 600;
          }

          .waitlist-card p {
            margin: 0;
            color: rgba(255, 255, 255, 0.58);
            font-size: 11px;
          }

          .waitlist-btn {
            width: 40px;
            height: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: #111300;
            background: #d7d700;
            font-size: 24px;
            font-weight: 700;
            text-decoration: none;
            box-shadow: 0 0 24px rgba(214, 214, 0, 0.38);
          }

          .hero-visual {
            position: relative;
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .orbit {
            position: absolute;
            border-radius: 50%;
            filter: drop-shadow(0 0 22px rgba(214, 214, 0, 0.28));
            animation: spin 18s linear infinite;
          }

          .orbit-one {
            width: 270px;
            height: 270px;
            border: 1px solid rgba(214, 214, 0, 0.34);
            box-shadow:
              0 0 70px rgba(214, 214, 0, 0.12),
              inset 0 0 55px rgba(214, 214, 0, 0.06);
          }

          .orbit-two {
            width: 205px;
            height: 205px;
            border: 1px dashed rgba(214, 214, 0, 0.42);
            animation-duration: 12s;
            animation-direction: reverse;
          }

          .logo-s-shape {
            position: relative;
            z-index: 3;
            width: 155px;
            height: 240px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: logoFloat 5s ease-in-out infinite;
            filter:
              drop-shadow(0 20px 30px rgba(0, 0, 0, 0.55))
              drop-shadow(0 0 34px rgba(214, 214, 0, 0.28));
          }

          .orbit-logo-img {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
          }

          .platform {
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 260px;
            height: 90px;
            transform: translateX(-50%);
            border-radius: 50%;
            background:
              radial-gradient(circle at center, rgba(238, 238, 24, 0.46) 0%, rgba(214, 214, 0, 0.18) 28%, transparent 64%);
            filter: drop-shadow(0 0 28px rgba(214, 214, 0, 0.45));
            pointer-events: none;
          }

          .platform::before {
            content: "";
            position: absolute;
            left: 50%;
            top: -96px;
            width: 120px;
            height: 170px;
            transform: translateX(-50%);
            background: linear-gradient(
              180deg,
              rgba(238, 238, 24, 0.24) 0%,
              rgba(238, 238, 24, 0.12) 42%,
              transparent 100%
            );
            clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
            filter: blur(7px);
            opacity: 0.9;
          }

          .platform::after {
            content: "";
            position: absolute;
            inset: 17px 24px;
            border-radius: 50%;
            border: 1px solid rgba(238, 238, 24, 0.75);
            box-shadow:
              0 0 16px rgba(238, 238, 24, 0.55),
              inset 0 0 18px rgba(238, 238, 24, 0.16);
            animation: platformPulse 2.8s ease-in-out infinite;
          }

          .platform span {
            position: absolute;
            left: 50%;
            top: 50%;
            border-radius: 50%;
            border: 1px solid rgba(238, 238, 24, 0.55);
            transform: translate(-50%, -50%);
            box-shadow: 0 0 18px rgba(214, 214, 0, 0.28);
          }

          .platform span:nth-child(1) {
            width: 86%;
            height: 48%;
            animation: ringPulse 3.2s ease-in-out infinite;
          }

          .platform span:nth-child(2) {
            width: 66%;
            height: 34%;
            animation: ringPulse 3.2s ease-in-out infinite 0.25s;
          }

          .platform span:nth-child(3) {
            width: 42%;
            height: 20%;
            animation: ringPulse 3.2s ease-in-out infinite 0.5s;
          }

          .auth-form-card {
            position: relative;
            z-index: 2;
            padding: 26px 32px 18px;
            border-radius: 22px;
            background: rgba(8, 10, 10, 0.78);
            border: 1px solid rgba(255, 255, 255, 0.13);
            box-shadow:
              0 30px 90px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(22px);
          }

          .auth-form-header {
            margin-bottom: 16px;
          }

          .auth-form-header h3 {
            margin: 0 0 8px;
            color: #ffffff;
            font-size: 24px;
            font-weight: 650;
            letter-spacing: -0.7px;
          }

          .auth-form-header p {
            max-width: 330px;
            margin: 0 auto;
            color: rgba(255, 255, 255, 0.64);
            font-size: 13px;
            line-height: 1.5;
          }

          .auth-form-body {
            width: 100%;
            margin-top: 16px;
          }

          .auth-small-link {
            margin: 14px 0 0;
            text-align: center;
            color: rgba(255, 255, 255, 0.58);
            font-size: 12px;
          }

          .auth-small-link a {
            color: #d7d700;
            text-decoration: none;
            font-weight: 700;
          }

          .auth-stats-section {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0;
            margin-top: 10px;
            padding: 10px 18px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.045);
            border: 1px solid rgba(255, 255, 255, 0.11);
            backdrop-filter: blur(20px);
          }

          .stat-card {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            min-height: 58px;
            border-right: 1px solid rgba(255, 255, 255, 0.12);
          }

          .stat-card:last-child {
            border-right: 0;
          }

          .stat-icon {
            width: 42px;
            height: 42px;
            min-width: 42px;
            font-size: 20px;
          }

          .stat-card h3 {
            margin: 0;
            color: #d7d700;
            font-size: 20px;
            font-weight: 600;
            line-height: 1;
          }

          .stat-card p {
            margin: 4px 0 0;
            color: rgba(255, 255, 255, 0.7);
            font-size: 13px;
          }

          :global(.auth-verify-form) {
            width: 100%;
          }

          :global(.auth-form-group) {
            margin-bottom: 10px;
          }

          :global(.auth-form-label) {
            display: block;
            margin-bottom: 5px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
            font-weight: 700;
          }

          :global(.auth-form-control) {
            width: 100%;
            height: 40px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: rgba(0, 0, 0, 0.28);
            color: #ffffff;
            padding: 0 14px;
            font-size: 13px;
            outline: none;
            transition: all 0.25s ease;
          }

          :global(.auth-form-control::placeholder) {
            color: rgba(255, 255, 255, 0.34);
          }

          :global(.auth-form-control:focus) {
            border-color: rgba(214, 214, 0, 0.7);
            box-shadow: 0 0 0 4px rgba(214, 214, 0, 0.12);
            background: rgba(0, 0, 0, 0.4);
          }

          :global(.auth-form-control.has-error) {
            border-color: #ef4444;
            background: rgba(239, 68, 68, 0.08);
          }

          :global(.auth-form-error) {
            display: block;
            margin-top: 5px;
            color: #ff8585;
            font-size: 11px;
            font-weight: 600;
          }

          :global(.auth-success-message) {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 9px 14px;
            margin-bottom: 10px;
            border-radius: 8px;
            background: rgba(34, 197, 94, 0.1);
            color: #86efac;
            border: 1px solid rgba(34, 197, 94, 0.25);
          }

          :global(.auth-success-message p) {
            margin: 0;
            font-size: 12px;
            font-weight: 700;
          }

          :global(.auth-submit-btn) {
            width: 100%;
            height: 44px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(135deg, #eeee18 0%, #b7b700 100%);
            color: #101200;
            font-size: 14px;
            font-weight: 900;
            cursor: pointer;
            transition: all 0.25s ease;
          }

          :global(.auth-submit-btn:hover:not(:disabled)) {
            transform: translateY(-2px);
          }

          :global(.auth-submit-btn:disabled) {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          @keyframes logoFloat {
            0%, 100% {
              transform: translateY(0) rotate(-2deg);
            }

            50% {
              transform: translateY(-10px) rotate(2deg);
            }
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes platformPulse {
            0%, 100% {
              opacity: 0.78;
              transform: scale(1);
            }

            50% {
              opacity: 1;
              transform: scale(1.04);
            }
          }

          @keyframes ringPulse {
            0%, 100% {
              opacity: 0.55;
              transform: translate(-50%, -50%) scale(1);
            }

            50% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1.08);
            }
          }

          @media (max-width: 1199px) {
            .auth-header {
              margin-bottom: 18px;
            }

            .auth-title {
              font-size: clamp(30px, 3.6vw, 42px);
            }

            .hero-visual {
              min-height: 370px;
            }

            .orbit-one {
              width: 245px;
              height: 245px;
            }

            .orbit-two {
              width: 185px;
              height: 185px;
            }

            .logo-s-shape {
              width: 145px;
              height: 225px;
            }

            .platform {
              width: 240px;
              height: 84px;
            }
          }

          @media (max-width: 991px) {
            .auth-verify-area {
              padding-top: 24px;
              overflow: visible;
            }

            .auth-hero-row {
              min-height: auto;
            }

            .auth-header {
              margin-bottom: 44px;
            }

            .auth-landing-content {
              margin: 0 auto;
              text-align: center;
            }

            .auth-description {
              margin-left: auto;
              margin-right: auto;
            }

            .auth-feature-item {
              max-width: 420px;
              margin: 0 auto;
              text-align: left;
            }

            .waitlist-card {
              margin: 0 auto;
            }

            .auth-form-card {
              max-width: 560px;
              margin: 0 auto;
            }

            .auth-stats-section {
              grid-template-columns: repeat(2, 1fr);
              gap: 18px;
              padding: 22px;
            }

            .stat-card {
              border-right: 0;
              justify-content: flex-start;
              padding: 10px 14px;
              border-radius: 18px;
              background: rgba(255, 255, 255, 0.04);
            }
          }

          @media (max-width: 767px) {
            .auth-header {
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 16px;
              text-align: center;
            }

            .brand-box {
              justify-content: center;
            }

            .auth-contact-links {
              width: 100%;
              align-items: center !important;
            }

            .auth-contact-links a {
              justify-content: center;
              text-align: center;
            }

            .auth-badge-wrap {
              width: 100%;
              display: flex;
              justify-content: center;
            }

            .auth-badge {
              margin-left: auto;
              margin-right: auto;
            }

            .auth-title {
              letter-spacing: -1.4px;
            }

            .auth-stats-section {
              grid-template-columns: repeat(2, 1fr);
            }

            .stat-card {
              justify-content: flex-start;
            }
          }

          @media (max-width: 575px) {
            .auth-verify-area {
              padding: 22px 0 26px;
            }

            .brand-logo {
              width: 48px;
              height: 48px;
            }

            .brand-box h2 {
              font-size: 24px;
            }

            .brand-box p {
              font-size: 13px;
            }

            .auth-badge {
              padding: 10px 16px;
              font-size: 12px;
              margin-bottom: 0;
            }

            .auth-title {
              font-size: 40px;
              line-height: 1.08;
            }

            .auth-description {
              font-size: 15px;
            }

            .auth-feature-list {
              gap: 16px;
            }

            .feature-icon {
              width: 44px;
              height: 44px;
              min-width: 44px;
            }

            .waitlist-card {
              grid-template-columns: auto 1fr auto;
              padding: 12px;
              border-radius: 18px;
            }

            .waitlist-btn {
              width: 42px;
              height: 42px;
              font-size: 24px;
            }

            .auth-form-card {
              padding: 34px 20px 24px;
              border-radius: 20px;
            }

            .auth-form-header h3 {
              font-size: 25px;
            }

            .auth-form-header p {
              font-size: 14px;
            }

            :global(.auth-form-control) {
              height: 50px;
            }

            :global(.auth-submit-btn) {
              height: 52px;
            }
          }
        `}</style>
      </section>
    </>
  );
};

export default AuthVerifyArea;
