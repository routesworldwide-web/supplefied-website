import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
// internal
import { CloseTwo } from '@/svg';
import logo from '@assets/img/logo/supplefied_logo2.png';
import MobileCategory from '@/layout/headers/header-com/mobile-category';
import MobileMenus from './mobile-menus';
import useSearchFormSubmit from '@/hooks/use-search-form-submit';
import { userLoggedOut } from '@/redux/features/auth/authSlice';
import { clearCartState } from '@/redux/features/cartSlice';
import { clearWishlistState } from '@/redux/features/wishlist-slice';
import { clearCompareState } from '@/redux/features/compareSlice';
import { clear_shipping } from '@/redux/features/order/orderSlice';
import { apiSlice } from '@/redux/api/apiSlice';

const OffCanvas = ({ isOffCanvasOpen, setIsCanvasOpen,categoryType = "electronics" }) => {
  const [isCategoryActive, setIsCategoryActive] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { searchText, setSearchText, handleSubmit } = useSearchFormSubmit();
  const dispatch = useDispatch();
  const router = useRouter();

  const closeCanvas = () => setIsCanvasOpen(false);

  const handleSearch = (event) => {
    handleSubmit(event);
    closeCanvas();
  };

  const handleLogout = () => {
    dispatch(userLoggedOut());
    dispatch(clearCartState());
    dispatch(clearWishlistState());
    dispatch(clearCompareState());
    dispatch(clear_shipping());
    dispatch(apiSlice.util.resetApiState());
    closeCanvas();
    router.push('/');
  };

  const accountName = user?.name?.split(' ')[0];

  return (
    <>
      <div className={`offcanvas__area offcanvas__radius ${isOffCanvasOpen ? "offcanvas-opened" : ""}`}>
        <div className="offcanvas__wrapper">
          <div className="offcanvas__close">
            <button onClick={closeCanvas} className="offcanvas__close-btn offcanvas-close-btn" aria-label="Close menu">
              <CloseTwo />
            </button>
          </div>
          <div className="offcanvas__content">
            <div className="offcanvas__top d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo logo">
                <Link href="/" onClick={closeCanvas}>
                  <Image src={logo} alt="logo" />
                </Link>
              </div>
            </div>

            <form className="offcanvas__search" onSubmit={handleSearch}>
              <i className="bi bi-search" aria-hidden="true"></i>
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search products"
                aria-label="Search products"
              />
              <button type="submit" aria-label="Submit search">
                <i className="bi bi-arrow-right"></i>
              </button>
            </form>

            <div className="offcanvas__quick-actions">
              <Link href="/wishlist" onClick={closeCanvas} className="offcanvas__quick-action">
                <span className="offcanvas__quick-icon">
                  <i className="bi bi-heart"></i>
                  {wishlist.length > 0 && <b>{wishlist.length}</b>}
                </span>
                <span>Wishlist</span>
              </Link>
              <Link href="/compare" onClick={closeCanvas} className="offcanvas__quick-action">
                <span className="offcanvas__quick-icon">
                  <i className="bi bi-arrow-left-right"></i>
                  {compareItems.length > 0 && <b>{compareItems.length}</b>}
                </span>
                <span>Compare</span>
              </Link>
              <Link href="/cart" onClick={closeCanvas} className="offcanvas__quick-action">
                <span className="offcanvas__quick-icon">
                  <i className="bi bi-bag"></i>
                  {totalQuantity > 0 && <b>{totalQuantity}</b>}
                </span>
                <span>Cart</span>
              </Link>
            </div>

            <div className="offcanvas__section">
              <span className="offcanvas__section-title">Shop</span>
              <div className="offcanvas__category">
              <button onClick={() => setIsCategoryActive(!isCategoryActive)} className="tp-offcanvas-category-toggle">
                <i className="bi bi-grid"></i>
                All Categories
              </button>
              <div className="tp-category-mobile-menu">
                <nav className={`tp-category-menu-content ${isCategoryActive ? "active" : ""}`}>
                  <MobileCategory categoryType={categoryType} isCategoryActive={isCategoryActive} />
                </nav>
              </div>
            </div>
            </div>

            <div className="offcanvas__section offcanvas__navigation">
              <span className="offcanvas__section-title">Navigation</span>
              <div className="tp-main-menu-mobile fix d-lg-none">
              <MobileMenus />
            </div>
            </div>

            <div className="offcanvas__account-card">
              <div className="offcanvas__account-heading">
                <span className="offcanvas__account-avatar">
                  <i className={`bi ${user ? 'bi-person-check' : 'bi-person'}`}></i>
                </span>
                <div>
                  <strong>{user ? `Hi, ${accountName || 'there'}` : 'Your account'}</strong>
                  <small>{user ? user.email : 'Sign in to manage your account'}</small>
                </div>
              </div>

              <div className="offcanvas__account-actions">
                {user ? (
                  <>
                    <Link href="/profile" onClick={closeCanvas}>
                      <i className="bi bi-person-gear"></i>
                      My Profile
                    </Link>
                    <button type="button" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={closeCanvas}>
                      <i className="bi bi-box-arrow-in-right"></i>
                      Login
                    </Link>
                    <Link href="/register" onClick={closeCanvas}>
                      <i className="bi bi-person-plus"></i>
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="offcanvas__support">
              <Link href="/contact" onClick={closeCanvas}>
                <i className="bi bi-headset"></i>
                <span>
                  <small>Need help?</small>
                  Contact our support team
                </span>
                <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* body overlay start */}
      <div onClick={closeCanvas} className={`body-overlay ${isOffCanvasOpen ? 'opened' : ''}`}></div>
      {/* body overlay end */}
    </>
  );
};

export default OffCanvas;
