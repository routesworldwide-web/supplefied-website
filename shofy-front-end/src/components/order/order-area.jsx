'use client';
import React, { useRef } from "react";
import dayjs from "dayjs";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetUserOrderByIdQuery } from "@/redux/features/order/orderApi";
import PrdDetailsLoader from "@/components/loader/prd-details-loader";
import { getProductTypeLabel } from "@/utils/product-type-label";
import CancelOrder from "./cancel-order";

const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;

const formatDiscountPercent = (value) => {
  const discount = Number(value || 0);
  return `${Number.isInteger(discount) ? discount : discount.toFixed(2)}%`;
};

const getOrderQuantity = (item) => Number(item?.orderQuantity || item?.quantity || 0);

const getLinePricing = (item) => {
  const price = Number(item?.price || 0);
  const discountPercent = Number(item?.discount || 0);
  const quantity = getOrderQuantity(item);
  const unitDiscount = discountPercent > 0 ? (price * discountPercent) / 100 : 0;

  return {
    quantity,
    discountPercent,
    unitPrice: price,
    lineDiscount: unitDiscount * quantity,
    lineTotal: (price - unitDiscount) * quantity,
  };
};

const invoiceCss = `
  @page { size: A4 portrait; margin: 7mm; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .supp-invoice { width: 190mm !important; min-height: 282mm; margin: 0 auto !important; box-shadow: none !important; }
    .print-hide { display: none !important; }
  }
  .supp-invoice {  max-width: 100%; background: #fff; border: 1.5px solid #111; color: #0f1f35; font-family: Arial, Helvetica, sans-serif; }
  .supp-inner { padding: 8mm 8mm 7mm; }
  .supp-top { display: flex; justify-content: space-between; gap: 18mm; padding-bottom: 10mm; border-bottom: 1.5px solid #111; }
  .supp-brand { font-size: 30px; line-height: 1; font-weight: 900; margin: 0 0 2mm; letter-spacing: 1px; color: #001b35; }
  .supp-brand-accent { color: #e3d31d; }
  .supp-tagline { font-size: 12px; margin: 0 0 9mm; color: #10223a; }
  .supp-address { font-size: 9.5px; line-height: 1.75; margin: 0; color: #10223a; }
  .supp-title { font-size: 27px; font-weight: 900; color: #e3d31d; letter-spacing: 6px; text-align: right; margin: 0 0 9mm; }
  .supp-meta { font-size: 12px; line-height: 2; text-align: right; color: #10223a; }
  .supp-bill { padding: 7mm 0 8mm; font-size: 12px; line-height: 2.05; }
  .supp-bill p { margin: 0; }
  .supp-label { color: #000; font-weight: 900; }
  .supp-table { width: 100%; border-collapse: collapse; font-size: 9.4px; margin-bottom: 7mm; color: #001b35; }
  .supp-table th, .supp-table td { border: 1.2px solid #111; padding: 3.2mm 2.7mm; vertical-align: middle; }
  .supp-table th { color: #001b35; font-weight: 900; text-transform: uppercase; background: #fff; }
  .supp-table td:nth-child(2), .supp-table th:nth-child(2) { text-align: left; }
  .supp-table td:nth-child(1), .supp-table td:nth-child(3), .supp-table td:nth-child(4), .supp-table td:nth-child(5), .supp-table td:nth-child(6),
  .supp-table th:nth-child(1), .supp-table th:nth-child(3), .supp-table th:nth-child(4), .supp-table th:nth-child(5), .supp-table th:nth-child(6) { text-align: center; }
  .supp-table td:nth-child(6) { text-align: right; }
  .supp-summary { display: grid; grid-template-columns: repeat(4, 1fr); border: 1.2px solid #111; margin-bottom: 4.5mm; }
  .supp-summary-cell { min-height: 23mm; padding: 4.4mm 3mm; text-align: center; border-right: 1.2px solid #111; }
  .supp-summary-cell:last-child { border-right: 0; }
  .supp-summary-cell h5 { margin: 0 0 4mm; font-size: 10px; color: #001b35; font-weight: 900; text-transform: uppercase; }
  .supp-summary-cell p { margin: 0; font-size: 16px; font-weight: 900; color: #4b5563; }
  .supp-total p { font-size: 24px; }
  .supp-coupon { min-height: 10mm; text-align: center; color: #00712d; font-weight: 900; font-size: 10.5px; line-height: 1.7; }
  .supp-thanks { border-top: 1.2px solid #111; border-bottom: 1px solid #00712d; padding: 5mm 0; text-align: center; font-size: 10.5px; line-height: 1.55; color: #111; }
`;

const getPrintableStyles = () => {
  if (typeof document === "undefined") return "";
  return Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join("");
};

const printElement = ({ element, title }) => {
  if (!element || typeof window === "undefined") return;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        ${getPrintableStyles()}
        <style>${invoiceCss}</style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};

const getBillingAddress = ({ address, city, country, zipCode }) =>
  [address, city, country].filter(Boolean).join(", ") + (zipCode ? ` - ${zipCode}` : "");

