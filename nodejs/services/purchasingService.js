
import { supabase } from "../config/supabaseClient.js";
import {getDeliveryHistoryCore, updateDeliveryStatusCore} from "./deliveryStatusService.js";
import {applyPaymentCore, getPaymentHistoryCore} from "./paymentHistoryService.js";

export const getAllPurchases = async () => {
  const { data, error } = await supabase
    .from("purchased_order")
    .select(`
      *,

      supplier (
        id,
        businessname
      ),

      purchased_order_item (
        id,
        purchased_order_id,
        product_name,
        quantity,
        unit_price,
        line_total,
        type,
        expected_quantity,
        status,
        warehouse,
        item_code,
        shipping,
        discount
      )
    `)
    .order("updated_at", { ascending: true });

  if (error) throw error;
  return data;
};


export const createPurchase = async (transaction) => {

  const {
    supplier,
    transaction_date,
    delivery_date,
    warehouse,
    items = [],
    shipping_subtotal = 0,
    discount_subtotal = 0,
    approval_status,
    delivery_status,
    payment_status,
    remarks,
    receipt_url = null
  } = transaction;

  if (!items.length) {
    throw new Error("Purchase must have at least one item");
  }

  /*
   * STEP 1: AUTHORITATIVE CALCULATIONS
   */
  let merchandiseSubtotal = 0;

  const preparedItems = items.map(item => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    const lineTotal = quantity * unitPrice;

    merchandiseSubtotal += lineTotal;

    return {
      item_id: item.id,                  // 🔑 MUST match public.items.id
      product_name: item.name,
      quantity,
      expected_quantity: quantity,
      unit_price: unitPrice,
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
   * STEP 2: CALL ATOMIC RPC (DB DOES EVERYTHING)
   */
  const { data: purchase, error } = await supabase.rpc(
    "create_purchase_order",
    {
      p_supplier_id: supplier,
      p_transaction_date: transaction_date,
      p_delivery_date: delivery_date,
      p_warehouse: warehouse,
      p_merchandise_subtotal: merchandiseSubtotal,
      p_shipping_subtotal: shippingSubtotal,
      p_discount_subtotal: discountSubtotal,
      p_total: totalPayment,
      p_approval_status: approval_status,
      p_delivery_status: delivery_status,
      p_payment_status: payment_status,
      p_remarks: remarks,
      p_receipt_url: receipt_url,
      p_items: preparedItems
    }
  );

  if (error) {
    console.error("Create Purchase failed:", error);
    throw error;
  }

  /*
   * STEP 3: RETURN CLEAN RESPONSE
   */
  return {
    ...purchase,
    items: preparedItems,
    payment_totals: {
      merchandiseSubtotal,
      shippingSubtotal,
      discountSubtotal,
      totalPayment
    }
  };
};


export const deletePurchase = async (po) => {
  const { error } = await supabase
    .from("purchased_order")
    .delete()
    .eq("po", po);
  if (error) throw error;
};

export const getPurchaseStats = async () => {

  // 1️⃣ Fetch order-level stats
  const { data: orders, error: ordersError } = await supabase
    .from("purchased_order")
    .select("id, total, payment_status, delivery_status");

  if (ordersError) throw ordersError;

  // 2️⃣ Fetch quantity from line items
  const { data: items, error: itemsError } = await supabase
    .from("purchased_order_item")
    .select("purchased_order_id, quantity");

  if (itemsError) throw itemsError;
  // 3️⃣ Aggregate quantities per order
  const quantityByOrder = items.reduce((acc, item) => {
    acc[item.purchased_order_id] =
      (acc[item.purchased_order_id] || 0) + item.quantity;
    return acc;
  }, {});
  // 4️⃣ Final calculations
  const totalPurchased = orders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );

  const totalQuantity = Object.values(quantityByOrder).reduce(
    (sum, q) => sum + q,
    0
  );

  const totalPayables = orders
    .filter(o => o.payment_status !== "Paid")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const totalDeliveries = orders.filter(
    o => o.delivery_status === "Delivered"
  ).length;
  return {
    totalPurchased,
    totalQuantity,
    totalPayables,
    totalDeliveries
  };
};

export const updatePurchaseReceipt = async (purchaseId, receiptUrl) => {
  const { data, error } = await supabase
    .from("purchased_order")
    .update({ receipt_url: receiptUrl })
    .eq("id", purchaseId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("purchased_order")
    .update({ approval_status: status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const updatePaymentHistory = async (poId, paymentdata) => {
  return applyPaymentCore({
    table: "purchased_order",
    sourceType: "PO",
    sourceId: poId,
    paymentMethod: paymentdata.paymentMethod,
    amount: Number(paymentdata.amountPay),
  });
};

export const getPaymentHistory = async (poId) => {
  return getPaymentHistoryCore("PO", poId);
};

export const displayDeliveryHistory = async (poId) => {
  return getDeliveryHistoryCore("PO", poId);
};

export const updateDeliveryStatus = async (
  poId,
  deliveryStatus,
  remarks
) => {
  return updateDeliveryStatusCore({
    table: "purchased_order",
    sourceType: "PO",
    sourceId: poId,
    deliveryStatus,
    remark: remarks,
  });
};

export const getBrands = async ()=>{
  const { data, error } = await supabase
    .from("items")
    .select(`*`)
    .order("id", { ascending: false });
  if (error) throw error;
  return data; 
}