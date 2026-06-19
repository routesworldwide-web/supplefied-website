'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "@/redux/features/auth/authSlice";
import { apiSlice } from "@/redux/api/apiSlice";
import { clearCartState } from "@/redux/features/cartSlice";
import { clearWishlistState } from "@/redux/features/wishlist-slice";
import { clearCompareState } from "@/redux/features/compareSlice";
import { clear_shipping } from "@/redux/features/order/orderSlice";


// setting
function ProfileSetting({active,handleActive}) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  // handle logout
  const handleLogout = () => {
    dispatch(userLoggedOut());
    dispatch(clearCartState());
    dispatch(clearWishlistState());
    dispatch(clearCompareState());
    dispatch(clear_shipping());
    dispatch(apiSlice.util.resetApiState());
    router.push('/')
  }
  return (
    <div className="tp-header-top-menu-item tp-header-setting">
      <i className="fal fa-cog me-2 tp-header-setting-icon"></i>
      <span
        onClick={() => handleActive('setting')}
        className="tp-header-setting-toggle"
        id="tp-header-setting-toggle"
      >
        Setting
      </span>
      <ul className={active === 'setting' ? "tp-setting-list-open" : ""}>
        <li>
          <Link href="/profile"><i className="fal fa-user me-3"></i>My Profile</Link>
        </li>
        <li>
          <Link href="/wishlist"><i className="fal fa-heart me-3"></i>Wishlist</Link>
        </li>
        <li>
          <Link href="/cart"><i className="fal fa-shopping-cart me-3"></i>Cart</Link>
        </li>
        <li>
          {!user?.name &&<Link href="/login" className="cursor-pointer"><i className="fal fa-sign-in-alt me-3"></i>Login</Link>}
          {user?.name &&<a onClick={handleLogout} className="cursor-pointer"><i className="fal fa-sign-out-alt me-3"></i>Logout</a>}
        </li>
      </ul>
    </div>
  );
}

const HeaderTopRight = () => {
  const [active, setIsActive] = useState('');
  // handle active
  const handleActive = (type) => {
    if(type === active){
      setIsActive('')
    }
    else {
      setIsActive(type)
    }
  }
  return (
    <div className="tp-header-top-menu d-flex align-items-center justify-content-end">
      {/* <Language active={active} handleActive={handleActive} /> */}
      {/* <Currency active={active} handleActive={handleActive} /> */}
      <ProfileSetting active={active} handleActive={handleActive} />
    </div>
  );
};

export default HeaderTopRight;
