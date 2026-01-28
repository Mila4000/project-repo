import { supabase } from "../config/supabaseClient.js";
import {getDeliveryHistoryCore, updateDeliveryStatusCore} from "./deliveryStatusService.js";
import {applyPaymentCore, getPaymentHistoryCore} from "./paymentHistoryService.js";

export const getAllSales = async () =>{
    const {data, error} = await supabase
    .from("sales_invoice")
    .select(
        `*,
        customer(
        *),
        sales_invoice_item(
        *)
        `
    )
    .order("id", {ascending:false});


    if(error) throw error;
    return data;
}

export const addSales = async (transaction) => {
  console.log("Adding Sales Invoice:", transaction);
  const {
    customer,
    transaction_date,
    items = [],
    shipping_subtotal = 0,
    discount_subtotal = 0,
    approval_status,
    delivery_status,
    payment_status
  } = transaction;

  /*
   * STEP 1: AUTHORITATIVE CALCULATIONS
   */
  let merchandiseSubtotal = 0;

  const preparedItems = items.map(item => {
    const lineTotal = Number(item.quantity) * Number(item.unitPrice);
    merchandiseSubtotal += lineTotal;

    return {
      item_id: item.id,
      product_name: item.name,
      quantity: Number(item.quantity),
      expected_quantity: Number(item.quantity),
      unit_price: Number(item.unitPrice),
      line_total: lineTotal,
      type: item.type,
      shipping: Number(item.shipping) || 0,
      discount: Number(item.discount) || 0
    };
  });

  const shippingSubtotal = Math.max(0, Number(shipping_subtotal));
  const discountSubtotal = Math.max(0, Number(discount_subtotal));

  const totalPayment = Math.max(
    0,
    merchandiseSubtotal + shippingSubtotal - discountSubtotal
  );

  /*
   * STEP 2: CALL RPC (DB DOES THE REST)
   */
  const { data: sales, error } = await supabase.rpc(
    "create_sales_invoice",
    {
      s_cust_id: customer,
      s_transaction_date: transaction_date,
      s_merchandise_subtotal: merchandiseSubtotal,
      s_shipping_subtotal: shippingSubtotal,
      s_discount_subtotal: discountSubtotal,
      s_total: totalPayment,
      s_approval_status: approval_status,
      s_delivery_status: delivery_status,
      s_payment_status: payment_status,
      s_items: preparedItems
    }
  );

  if (error) {
    console.error("Create Sales Invoice failed:", error);
    throw error;
  }

  /*
   * STEP 3: RETURN CLEAN RESPONSE
   */
  return {
    ...sales,
    items: preparedItems,
    payment_totals: {
      merchandiseSubtotal,
      shippingSubtotal,
      discountSubtotal,
      totalPayment
    }
  };
};

export const getSalesStats = async () => {
  const { data: sales, error: ordersError } = await supabase
    .from("sales_invoice")
    .select("id, total, payment_status, delivery_status");
  
  if (ordersError) throw ordersError;
  // 2️⃣ Fetch quantity from line items
  const { data: items, error: itemsError } = await supabase
    .from("sales_invoice_item")
    .select("sales_invoice_id, quantity");

  if (itemsError) throw itemsError;
  // 3️⃣ Aggregate quantities per order
  const quantityByOrder = items.reduce((acc, item) => {
    acc[item.sales_invoice_id] =
      (acc[item.sales_invoice_id] || 0) + item.quantity;
    return acc;
  }, {});
  // 4️⃣ Final calculations
  const totalPurchased = sales.reduce(
    (sum, s) => sum + Number(s.total || 0),
    0
  );

  const totalQuantity = Object.values(quantityByOrder).reduce(
    (sum, q) => sum + q,
    0
  );

  const totalReceivables = sales
    .filter(s => s.payment_status !== "Paid")
    .reduce((sum, s) => sum + Number(s.total || 0), 0);

  const totalDeliveries = sales.filter(
    s => s.delivery_status === "Delivered"
  ).length;
  return {
    totalPurchased,
    totalQuantity,
    totalReceivables,
    totalDeliveries
  };
  
}

export const deleteSalesInvoice = async (si) => {
  const { error } = await supabase
    .from("sales_invoice")
    .delete()
    .eq("si", si);
  if (error) throw error;
};


export const updateSalesFiles = async (sales_id, fileURL) => {
  const { data, error } = await supabase
    .from("sales_invoice")
    .update({ computation_img_url: fileURL.computation_url, payment_image_url: fileURL.receipt_url })
    .eq("id", sales_id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("sales_invoice")
    .update({ approval_status: status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const displayDeliveryHistory = async (siId) => {
  return getDeliveryHistoryCore("SI", siId);
};

export const updateDeliveryStatus = async (
  siId,
  deliveryStatus,
  remarks
) => {
  return updateDeliveryStatusCore({
    table: "sales_invoice",
    sourceType: "SI",
    sourceId: siId,
    deliveryStatus,
    remark: remarks,
  });
};

export const updatePaymentHistory = async (siId, paymentdata) => {
  return applyPaymentCore({
    table: "sales_invoice",
    sourceType: "SI",
    sourceId: siId,
    paymentMethod: paymentdata.paymentMethod,
    amount: Number(paymentdata.amountPay),
  });
};

export const getPaymentHistory = async (siId) => {
  return getPaymentHistoryCore("SI", siId);
};