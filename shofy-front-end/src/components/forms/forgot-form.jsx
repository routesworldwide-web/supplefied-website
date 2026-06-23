'use client';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// internal
import ErrorMsg from "../common/error-msg";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import TurnstileWidget from "../common/turnstile-widget";

// schema
const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

const ForgotForm = () => {
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
    // react hook form
    const {register,handleSubmit,formState: { errors },reset} = useForm({
      resolver: yupResolver(schema), 
    });
    // onSubmit
    const onSubmit = async (data) => {
      if (!turnstileToken) {
        return notifyError("Please complete the security verification.");
      }

      try {
        const result = await resetPassword({
          verifyEmail: data.email,
          turnstileToken,
        }).unwrap();
        notifySuccess(result?.message);
        reset();
      } catch (error) {
        notifyError(error?.data?.message || "Password reset request failed.");
      } finally {
        setTurnstileToken("");
        setTurnstileResetKey((key) => key + 1);
      }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-login-input-wrapper">
        <div className="tp-login-input-box">
          <div className="tp-login-input">
            <input
              {...register("email", { required: `Email is required!` })}
              name="email"
              id="email"
              type="email"
              placeholder="support@supplefied.com"
            />
          </div>
          <div className="tp-login-input-title">
            <label htmlFor="email">Your Email</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
      </div>
      <TurnstileWidget
        action="forgot-password"
        onVerify={setTurnstileToken}
        resetKey={turnstileResetKey}
      />
      <div className="tp-login-bottom mb-15">
        <button
          type="submit"
          className="tp-login-btn w-100"
          disabled={isLoading || !turnstileToken}
        >
          {isLoading ? "Sending..." : "Send Mail"}
        </button>
      </div>
    </form>
  );
};

export default ForgotForm;
