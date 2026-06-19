'use client';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
//internal import
import useCartInfo from "./use-cart-info";
import { set_shipping } from "@/redux/features/order/orderSlice";
import { set_coupon } from "@/redux/features/coupon/couponSlice";
import { notifyError, notifySuccess } from "@/utils/toast";
import {useCreateRazorpayOrderMutation,useSaveOrderMutation} from "@/redux/features/order/orderApi";
import {
  useValidateCouponMutation,
} from "@/redux/features/coupon/couponApi";
import { clearCart } from "@/redux/features/cartSlice";
import { getLineTotal } from "@/utils/pricing";
import { getProductTypeLabel } from "@/utils/product-type-label";
import {
  useAddShippingAddressMutation,
  useGetShippingAddressesQuery,
  useUpdateShippingAddressMutation,
} from "@/redux/features/user/userAddressApi";

const CHECKOUT_ADDRESS_FIELDS = [
  "firstName",
  "lastName",
  "country",
  "address",
  "city",
  "zipCode",
  "contactNo",
  "email",
  "orderNote",
];

const pickCheckoutAddress = (data = {}) => {
  return CHECKOUT_ADDRESS_FIELDS.reduce((address, field) => {
    address[field] = data[field] || "";
    return address;
  }, {});
};

const SHIPPING_THRESHOLD = 200;
const LOW_ORDER_SHIPPING_COST = 40;

