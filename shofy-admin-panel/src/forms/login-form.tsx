"use client"
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {useRouter} from 'next/navigation';
import { notifyError, notifySuccess } from "@/utils/toast";
import { useLoginAdminMutation } from "@/redux/auth/authApi";
import ErrorMsg from "@/app/components/common/error-msg";
import TurnstileWidget from "@/components/turnstile-widget";

// schema
const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

type LoginError = {
  data?: {
    message?: string;
    error?: string;
    captchaRequired?: boolean;
  };
  error?: string;
  message?: string;
};

const LoginForm = () => {
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();
  const router = useRouter();
  // react hook form
  const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });
  // onSubmit
  const onSubmit =async (data: { email: string; password: string }) => {
    if (captchaRequired && !turnstileToken) {
      return notifyError("Please complete the security verification.");
    }

    try {
      await loginAdmin({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        ...(captchaRequired ? { turnstileToken } : {}),
      }).unwrap();

      notifySuccess("Login successful");
      reset();

      // Give the toast a render frame before the route transition replaces the page.
      window.setTimeout(() => router.replace("/dashboard"), 150);
    } catch (error) {
      const loginError = error as LoginError;
      const errorData = loginError.data;
      const shouldRequireCaptcha = Boolean(errorData?.captchaRequired);

      setCaptchaRequired((current) => current || shouldRequireCaptcha);

      if (captchaRequired || shouldRequireCaptcha) {
        setTurnstileToken("");
        setTurnstileResetKey((key) => key + 1);
      }

      notifyError(
        errorData?.message ||
          errorData?.error ||
          loginError.error ||
          loginError.message ||
          "Login failed. Please try again."
      );
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5">
        <p className="mb-0 text-base text-black">
          Email <span className="text-red">*</span>
        </p>
        <input
          {...register("email", { required: `Email is required!` })}
          name="email"
          id="email"
          className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
          type="email"
          placeholder="Enter Your Email"
        />
        <ErrorMsg msg={errors.email?.message as string} />
      </div>
      <div className="mb-5">
        <p className="mb-0 text-base text-black">
          Password <span className="text-red">*</span>
        </p>
        <input
          {...register("password", { required: `Password is required!` })}
          id="password"
          className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
          type="password"
          placeholder="Password"
        />
        <ErrorMsg msg={errors.password?.message as string} />
      </div>
      <div className="flex items-center justify-between">
        <div className="tp-checkbox flex items-start space-x-2 mb-3">
          <input id="product-1" type="checkbox" />
          <label htmlFor="product-1" className="text-tiny">
            Remember Me
          </label>
        </div>
        <div className="mb-4">
          <a
            href="forgot.html"
            className="text-tiny font-medium text-theme border-b border-transparent hover:border-theme"
          >
            Forgot Password ?
          </a>
        </div>
      </div>
      {captchaRequired && (
        <TurnstileWidget
          action="admin-login"
          onVerify={setTurnstileToken}
          resetKey={turnstileResetKey}
        />
      )}
      <button
        type="submit"
        className="tp-btn h-[49px] w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading || (captchaRequired && !turnstileToken)}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
