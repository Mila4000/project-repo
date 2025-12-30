// /services/utils/paymentCalculator.js
export const calculatePurchaseTotals = (items = []) => {
  let merchandiseSubtotal = 0;
  let shippingSubtotal = 0;
  let discountSubtotal = 0;
  let totalQuantity = 0;

  for (const item of items) {
    const qty = Number(item.quantity) || 0;

    // ✅ support both frontend & backend naming
    const price =
      Number(item.unit_price ?? item.unitPrice) || 0;

    const shipping = Number(item.shipping) || 0;
    const discount = Number(item.discount) || 0;

    merchandiseSubtotal += qty * price;
    shippingSubtotal += shipping;
    discountSubtotal += discount;
    totalQuantity += qty;
  }

  const totalPayment =
    merchandiseSubtotal + shippingSubtotal - discountSubtotal;

  return {
    merchandiseSubtotal,
    shippingSubtotal,
    discountSubtotal,
    totalQuantity,
    totalPayment
  };
};
