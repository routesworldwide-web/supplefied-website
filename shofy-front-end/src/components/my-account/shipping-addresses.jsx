'use client';
import React from "react";
import { useSelector } from "react-redux";
import ErrorMsg from "../common/error-msg";
import {
  useDeleteShippingAddressMutation,
  useGetShippingAddressesQuery,
} from "@/redux/features/user/userAddressApi";
import { notifyError, notifySuccess } from "@/utils/toast";

const ShippingAddresses = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    data: addresses = [],
    isLoading,
    isError,
  } = useGetShippingAddressesQuery(user?._id, { skip: !user?._id });
  const [deleteShippingAddress, { isLoading: isDeleting }] =
    useDeleteShippingAddressMutation();

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Remove this shipping address?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteShippingAddress(id).unwrap();
      notifySuccess("Shipping address removed");
    } catch (error) {
      notifyError(error?.data?.message || "Shipping address could not be removed");
    }
  };

  if (isLoading) {
    return <p>Loading shipping addresses...</p>;
  }

  if (isError) {
    return <ErrorMsg msg="Could not load shipping addresses" />;
  }

  return (
    <div className="profile__info">
      <h3 className="profile__info-title">Shipping Addresses</h3>
      <div className="profile__info-content">
        {addresses.length === 0 && (
          <div
            style={{ height: "210px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <i
                style={{ fontSize: "30px" }}
                className="fa-solid fa-location-dot"
              ></i>
              <p>You have no saved shipping addresses yet.</p>
            </div>
          </div>
        )}

        {addresses.length > 0 && (
          <div className="row">
            {addresses.map((address) => (
              <div key={address._id} className="col-md-6">
                <div className="tp-checkout-input p-3 mb-20 border">
                  <p className="mb-5">
                    <strong>
                      {address.firstName} {address.lastName}
                    </strong>
                  </p>
                  <p className="mb-5">{address.address}</p>
                  <p className="mb-5">
                    {address.city}, {address.country} - {address.zipCode}
                  </p>
                  <p className="mb-5">{address.contactNo}</p>
                  <p className="mb-15">{address.email}</p>
                  {address.orderNote && (
                    <p className="mb-15">Note: {address.orderNote}</p>
                  )}
                  <button
                    type="button"
                    className="tp-checkout-btn w-100"
                    disabled={isDeleting}
                    onClick={() => handleDelete(address._id)}
                  >
                    Remove address
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mb-0">
          To add or edit an address, use the billing details form during checkout.
          You can save up to 3 addresses.
        </p>
      </div>
    </div>
  );
};

export default ShippingAddresses;
