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
    .test('valid-email', 'Please enter a valid email address', (value) => {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify`, {
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
      });

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
        // Keep the success message visible
        setTimeout(() => {
          setIsAuthenticated(false);
        }, 5000);
      } else {
        // Show specific error message
        const errorMessage = result.message || "Authentication failed. Please try again.";
        
        if (result.errorType === 'CODE_ALREADY_USED') {
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className="tp-form-group mb-20">
          <label htmlFor="name" className="tp-form-label">
            Full Name
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            placeholder="Enter your full name"
            className="tp-form-control"
            disabled={isLoading}
          />
          {errors.name && (
            <span className="tp-form-error" style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px" }}>
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Mobile Field */}
        <div className="tp-form-group mb-20">
          <label htmlFor="mobile" className="tp-form-label">
            Mobile Number
          </label>
          <input
            {...register("mobile")}
            id="mobile"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            className="tp-form-control"
            disabled={isLoading}
            maxLength="10"
          />
          {errors.mobile && (
            <span className="tp-form-error" style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px" }}>
              {errors.mobile.message}
            </span>
          )}
        </div>

        {/* Email Field */}
        <div className="tp-form-group mb-20">
          <label htmlFor="email" className="tp-form-label">
            Email Address
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="Enter your email address"
            className="tp-form-control"
            disabled={isLoading}
          />
          {errors.email && (
            <span className="tp-form-error" style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px" }}>
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Code Field */}
        <div className="tp-form-group mb-30">
          <label htmlFor="code" className="tp-form-label">
            Authentication Code
          </label>
          <input
            {...register("code")}
            id="code"
            type="text"
            placeholder="Enter authentication code"
            className="tp-form-control"
            disabled={isLoading}
            style={{ textTransform: "uppercase" }}
          />
          {errors.code && (
            <span className="tp-form-error" style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px" }}>
              {errors.code.message}
            </span>
          )}
        </div>

        {/* Success Message */}
        {isAuthenticated && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              backgroundColor: "#d4edda",
              color: "#155724",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
              border: "1px solid #c3e6cb",
            }}
          >
            ✓ User authentication successful!
          </div>
        )}

        {/* Submit Button */}
        <div className="tp-form-group mb-20">
          <button
            type="submit"
            className="tp-btn tp-btn-2 tp-width-100"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Verifying..." : "Verify Account"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AuthVerifyForm;
