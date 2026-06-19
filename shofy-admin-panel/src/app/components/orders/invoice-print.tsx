import React from "react";
import { Order } from "@/types/order-amount-type";
import dayjs from "dayjs";
import {
  formatDiscountPercent,
  formatPrice,
  getCartTotals,
  getLinePricing,
} from "@/utils/pricing";

type IPropType = {
  orderData: Order;
};

const invoiceStyles = `
  @page { size: A4 portrait; margin: 8mm; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .supp-invoice { width: 190mm !important; min-height: 277mm; margin: 0 auto !important; box-shadow: none !important; }
  }
  .supp-invoice { width: 190mm; max-width: 100%; margin: 0 auto; background: #fff; border: 1px solid #d7d7d7; color: #111; font-family: Arial, Helvetica, sans-serif; }
  .supp-inner { padding: 10mm 9mm 6mm; }
  .supp-top { display: flex; justify-content: space-between; gap: 18mm; padding-bottom: 9mm; border-bottom: 1px solid #d3d3d3; }
  .supp-brand { font-size: 34px; line-height: 1; font-weight: 800; margin: 0 0 4px; letter-spacing: -1px; }
  .supp-tagline { font-size: 15px; margin: 0 0 8mm; color: #333; }
  .supp-address { font-size: 12px; line-height: 1.65; margin: 0; color: #222; }
  .supp-title { font-size: 28px; font-weight: 800; color: #3c8d35; letter-spacing: 1px; text-align: right; margin: 0 0 10mm; }
  .supp-meta { font-size: 12px; line-height: 1.7; text-align: right; color: #222; }
  .supp-bill { padding: 7mm 0 7mm; font-size: 12px; line-height: 1.75; }
  .supp-bill p { margin: 0; }
  .supp-label { color: #3c8d35; font-weight: 800; }
  .supp-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 8mm; }
  .supp-table th, .supp-table td { border: 1px solid #d1d1d1; padding: 3.7mm 3mm; vertical-align: middle; }
  .supp-table th { color: #1f641f; font-weight: 800; text-transform: uppercase; background: #fbfdf8; }
  .supp-table td:nth-child(1), .supp-table td:nth-child(3), .supp-table td:nth-child(4), .supp-table td:nth-child(5), .supp-table td:nth-child(6),
  .supp-table th:nth-child(1), .supp-table th:nth-child(3), .supp-table th:nth-child(4), .supp-table th:nth-child(5), .supp-table th:nth-child(6) { text-align: center; }
  .supp-table td:nth-child(6) { text-align: right; }
  .supp-summary { display: grid; grid-template-columns: 1fr 1fr 1fr 1.08fr; border: 1px solid #d1d1d1; margin-bottom: 6mm; }
  .supp-summary-cell { min-height: 25mm; padding: 5mm 3mm; text-align: center; border-right: 1px solid #d1d1d1; }
  .supp-summary-cell:last-child { border-right: 0; }
  .supp-summary-cell h5 { margin: 0 0 5mm; font-size: 11px; color: #1f641f; font-weight: 800; text-transform: uppercase; }
  .supp-summary-cell p { margin: 0; font-size: 18px; font-weight: 800; }
  .supp-total { background: #4a9a3f; color: #fff; }
  .supp-total h5 { color: #fff; }
  .supp-total p { font-size: 26px; }
  .supp-coupon { min-height: 13mm; text-align: center; color: #2f7d2d; font-weight: 800; font-size: 12px; line-height: 1.7; }
  .supp-thanks { border-top: 1px solid #d3d3d3; border-bottom: 2px solid #3c8d35; padding: 5mm 0; text-align: center; font-size: 12px; line-height: 1.55; }
`;

const getBillingAddress = (orderData: Order) =>
  [orderData.address, orderData.city, orderData.country]
    .filter(Boolean)
    .join(", ") + (orderData.zipCode ? ` - ${orderData.zipCode}` : "");

const InvoicePrint = ({ orderData }: IPropType) => {
  const cartTotals = getCartTotals(orderData.cart);
  const couponDiscount = Number(orderData.discount || 0);
  const totalDiscount = cartTotals.productDiscount + couponDiscount;
  const couponSummary = orderData.coupon?.couponCode
    ? `${orderData.coupon.couponCode} - ${formatDiscountPercent(
        orderData.coupon.discountPercentage
      )} off Supplefied`
    : null;

  return (
    <>
      <style>{invoiceStyles}</style>
      <div className="supp-invoice">
        <div className="supp-inner">
          <div className="supp-top">
            <div>
              <h1 className="supp-brand">Supplefied</h1>
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
                <p><strong>Invoice ID:</strong> #{orderData.invoice}</p>
                <p><strong>Date:</strong> {dayjs(orderData.createdAt).format("MMMM D, YYYY")}</p>
              </div>
            </div>
          </div>

          <div className="supp-bill">
            <p><span className="supp-label">Bill To :</span> <strong>{orderData.name}</strong></p>
            <p><span className="supp-label">Address :</span> {getBillingAddress(orderData)}</p>
            <p><span className="supp-label">mobile number :</span> {orderData.contact}</p>
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
              {orderData.cart.map((item, index) => {
                const pricing = getLinePricing(item);
                return (
                  <tr key={item._id || index}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>{pricing.quantity}</td>
                    <td>{formatPrice(pricing.originalPrice)}</td>
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
              <p>{orderData.paymentMethod}</p>
            </div>
            <div className="supp-summary-cell">
              <h5>Shipping Cost</h5>
              <p>{formatPrice(orderData.shippingCost)}</p>
            </div>
            <div className="supp-summary-cell">
              <h5>Discount</h5>
              <p>{formatPrice(totalDiscount)}</p>
            </div>
            <div className="supp-summary-cell supp-total">
              <h5>Total Amount</h5>
              <p>{formatPrice(orderData.totalAmount)}</p>
            </div>
          </div>

          <div className="supp-coupon">
            {couponSummary && (
              <>
                <div>Coupon: {couponSummary}</div>
                <div>({formatPrice(couponDiscount)})</div>
              </>
            )}
          </div>

          <div className="supp-thanks">
            <div>Thank you for your business!</div>
            <div>We appreciate your trust in Supplefied.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePrint;