const OrderArea = ({ orderId }) => {
  const printRef = useRef(null);
  const { data: order, isError, isLoading } = useGetUserOrderByIdQuery(orderId);

  const handlePrint = () => {
    printElement({
      element: printRef.current,
      title: order?.order?.invoice ? `Invoice-${order.order.invoice}` : "Invoice",
    });
  };

  let content = null;

  if (isLoading) {
    content = <PrdDetailsLoader loading={isLoading} />;
  }

  if (isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError) {
    const {
      name, address, country, city, zipCode, contact, invoice, createdAt, cart,
      shippingCost, discount, totalAmount, paymentMethod, coupon, status,
      cancellation,
    } = order.order;

    const productDiscountTotal = cart.reduce(
      (total, item) => total + getLinePricing(item).lineDiscount,
      0
    );
    const couponDiscount = Number(discount || 0);
    const totalDiscount = productDiscountTotal + couponDiscount;
    const couponSummary = coupon?.couponCode
      ? `${coupon.couponCode} - ${formatDiscountPercent(coupon.discountPercentage)} off ${getProductTypeLabel(coupon.productType)}`
      : null;

    content = (
      <section style={{ padding: "32px 0" }}>
        <style>{invoiceCss}</style>
        <div className="container">
          <div className="print-hide" style={{
            background: status === "cancel" ? "#fef2f2" : "var(--tp-common-green, #f0fdf4)",
            border: status === "cancel" ? "0.5px solid #fecaca" : "0.5px solid #bbf7d0",
            borderRadius: "8px",
            padding: "10px 18px",
            fontSize: "14px",
            color: status === "cancel" ? "#b91c1c" : "#15803d",
            marginBottom: "24px",
          }}>
            {status === "cancel" ? (
              <>
                Order cancelled
                {cancellation?.reason ? ` — ${cancellation.reason}` : "."}
              </>
            ) : (
              <>
                Thank you, <strong>{name}</strong> - your order has been received!
              </>
            )}
          </div>

          <div ref={printRef} className="supp-invoice">
            <div className="supp-inner">
              <div className="supp-top">
                <div>
                  <h1 className="supp-brand">Supplef<span className="supp-brand-accent">i</span>ed</h1>
                  <p className="supp-tagline">Supplements. Simplified.</p>
                  <p className="supp-address">
                    400-A Ajit Singh House, Yusuf Sarai<br />
                    Commercial Complex,<br />
                    Green Park Metro Station - 110016
                  </p>
                </div>
                <div>
                  <h2 className="supp-title">INVOICE</h2>
                  <div className="supp-meta">
                    <p><strong>Invoice ID:</strong> #{invoice}</p>
                    <p><strong>Date:</strong> {dayjs(createdAt).format("MMMM D, YYYY")}</p>
                  </div>
                </div>
              </div>

              <div className="supp-bill">
                <p><span className="supp-label">BILL TO :</span> {name}</p>
                <p><span className="supp-label">Address :</span> {getBillingAddress({ address, city, country, zipCode })}</p>
                <p><span className="supp-label">Mobile Number :</span> {contact}</p>
              </div>

              <table className="supp-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => {
                    const pricing = getLinePricing(item);
                    return (
                      <tr key={item._id || item.productId || index}>
                        <td>{index + 1}</td>
                        <td>{item.title}</td>
                        <td>{pricing.quantity}</td>
                        <td>{formatPrice(pricing.unitPrice)}</td>
                        <td>
                          {pricing.discountPercent > 0
                            ? `${formatDiscountPercent(pricing.discountPercent)} (${formatPrice(pricing.lineDiscount)})`
                            : formatPrice(0)}
                        </td>
                        <td>{formatPrice(pricing.lineTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="supp-summary">
                <div className="supp-summary-cell">
                  <h5>Payment Method</h5>
                  <p>{paymentMethod}</p>
                </div>
                <div className="supp-summary-cell">
                  <h5>Shipping Cost</h5>
                  <p>{formatPrice(shippingCost)}</p>
                </div>
                <div className="supp-summary-cell">
                  <h5>Discount</h5>
                  <p>{formatPrice(totalDiscount)}</p>
                </div>
                <div className="supp-summary-cell supp-total">
                  <h5>Total Amount</h5>
                  <p>{formatPrice(totalAmount)}</p>
                </div>
              </div>

              <div className="supp-coupon">
                {couponSummary && (
                  <>
                    <div>Coupon: {couponSummary} ({formatPrice(couponDiscount)})</div>
                  </>
                )}
              </div>

              <div className="supp-thanks">
                <div>Thank you for your business! We appreciate your trust in Supplefied.</div>
              </div>
            </div>
          </div>

          <div className="print-hide" style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "16px" }}>
            <CancelOrder order={order.order} />
            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "9px 20px",
                fontSize: "13px",
                fontWeight: 500,
                borderRadius: "8px",
                border: "0.5px solid #d1d5db",
                background: "#fff",
                color: "#111827",
                cursor: "pointer",
              }}
            >
              <i className="fa-regular fa-print" aria-hidden="true" />
              Print invoice
            </button>
          </div>
        </div>
      </section>
    );
  }

  return <>{content}</>;
};

export default OrderArea;