const useCheckoutSubmit = () => {
  const [validateCoupon, { isLoading: isValidatingCoupon }] =
    useValidateCouponMutation();
  // addOrder
  const [saveOrder, {}] = useSaveOrderMutation();
  // create Razorpay order
  const [createRazorpayOrder, {}] = useCreateRazorpayOrderMutation();
  // user
  const { user } = useSelector((state) => state.auth);
  const { data: savedAddresses = [], isLoading: isAddressLoading } =
    useGetShippingAddressesQuery(user?._id, { skip: !user?._id });
  const [addShippingAddress, { isLoading: isSavingAddress }] =
    useAddShippingAddressMutation();
  const [updateShippingAddress, { isLoading: isUpdatingAddress }] =
    useUpdateShippingAddressMutation();
  // cart_products
  const { cart_products } = useSelector((state) => state.cart);
  // shipping_info
  const { shipping_info } = useSelector((state) => state.order);
  // total amount
  const { total, setTotal } = useCartInfo();
  // couponInfo
  const [couponInfo, setCouponInfo] = useState({});
  //cartTotal
  const [cartTotal, setCartTotal] = useState("");
  // minimumAmount
  const [minimumAmount, setMinimumAmount] = useState(0);
  // shippingCost
  const [shippingCost, setShippingCost] = useState(0);
  // discountAmount
  const [discountAmount, setDiscountAmount] = useState(0);
  // discountPercentage
  const [discountPercentage, setDiscountPercentage] = useState(0);
  // discountProductType
  const [discountProductType, setDiscountProductType] = useState("");
  // isCheckoutSubmit
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  // coupon apply message
  const [couponApplyMsg,setCouponApplyMsg] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const {register,handleSubmit,setValue,formState: { errors }} = useForm();
  const [selectedAddressId, setSelectedAddressId] = useState("");

  let couponRef = useRef("");

  useEffect(() => {
    setShippingCost(total > 0 && total < SHIPPING_THRESHOLD ? LOW_ORDER_SHIPPING_COST : 0);
  }, [total]);

  useEffect(() => {
    if (localStorage.getItem("couponInfo")) {
      const data = localStorage.getItem("couponInfo");
      const coupon = JSON.parse(data);
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountPercentage);
      setMinimumAmount(coupon.minimumAmount);
      setDiscountProductType(coupon.productType);
    }
  }, []);

  useEffect(() => {
    if ((minimumAmount > 0 && total < minimumAmount) || cart_products.length === 0) {
      setDiscountPercentage(0);
      setCouponInfo({});
      localStorage.removeItem("couponInfo");
    }
  }, [minimumAmount, total, cart_products]);

  // Keep checkout totals aligned with the discounted cart line totals.
  useEffect(() => {
    const result = cart_products?.filter(
      (p) => p.productType === discountProductType
    );
    const discountProductTotal = result?.reduce(
      (preValue, currentValue) =>
        preValue + getLineTotal(currentValue),
      0
    );
    let subTotal = Number((total + shippingCost).toFixed(2));
    let discountTotal = Number(
      (discountProductTotal * (discountPercentage / 100)).toFixed(2)
    );
    let totalValue = Number((subTotal - discountTotal).toFixed(2));
    setDiscountAmount(discountTotal);
    setCartTotal(totalValue);
  }, [
    total,
    shippingCost,
    discountPercentage,
    cart_products,
    discountProductType,
  ]);

  // handleCouponCode
  const handleCouponCode = async (e) => {
    e.preventDefault();

    if (!couponRef.current?.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    if (isValidatingCoupon) return;
    let coupon;
    try {
      coupon = await validateCoupon(couponRef.current.value.trim()).unwrap();
    } catch (error) {
      notifyError(
        error?.data?.message || "This coupon is inactive, expired, or invalid!"
      );
      return;
    }

    if (total < coupon.minimumAmount) {
      notifyError(
        `Minimum ₹${coupon.minimumAmount} required to apply this coupon!`
      );
      return;
    } else {
      setCouponApplyMsg(`Your Coupon ${coupon.title} is applied on ${getProductTypeLabel(coupon.productType)} products!`)
      setCouponInfo(coupon);
      setMinimumAmount(coupon.minimumAmount);
      setDiscountProductType(coupon.productType);
      setDiscountPercentage(coupon.discountPercentage);
      dispatch(set_coupon(coupon));
      setTimeout(() => {
        couponRef.current.value = "";
        setCouponApplyMsg("")
      }, 5000);
    }
  };

  //set values
  useEffect(() => {
    const userShippingInfo =
      shipping_info?.userId === user?._id ? shipping_info : {};

    setValue("firstName", userShippingInfo.firstName || "");
    setValue("lastName", userShippingInfo.lastName || "");
    setValue("country", userShippingInfo.country || "");
    setValue("address", userShippingInfo.address || "");
    setValue("city", userShippingInfo.city || "");
    setValue("zipCode", userShippingInfo.zipCode || "");
    setValue("contactNo", userShippingInfo.contactNo || "");
    setValue("email", userShippingInfo.email || user?.email || "");
    setValue("orderNote", userShippingInfo.orderNote || "");
  }, [user, setValue, shipping_info, router]);

  const fillAddressForm = (address) => {
    CHECKOUT_ADDRESS_FIELDS.forEach((field) => {
      setValue(field, address?.[field] || "", { shouldDirty: true });
    });
  };

  const handleUseSavedAddress = (address) => {
    setSelectedAddressId(address?._id || "");
    fillAddressForm(address);
    setValue("saveAddress", false);
    setValue("updateAddress", false);
  };

  const handleUseNewAddress = () => {
    setSelectedAddressId("");
    fillAddressForm({ email: user?.email || "" });
    setValue("saveAddress", false);
    setValue("updateAddress", false);
  };

  const syncAddressIfRequested = async (data) => {
    if (selectedAddressId && data.updateAddress) {
      try {
        await updateShippingAddress({
          id: selectedAddressId,
          ...pickCheckoutAddress(data),
        }).unwrap();
        notifySuccess("Shipping address updated");
        return true;
      } catch (error) {
        notifyError(error?.data?.message || "Shipping address could not be updated");
        return false;
      }
    }

    if (!data.saveAddress) {
      return true;
    }

    if (savedAddresses.length >= 3) {
      notifyError("You can save up to 3 shipping addresses");
      return false;
    }

    try {
      await addShippingAddress(pickCheckoutAddress(data)).unwrap();
      notifySuccess("Shipping address saved");
      return true;
    } catch (error) {
      notifyError(error?.data?.message || "Shipping address could not be saved");
      return false;
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const clearCheckoutState = () => {
    dispatch(clearCart());
    localStorage.removeItem("couponInfo");
    setIsCheckoutSubmit(false);
  };

  const handleOrderSuccess = (orderId) => {
    clearCheckoutState();
    notifySuccess("Your Order Confirmed!");
    router.push(`/order/${orderId}`);
  };

  const saveOrderAndRedirect = async (orderInfo) => {
    const result = await saveOrder(orderInfo);

    if (result?.error) {
      notifyError(result?.error?.data?.message || "Order could not be saved");
      setIsCheckoutSubmit(false);
      return;
    }

    handleOrderSuccess(result.data?.order?._id);
  };

  const handlePaymentWithRazorpay = async (orderInfo) => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      notifyError("Razorpay could not be loaded. Please try again.");
      setIsCheckoutSubmit(false);
      return;
    }

    try {
      const paymentOrder = await createRazorpayOrder({
        amount: orderInfo.totalAmount,
      }).unwrap();

      const razorpayOrder = paymentOrder?.order;

      if (!razorpayOrder?.id || !paymentOrder?.key) {
        notifyError("Razorpay order could not be created");
        setIsCheckoutSubmit(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: paymentOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Supplefied",
        description: "Order payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: orderInfo.name,
          email: orderInfo.email,
          contact: orderInfo.contact,
        },
        handler: async (response) => {
          await saveOrderAndRedirect({
            ...orderInfo,
            paymentIntent: response,
          });
        },
        modal: {
          ondismiss: () => {
            setIsCheckoutSubmit(false);
          },
        },
        theme: {
          color: "#e6da00",
        },
      });

      razorpay.on("payment.failed", (response) => {
        notifyError(response?.error?.description || "Razorpay payment failed");
        setIsCheckoutSubmit(false);
      });

      razorpay.open();
    } catch (error) {
      notifyError(error?.data?.message || "Razorpay payment could not start");
      setIsCheckoutSubmit(false);
    }
  };

  // submitHandler
  const submitHandler = async (data) => {
    dispatch(set_shipping({ ...data, userId: user?._id }));
    setIsCheckoutSubmit(true);

    if (couponInfo?.couponCode && discountAmount > 0) {
      try {
        await validateCoupon(couponInfo.couponCode).unwrap();
      } catch (error) {
        setCouponInfo({});
        setMinimumAmount(0);
        setDiscountPercentage(0);
        setDiscountProductType("");
        localStorage.removeItem("couponInfo");
        setIsCheckoutSubmit(false);
        notifyError(
          error?.data?.message ||
            "This coupon is no longer active. Please review your total."
        );
        return;
      }
    }

    const isAddressSynced = await syncAddressIfRequested(data);

    if (!isAddressSynced) {
      setIsCheckoutSubmit(false);
      return;
    }

    let orderInfo = {
      name: `${data.firstName} ${data.lastName}`,
      address: data.address,
      contact: data.contactNo,
      email: data.email,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      shippingOption: shippingCost > 0 ? "low-order-shipping" : "free-shipping",
      status: "Pending",
      cart: cart_products,
      paymentMethod: data.payment,
      subTotal: total,
      shippingCost: shippingCost,
      discount: discountAmount,
      coupon: discountAmount > 0 ? {
        title: couponInfo?.title,
        couponCode: couponInfo?.couponCode,
        discountPercentage: couponInfo?.discountPercentage,
        productType: couponInfo?.productType,
        discountAmount,
      } : undefined,
      totalAmount: cartTotal,
      orderNote:data.orderNote,
      user: `${user?._id}`,
    };
    if (data.payment === 'Razorpay') {
      return handlePaymentWithRazorpay(orderInfo);
    }
    if (data.payment === 'COD') {
      return saveOrderAndRedirect(orderInfo);
    }
  };

  return {
    handleCouponCode,
    couponRef,
    discountAmount,
    total,
    shippingCost,
    shippingThreshold: SHIPPING_THRESHOLD,
    discountPercentage,
    discountProductType,
    couponInfo,
    isCheckoutSubmit,
    setTotal,
    register,
    errors,
    submitHandler,
    handleSubmit,
    cartTotal,
    isCheckoutSubmit,
    couponApplyMsg,
    savedAddresses,
    isAddressLoading,
    isSavingAddress: isSavingAddress || isUpdatingAddress,
    selectedAddressId,
    handleUseSavedAddress,
    handleUseNewAddress,
  };
};

export default useCheckoutSubmit;
