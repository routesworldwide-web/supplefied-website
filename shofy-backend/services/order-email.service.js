const dayjs = require("dayjs");
const { sendEmail } = require("../config/email");
const { secret } = require("../config/secret");

const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;

const getProductTypeLabel = (type) => {
  if (!type) return "";
  return String(type).toLowerCase() === "electronics" ? "Supplefied" : type;
};

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const getOrderQuantity = (item = {}) => Number(item.orderQuantity || item.quantity || 0);

const getLinePricing = (item = {}) => {
  const price = Number(item.price || 0);
  const discountPercent = Number(item.discount || 0);
  const quantity = getOrderQuantity(item);
  const unitDiscount = discountPercent > 0 ? (price * discountPercent) / 100 : 0;
  const unitPrice = price - unitDiscount;

  return {
    quantity,
    unitPrice,
    discountPercent,
    lineTotal: unitPrice * quantity,
  };
};

const getOrderUrl = (order) => {
  if (!secret.client_url || !order?._id) {
    return "";
  }

  return `${secret.client_url}/order/${order._id}`;
};

const buildItemsRows = (cart = []) => {
  return cart
    .map((item) => {
      const pricing = getLinePricing(item);
      const discountText = pricing.discountPercent > 0
        ? `${pricing.discountPercent}% off`
        : "-";

      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">
            ${escapeHtml(item.title || "Product")}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">
            ${pricing.quantity}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">
            ${formatPrice(pricing.unitPrice)}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">
            ${discountText}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">
            ${formatPrice(pricing.lineTotal)}
          </td>
        </tr>
      `;
    })
    .join("");
};

const buildPlainItems = (cart = []) => {
  return cart
    .map((item) => {
      const pricing = getLinePricing(item);
      const discountText = pricing.discountPercent > 0
        ? `, ${pricing.discountPercent}% off`
        : "";

      return `- ${item.title || "Product"} x ${pricing.quantity}: ${formatPrice(pricing.lineTotal)}${discountText}`;
    })
    .join("\n");
};

const buildOrderConfirmationEmail = (order) => {
  const orderUrl = getOrderUrl(order);
  const coupon = order.coupon || {};
  const couponDiscount = Number(order.discount || coupon.discountAmount || 0);
  const hasCoupon = couponDiscount > 0 && coupon.couponCode;
  const invoice = order.invoice ? `#${order.invoice}` : `#${order._id}`;
  const address = [
    order.address,
    order.city,
    order.country,
    order.zipCode,
  ].filter(Boolean).join(", ");

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f6f7f9;padding:24px;color:#111827;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
        <div style="padding:24px 28px;border-bottom:1px solid #e5e7eb;">
          <h2 style="margin:0 0 8px;font-size:24px;font-weight:600;">Order confirmed</h2>
          <p style="margin:0;color:#4b5563;">Hi ${escapeHtml(order.name)}, your order has been placed successfully.</p>
        </div>

        <div style="padding:20px 28px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tbody>
              <tr>
                <td style="padding:4px 0;color:#6b7280;">Invoice</td>
                <td style="padding:4px 0;text-align:right;font-weight:600;">${escapeHtml(invoice)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#6b7280;">Order Date</td>
                <td style="padding:4px 0;text-align:right;">${dayjs(order.createdAt).format("MMMM D, YYYY")}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#6b7280;">Payment Method</td>
                <td style="padding:4px 0;text-align:right;">${escapeHtml(order.paymentMethod)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#6b7280;">Shipping Address</td>
                <td style="padding:4px 0;text-align:right;">${escapeHtml(address)}</td>
              </tr>
            </tbody>
          </table>

          <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;">
            <thead>
              <tr style="background:#f9fafb;">
                <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #e5e7eb;">Product</th>
                <th style="padding:10px 12px;text-align:center;border-bottom:1px solid #e5e7eb;">Qty</th>
                <th style="padding:10px 12px;text-align:right;border-bottom:1px solid #e5e7eb;">Unit Price</th>
                <th style="padding:10px 12px;text-align:right;border-bottom:1px solid #e5e7eb;">Discount</th>
                <th style="padding:10px 12px;text-align:right;border-bottom:1px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${buildItemsRows(order.cart || [])}
            </tbody>
          </table>

          <table style="width:100%;border-collapse:collapse;margin-top:20px;">
            <tbody>
              <tr>
                <td style="padding:5px 0;color:#6b7280;">Subtotal</td>
                <td style="padding:5px 0;text-align:right;">${formatPrice(order.subTotal)}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;color:#6b7280;">Shipping</td>
                <td style="padding:5px 0;text-align:right;">${formatPrice(order.shippingCost)}</td>
              </tr>
              ${hasCoupon ? `
                <tr>
                  <td style="padding:5px 0;color:#6b7280;">
                    Coupon (${escapeHtml(coupon.couponCode)} - ${Number(coupon.discountPercentage || 0)}% off ${escapeHtml(getProductTypeLabel(coupon.productType))})
                  </td>
                  <td style="padding:5px 0;text-align:right;">-${formatPrice(couponDiscount)}</td>
                </tr>
              ` : ""}
              <tr>
                <td style="padding:10px 0 0;font-size:18px;font-weight:700;">Total</td>
                <td style="padding:10px 0 0;text-align:right;font-size:18px;font-weight:700;">${formatPrice(order.totalAmount)}</td>
              </tr>
            </tbody>
          </table>

          ${orderUrl ? `
            <div style="margin-top:24px;">
              <a href="${orderUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:11px 18px;border-radius:6px;">
                View order
              </a>
            </div>
          ` : ""}

          <p style="margin:24px 0 0;color:#6b7280;font-size:13px;">
            Thank you for shopping with Supplefied.
          </p>
        </div>
      </div>
    </div>
  `;

  const text = [
    `Hi ${order.name}, your order has been placed successfully.`,
    `Invoice: ${invoice}`,
    `Order Date: ${dayjs(order.createdAt).format("MMMM D, YYYY")}`,
    `Payment Method: ${order.paymentMethod}`,
    `Shipping Address: ${address}`,
    "",
    "Items:",
    buildPlainItems(order.cart || []),
    "",
    `Subtotal: ${formatPrice(order.subTotal)}`,
    `Shipping: ${formatPrice(order.shippingCost)}`,
    hasCoupon ? `Coupon (${coupon.couponCode}): -${formatPrice(couponDiscount)}` : "",
    `Total: ${formatPrice(order.totalAmount)}`,
    orderUrl ? `View order: ${orderUrl}` : "",
  ].filter(Boolean).join("\n");

  return {
    from: `"Supplefied" <${secret.email_user}>`,
    to: order.email,
    subject: `Order Confirmation ${invoice}`,
    html,
    text,
  };
};

const sendOrderConfirmationEmail = async (order) => {
  if (!order?.email) {
    return null;
  }

  return sendEmail(buildOrderConfirmationEmail(order));
};

module.exports = {
  sendOrderConfirmationEmail,
};
