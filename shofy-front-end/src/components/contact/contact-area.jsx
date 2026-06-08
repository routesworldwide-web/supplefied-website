'use client'
import React from "react";
import Image from "next/image";
// internal
import ContactForm from "../forms/contact-form";
import contact_icon_1 from "@assets/img/contact/contact-icon-1.png";
import contact_icon_2 from "@assets/img/contact/contact-icon-2.png";
import contact_icon_3 from "@assets/img/contact/contact-icon-3.png";

const ContactArea = () => {
  return (
    <>
      <section className="tp-contact-area pb-100">
        <div className="container">
          <div className="tp-contact-inner">
            <div className="row">
              <div className="col-xl-9 col-lg-8">
                <div className="tp-contact-wrapper">
                  <h3 className="tp-contact-title">Sent A Message</h3>

                  <div className="tp-contact-form">
                    {/* form start */}
                    <ContactForm />
                    {/* form end */}
                    <p className="ajax-response"></p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4">
                <div className="tp-contact-info-wrapper">
                  <div className="tp-contact-info-item">
                    <div className="tp-contact-info-icon">
                      <span>
                        <Image src={contact_icon_1} alt="contact-icon" />
                      </span>
                    </div>
                    <div className="tp-contact-info-content">
                      <p data-info="mail">
                        <a href="mailto:Supplefied@gmail.com">Supplefied@gmail.com</a>
                      </p>
                      <p data-info="phone">
                        <a href="tel:+919891238727">+91 9891238727</a>
                      </p>
                    </div>
                  </div>
                  <div className="tp-contact-info-item">
                    <div className="tp-contact-info-icon">
                      <span>
                        <Image src={contact_icon_2} alt="contact-icon" />
                      </span>
                    </div>
                    <div className="tp-contact-info-content">
                      <p>
                        <a
                          href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7008.789373476795!2d77.20214519999999!3d28.557908599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3fe676052af%3A0xb31e5b63202a2df2!2sIofficespace%20Green%20park!5e0!3m2!1sen!2sin!4v1780920936302!5m2!1sen!2sin"
                          target="_blank"
                        >
                          400-A AJIT SINGH HOUSE, YUSUF SARAI COMMERCIAL COMPLEX, GREEN PARK METRO STATION-110016
                        </a>
                       
                      </p>
                    </div>
                  </div>
                  <div className="tp-contact-info-item">
                    <div className="tp-contact-info-icon">
                      <span>
                        <Image src={contact_icon_3} alt="contact-icon" />
                      </span>
                    </div>
                    <div className="tp-contact-info-content">
                      <div className="tp-contact-social-wrapper mt-5">
                        <h4 className="tp-contact-social-title">
                          Find on social media
                        </h4>

                        <div className="tp-contact-social-icon">
                          <a href="https://www.instagram.com/supplefied360?igsh=MTh2ajlmNThwbXo4Mg==">
                            <i className="fa-brands fa-instagram"></i>
                          </a>
                          {/* <a href="#">
                            <i className="fa-brands fa-twitter"></i>
                          </a>
                          <a href="#">
                            <i className="fa-brands fa-linkedin-in"></i>
                          </a> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactArea;
