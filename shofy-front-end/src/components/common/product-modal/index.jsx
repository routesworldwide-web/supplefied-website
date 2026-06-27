import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactModal from "react-modal";
// internal
import { handleModalClose } from "@/redux/features/productModalSlice";
import DetailsThumbWrapper from "@/components/product-details/details-thumb-wrapper";
import DetailsWrapper from "@/components/product-details/details-wrapper";
import { initialOrderQuantity } from "@/redux/features/cartSlice";

const customStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(1, 15, 28, 0.6)",
    zIndex: 99999,
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "min(1120px, calc(100vw - 48px))",
    maxHeight: "calc(100vh - 48px)",
    overflow: "hidden",
    border: "1px solid #ccc",
    background: "#fff",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "20px",
  },
};

const ProductModal = () => {
  const { productItem, isModalOpen } = useSelector(
    (state) => state.productModal
  );
  const { img, imageURLs,status } = productItem || {};
  const [activeImg, setActiveImg] = useState(img);
  const [loading,setLoading] = useState(false);
  const [appElement, setAppElement] = useState(null);
  const dispatch = useDispatch();
  const galleryImages = [
    { img },
    ...(imageURLs?.filter((item) => item?.img && item.img !== img) || []),
  ];
  // active image change when img change
  useEffect(() => {
    setActiveImg(img);
    dispatch(initialOrderQuantity())
    setLoading(false)
  }, [img,dispatch]);

  useEffect(() => {
    setAppElement(document.getElementById("wrapper"));
  }, []);

  // handle image active
  const handleImageActive = (item) => {
    setActiveImg(item.img);
    setLoading(true)
  };

  return (
    <div>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => dispatch(handleModalClose())}
        style={customStyles}
        appElement={appElement}
        ariaHideApp={Boolean(appElement)}
        contentLabel="Product Modal"
        className="ReactModal__Content tp-product-quick-view-modal"
        overlayClassName="ReactModal__Overlay tp-product-quick-view-overlay"
      >
        <div className="tp-product-modal">
          <div className="tp-product-modal-content d-lg-flex">
            <button
              onClick={() => dispatch(handleModalClose())}
              type="button"
              className="tp-product-modal-close-btn"
            >
              <i className="fa-regular fa-xmark"></i>
            </button>
            {/* product-details-thumb-wrapper start */}
            <DetailsThumbWrapper
              activeImg={activeImg}
              handleImageActive={handleImageActive}
              imageURLs={galleryImages}
              imgWidth={416}
              imgHeight={480}
              loading={loading}
              status={status}
            />
            {/* product-details-thumb-wrapper end */}

            {/* product-details-wrapper start */}
            <DetailsWrapper
              productItem={productItem}
              handleImageActive={handleImageActive}
              activeImg={activeImg}
            />
            {/* product-details-wrapper end */}
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default ProductModal;
