'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { isValidEmail } from "@/utils/emailValidation";

// Validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Name is required"),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  email: yup
    .string()
    .required("Email is required")
    .test("valid-email", "Please enter a valid email address", (value) => {
      return isValidEmail(value);
    }),
  code: yup
    .string()
    .min(3, "Code must be at least 3 characters")
    .required("Authentication code is required"),
});

const AuthVerifyForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            mobile: data.mobile,
            email: data.email,
            code: data.code.toUpperCase(),
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setIsAuthenticated(true);
        toast.success(result.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        reset();

        setTimeout(() => {
          setIsAuthenticated(false);
        }, 5000);
      } else {
        const errorMessage =
          result.message || "Authentication failed. Please try again.";

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: result.errorType === "CODE_ALREADY_USED" ? 7000 : 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);

      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="auth-verify-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className="auth-form-group">
          <label htmlFor="name" className="auth-form-label">
            Full Name
          </label>

          <input
            {...register("name")}
            id="name"
            type="text"
            placeholder="Enter your full name"
            className={`auth-form-control ${errors.name ? "has-error" : ""}`}
            disabled={isLoading}
          />

          {errors.name && (
            <span className="auth-form-error">{errors.name.message}</span>
          )}
        </div>

        {/* Mobile Field */}
        <div className="auth-form-group">
          <label htmlFor="mobile" className="auth-form-label">
            Mobile Number
          </label>

          <input
            {...register("mobile")}
            id="mobile"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            className={`auth-form-control ${errors.mobile ? "has-error" : ""}`}
            disabled={isLoading}
            maxLength="10"
          />

          {errors.mobile && (
            <span className="auth-form-error">{errors.mobile.message}</span>
          )}
        </div>

        {/* Email Field */}
        <div className="auth-form-group">
          <label htmlFor="email" className="auth-form-label">
            Email Address
          </label>

          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="Enter your email address"
            className={`auth-form-control ${errors.email ? "has-error" : ""}`}
            disabled={isLoading}
          />

          {errors.email && (
            <span className="auth-form-error">{errors.email.message}</span>
          )}
        </div>

        {/* Code Field */}
        <div className="auth-form-group">
          <label htmlFor="code" className="auth-form-label">
            Authentication Code
          </label>

          <input
            {...register("code")}
            id="code"
            type="text"
            placeholder="Enter authentication code"
            className={`auth-form-control auth-code-input ${
              errors.code ? "has-error" : ""
            }`}
            disabled={isLoading}
          />

          {errors.code && (
            <span className="auth-form-error">{errors.code.message}</span>
          )}
        </div>

        {/* Success Message */}
        {isAuthenticated && (
          <div className="auth-success-message">
            <span>✓</span>
            <p>User authentication successful!</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="auth-loading-text">
              <span className="auth-loader" />
              Verifying...
            </span>
          ) : (
            "Verify Account"
          )}
        </button>
      </form>

      <style jsx>{`
        .auth-verify-form {
          width: 100%;
          font-family: poppins, sans-serif;
        }

        .auth-form-group {
          margin-bottom: 20px;
        }

        .auth-form-label {
          display: block;
          margin-bottom: 8px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
        }

        .auth-form-control {
          width: 100%;
          height: 54px;
          border: 1px solid #d9e1ec;
          border-radius: 6px;
          background: #ffffff;
          color: #101828;
          font-size: 14px;
          font-weight: 400;
          font-family: "Poppins", sans-serif;
          padding: 0 16px;
          outline: none;
          transition: all 0.25s ease;
        }

        .auth-form-control::placeholder {
          color: #98a2b3;
        }

        .auth-form-control:hover {
          border-color: #b8c4d5;
        }

        .auth-form-control:focus {
          border-color: #0989ff;
          box-shadow: 0 0 0 4px rgba(9, 137, 255, 0.12);
        }

        .auth-form-control:disabled {
          background: #f7f9fc;
          cursor: not-allowed;
          opacity: 0.8;
        }

        .auth-form-control.has-error {
          border-color: #dc3545;
          background: #fffafa;
        }

        .auth-form-control.has-error:focus {
          box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.12);
        }

        .auth-code-input {
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 600;
        }

        .auth-form-error {
          display: block;
          margin-top: 7px;
          color: #dc3545;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.4;
        }

        .auth-success-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px 14px;
          margin-bottom: 20px;
          background: #ecfdf3;
          color: #027a48;
          border: 1px solid #abefc6;
          border-radius: 6px;
          text-align: center;
        }

        .auth-success-message span {
          width: 22px;
          height: 22px;
          min-width: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #12b76a;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
        }

        .auth-success-message p {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .auth-submit-btn {
          width: 100%;
          height: 56px;
          border: none;
          border-radius: 6px;
          // background: linear-gradient(135deg, #0989ff 0%, #0067c8 100%);
          color: black;
          font-size: 15px;
          font-weight: 700;
          font-family: "Poppins", sans-serif;
          cursor: pointer;
        //   box-shadow: 0 14px 28px rgba(9, 137, 255, 0.24);
          transition: all 0.25s ease;
        }

        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          // box-shadow: 0 18px 34px rgba(9, 137, 255, 0.3);
        }

        .auth-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .auth-loading-text {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .auth-loader {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255, 255, 255, 0.45);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: auth-spin 0.7s linear infinite;
        }

        @keyframes auth-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 575px) {
          .auth-form-group {
            margin-bottom: 18px;
          }

          .auth-form-control {
            height: 52px;
            border-radius: 12px;
            font-size: 13px;
          }

          .auth-submit-btn {
            height: 54px;
            border-radius: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default AuthVerifyForm;