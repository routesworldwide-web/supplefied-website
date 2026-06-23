'use client';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// internal
import { CloseEye, OpenEye } from '@/svg';
import ErrorMsg from '../common/error-msg';
import { useLoginUserMutation } from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/utils/toast';
import TurnstileWidget from '../common/turnstile-widget';


// schema
const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});
const LoginForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  // onSubmit
  const onSubmit = async (data) => {
    if (captchaRequired && !turnstileToken) {
      return notifyError("Please complete the security verification.");
    }

    try {
      await loginUser({
        email: data.email?.trim().toLowerCase(),
        password: data.password,
        ...(captchaRequired ? { turnstileToken } : {}),
      }).unwrap();

      notifySuccess("Login successfully");
      reset();
      router.push('/checkout');
    } catch (error) {
      const shouldRequireCaptcha = Boolean(error?.data?.captchaRequired);
      setCaptchaRequired((current) => current || shouldRequireCaptcha);
      notifyError(
        error?.data?.error ||
        error?.data?.message ||
        "Login failed"
      );

      if (captchaRequired || shouldRequireCaptcha) {
        setTurnstileToken("");
        setTurnstileResetKey((key) => key + 1);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-login-input-wrapper">
        <div className="tp-login-input-box">
          <div className="tp-login-input">
            <input {...register("email", { required: `Email is required!` })} name="email" id="email" type="email" placeholder="support@supplefied.com" />
          </div>
          <div className="tp-login-input-title">
            <label htmlFor="email">Your Email</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-login-input-box">
          <div className="p-relative">
            <div className="tp-login-input">
              <input
                {...register("password", { required: `Password is required!` })}
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 character"
              />
            </div>
            <div className="tp-login-input-eye" id="password-show-toggle">
              <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <CloseEye /> : <OpenEye />}
              </span>
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <ErrorMsg msg={errors.password?.message}/>
        </div>
      </div>
      <div className="tp-login-suggetions d-sm-flex align-items-center justify-content-between mb-20">
        <div className="tp-login-remeber">
          <input id="remeber" type="checkbox" />
          <label htmlFor="remeber">Remember me</label>
        </div>
        <div className="tp-login-forgot">
          <Link href="/forgot">Forgot Password?</Link>
        </div>
      </div>
      {captchaRequired && (
        <TurnstileWidget
          action="user-login"
          onVerify={setTurnstileToken}
          resetKey={turnstileResetKey}
        />
      )}
      <div className="tp-login-bottom">
        <button
          type='submit'
          className="tp-login-btn w-100"
          disabled={isLoading || (captchaRequired && !turnstileToken)}
        >
          {isLoading ? "Signing In..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
