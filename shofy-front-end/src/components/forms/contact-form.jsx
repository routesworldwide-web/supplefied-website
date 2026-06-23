'use client'
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { isValidEmail } from "@/utils/emailValidation";
// internal
import ErrorMsg from "../common/error-msg";

import { notifyError, notifySuccess } from "@/utils/toast";
import { useSubmitContactMessageMutation } from "@/redux/features/contactApi";
import TurnstileWidget from "../common/turnstile-widget";


// schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string()
    .required("Email is required")
    .test('valid-email', 'Please enter a valid email address', (value) => {
      return isValidEmail(value);
    })
    .label("Email"),
  subject: Yup.string().required().label("Subject"),
  message: Yup.string().required().label("Subject"),
  remember: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions to proceed.")
    .label("Terms and Conditions"),
});

const ContactForm = () => {
    const [turnstileToken, setTurnstileToken] = useState("");
    const [turnstileResetKey, setTurnstileResetKey] = useState(0);

    const [submitContactMessage, { isLoading }] =
      useSubmitContactMessageMutation();

    // react hook form
    const {register,handleSubmit,formState: { errors },reset} = useForm({
      resolver: yupResolver(schema),
    });
    // on submit
    const onSubmit = async (data) => {
      if (!turnstileToken) {
        return notifyError("Please complete the security verification.");
      }

      try {
        const result = await submitContactMessage({
          name: data.name.trim(),
          email: data.email.trim(),
          subject: data.subject.trim(),
          message: data.message.trim(),
          turnstileToken,
        }).unwrap();

        notifySuccess(result.message || "Message sent successfully!");
        reset();
      } catch (error) {
        notifyError(
          error?.data?.message || "Your message could not be submitted."
        );
      } finally {
        setTurnstileToken("");
        setTurnstileResetKey((key) => key + 1);
      }
    };


  return (
    <form onSubmit={handleSubmit(onSubmit)} id="contact-form">
      <div className="tp-contact-input-wrapper">
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("name", { required: `Name is required!` })} name="name" id="name" type="text" placeholder="Shahnewaz Sakil" disabled={isLoading} />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="name">Your Name</label>
          </div>
          <ErrorMsg msg={errors.name?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("email", { required: `Email is required!` })} name="email" id="email" type="email" placeholder="support@supplefied.com" disabled={isLoading} />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="email">Your Email</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("subject", { required: `Subject is required!` })} name="subject" id="subject" type="text" placeholder="Write your subject" disabled={isLoading} />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="subject">Subject</label>
          </div>
          <ErrorMsg msg={errors.subject?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <textarea {...register("message", { required: `Message is required!` })} id="message" name="message" placeholder="Write your message here..." disabled={isLoading} />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="message">Your Message</label>
          </div>
          <ErrorMsg msg={errors.message?.message} />
        </div>
      </div>
      <div className="tp-contact-suggetions mb-20">
        <div className="tp-contact-remeber">
          <input  {...register("remember", {required: `Terms and Conditions is required!`})} name="remember" id="remember" type="checkbox" disabled={isLoading} />
          <label htmlFor="remember">Save my name, email, and website in this browser for the next time I comment.</label>
          <ErrorMsg msg={errors.remember?.message} />
        </div>
      </div>
      <TurnstileWidget
        action="contact"
        onVerify={setTurnstileToken}
        resetKey={turnstileResetKey}
      />
      <div className="tp-contact-btn">
        <button type="submit" disabled={isLoading || !turnstileToken}>

          {isLoading ? "Sending..." : "Send Message"}

        </button>
      </div>
    </form>
  );
};

export default ContactForm;
