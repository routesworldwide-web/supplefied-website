'use client';
import React from "react";
import ErrorMsg from "../common/error-msg";
import { useSelector } from "react-redux";

const CheckoutBillingArea = ({ register, errors, checkoutData }) => {
  const { user } = useSelector((state) => state.auth);
  const {
    savedAddresses = [],
    isAddressLoading,
    isSavingAddress,
    selectedAddressId,
    handleUseSavedAddress,
    handleUseNewAddress,
  } = checkoutData || {};
  const canSaveAddress = savedAddresses.length < 3;
  const isUsingSavedAddress = Boolean(selectedAddressId);
  const primaryBorderColor = "#e6da00";

  return (
    <div className="tp-checkout-bill-area">
      <h3 className="tp-checkout-bill-title">Billing Details</h3>

      {isAddressLoading && (
        <p className="mb-20">Loading saved addresses...</p>
      )}

      {!isAddressLoading && savedAddresses.length > 0 && (
        <div className="tp-checkout-bill-form mb-30">
          {/* <h4 className="tp-checkout-bill-title mb-20">Saved Addresses</h4> */}
          <div className="row g-3">
            {savedAddresses.map((address) => (
              <div key={address._id} className="col-12 ">
                <div
                  className={`d-flex align-items-center justify-content-between gap-3 p-3 border capitalize  bg-blue-gray-600${selectedAddressId === address._id
                      ? ""
                      : "border border-dark "
                    }`}
                  style={
                    selectedAddressId === address._id
                      ? { borderColor: primaryBorderColor }
                      : undefined
                  }
                >
                  {/* Address info */}
                  <div className="flex-grow-1">
                    <p className="fw-bold mb-1 text-success ">
                      <i className="fa-regular fa-location-dot me-1 fs-5 text-dark " /> {address.firstName} {address.lastName}  {address.address}, {address.city}, {address.country} — {address.zipCode}  {address.contactNo} &nbsp;|&nbsp; {address.email}
                    </p>

                    <p className="text-secondary  mb-0">

                    </p>
                  </div>

                  {/* Action button */}
                  <button
                    type="button"
                    className={`btn flex-shrink-0 rounded-0 ${selectedAddressId === address._id
                        ? "btn-outline-success"
                        : "btn-outline-dark"
                      }`}
                    onClick={() => handleUseSavedAddress(address)}
                  >
                    {selectedAddressId === address._id ? (
                      <>
                        {/* <i className="fa-regular fa-check me-1 " /> */}
                        Selected
                      </>
                    ) : (
                      "Select"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* <button
            type="button"
            className="tp-checkout-btn w-100"
            onClick={handleUseNewAddress}
          >
            Use a new address
          </button> */}
        </div>
      )}

      <div className="tp-checkout-bill-form">
        {isUsingSavedAddress && (
          <p className="mb-20">
            You can edit the selected address below. Tick update saved address
            if you want to store those changes for future orders.
          </p>
        )}
        <div className="tp-checkout-bill-inner">
          <div className="row">
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>
                  First Name <span>*</span>
                </label>
                <input
                  {...register("firstName", {
                    required: `firstName is required!`,
                  })}
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  defaultValue={user?.firstName}
                />
                <ErrorMsg msg={errors?.firstName?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>
                  Last Name <span>*</span>
                </label>
                <input
                  {...register("lastName", {
                    required: `lastName is required!`,
                  })}
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                />
                <ErrorMsg msg={errors?.lastName?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  Country <span>*</span>
                </label>
                <input
                  {...register("country", { required: `country is required!` })}
                  name="country"
                  id="country"
                  type="text"
                  placeholder="United States (US)"
                />
                <ErrorMsg msg={errors?.lastName?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>Street address</label>
                <input
                  {...register("address", { required: `Address is required!` })}
                  name="address"
                  id="address"
                  type="text"
                  placeholder="House number and street name"
                />
                <ErrorMsg msg={errors?.address?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>Town / City</label>
                <input
                  {...register("city", { required: `City is required!` })}
                  name="city"
                  id="city"
                  type="text"
                  placeholder="City"
                />
                <ErrorMsg msg={errors?.city?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>Postcode ZIP</label>
                <input
                  {...register("zipCode", { required: `zipCode is required!` })}
                  name="zipCode"
                  id="zipCode"
                  type="text"
                  placeholder="Postcode ZIP"
                />
                <ErrorMsg msg={errors?.zipCode?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  Phone <span>*</span>
                </label>
                <input
                  {...register("contactNo", {
                    required: `ContactNumber is required!`,
                  })}
                  name="contactNo"
                  id="contactNo"
                  type="text"
                  placeholder="Phone"
                />
                <ErrorMsg msg={errors?.contactNo?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  Email address <span>*</span>
                </label>
                <input
                  {...register("email", { required: `Email is required!` })}
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  defaultValue={user?.email}
                />
                <ErrorMsg msg={errors?.email?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>Order notes (optional)</label>
                <textarea
                  {...register("orderNote", { required: false })}
                  name="orderNote"
                  id="orderNote"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-save-address w-100">
                {isUsingSavedAddress ? (
                  <div className="tp-checkout-option">
                    <input
                      {...register("updateAddress", { required: false })}
                      type="checkbox"
                      id="updateAddress"
                      disabled={isSavingAddress}
                    />
                    <label htmlFor="updateAddress">
                      Update selected saved address
                    </label>
                  </div>
                ) : (
                  <div className="tp-checkout-option">
                    <input
                      {...register("saveAddress", { required: false })}
                      type="checkbox"
                      id="saveAddress"
                      disabled={!canSaveAddress || isSavingAddress}
                    />
                    <label htmlFor="saveAddress">
                      Save this address for future orders
                    </label>
                  </div>
                )}
                {!isUsingSavedAddress && !canSaveAddress && (
                  <p className="mt-10 mb-0">
                    You can save up to 3 addresses.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutBillingArea;
