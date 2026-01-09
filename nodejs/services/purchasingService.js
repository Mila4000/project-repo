
import { supabase } from "../config/supabaseClient.js";

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
    .order("transaction_date", { ascending: false });

  if (error) throw error;
  return data;
};


export const createPurchase = async (payload) => {
  const {
  supplier,
  transaction_date,
  delivery_date,
  approval_status,
  delivery_status,
  payment_status,
  remarks,
  receipt_url,
  items = [],
  warehouse,

    // optional inputs
    shipping_subtotal = 0,
    discount_subtotal = 0
  } = payload;

  if (!items.length) {
    throw new Error("Purchase must have at least one item");
  }

  // 🔒 AUTHORITATIVE CALCULATIONS
  let merchandiseSubtotal = 0;
  let totalQuantity = 0;

  const preparedItems = items.map(item => {
    const lineTotal = item.quantity * item.unitPrice;

    merchandiseSubtotal += lineTotal;
    totalQuantity += item.quantity;

    return {
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      line_total: lineTotal,
      type: item.type,
      shipping:item.shipping,
      discount:item.discount
    };
  });

  // ensure numbers & sane values
  const shippingSubtotal = Math.max(0, Number(payload.shipping_subtotal || 0));
  const discountSubtotal = Math.max(0, Number(payload.discount_subtotal || 0));

  // final payable
  const totalPayment = Math.max(
    0,
    merchandiseSubtotal + shippingSubtotal - discountSubtotal
  );


  /**
   * STEP 1: INSERT PURCHASE HEADER (PO TEMP PLACEHOLDER)
   */
  const { data: purchase, error: purchaseError } = await supabase
  .from("purchased_order")
  .insert({
    po: null,
    supplier_id: supplier,
    transaction_date,
    delivery_date,

    // ✅ totals
    merchandise_subtotal: merchandiseSubtotal,
    shipping_subtotal: shippingSubtotal,
    discount_subtotal: discountSubtotal,
    total: totalPayment,

    approval_status,
    delivery_status,
    payment_status,
    remarks,
    receipt_url
  })
  .select()
  .single();


  if (purchaseError) {
    throw purchaseError;
  }

  /**
   * STEP 2: GENERATE PO USING DB ID
   * Format: PO-YYYYMMDD####
   */
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const poNumber = `PO-${yyyy}${mm}${dd}${String(purchase.id).padStart(4, "0")}`;

  /**
   * STEP 3: UPDATE PURCHASE WITH FINAL PO
   */
  const { error: poUpdateError } = await supabase
    .from("purchased_order")
    .update({ po: poNumber })
    .eq("id", purchase.id);

  if (poUpdateError) {
    // rollback header
    await supabase
      .from("purchased_order")
      .delete()
      .eq("id", purchase.id);

    throw poUpdateError;
  }

  /**
   * STEP 4: INSERT LINE ITEMS
   */
  const itemsToInsert = preparedItems.map(item => ({
    purchased_order_id: purchase.id,
    expected_quantity: 0,
    warehouse,
    item_code: "0-000-000",
    ...item
  }));

  const { error: itemsError } = await supabase
    .from("purchased_order_item")
    .insert(itemsToInsert);

  if (itemsError) {
    await supabase
      .from("purchased_order")
      .delete()
      .eq("id", purchase.id);

    throw itemsError;
  }

  return {
    ...purchase,
    po: poNumber,
    items: preparedItems,

    payment_totals: {
      merchandiseSubtotal,
      shippingSubtotal,
      discountSubtotal,
      totalPayment
    }
  };
};



export const updatePurchase = async (po, updatedData) => {
  const { data, error } = await supabase
    .from("purchased_order")
    .update({
      supplier_id: updatedData.supplier_id,
      transaction_date: updatedData.transaction_date,
      delivery_date: updatedData.delivery_date,
      total: updatedData.total,
      approval_status: updatedData.approval_status,
      delivery_status: updatedData.delivery_status,
      payment_status: updatedData.payment_status,
      remarks: updatedData.remarks,
      items: updatedData.items,
    })
    .eq("po", po)
    .select();

  if (error) throw error;
  return data;
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
    .update({ approval_status: status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const displayDeliveryHistory = async(id)=>{
const { data, error } = await supabase
    .from("delivery_status_history")
    .select(`
      *,

      purchased_order (
        id,
        delivery_status
      )
    `)
    .eq("purchased_order_id",id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
export const updateDeliveryStatus = async (id, status, remark) => {
  // 1️⃣ Update current delivery status
  const { error: updateError } = await supabase
    .from("purchased_order")
    .update({ delivery_status: status })
    .eq("id", id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  // 2️⃣ Insert history snapshot (status + remarks)
  const { data: historyData, error: historyError } = await supabase
    .from("delivery_status_history")
    .insert([
      {
        purchased_order_id: id,
        status,
        remarks: remark,
      },
    ])
    .select()
    .single();

  if (historyError) {
    throw new Error(historyError.message);
  }

  return {
    success: true,
    history: historyData,
  };
};

export const updatePaymentHistory = async (id, paymentdata) => {
  const newPayment = Number(paymentdata.amountPay);

  // 1️⃣ Get current amount_paid & total
  const { data: currentOrder, error: fetchError } = await supabase
    .from("purchased_order")
    .select("amount_paid, total")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  const currentPaid = Number(currentOrder.amount_paid || 0);
  const totalAmount = Number(currentOrder.total);

  // 2️⃣ ADD payment (this is what you were missing)
  const updatedAmountPaid = currentPaid + newPayment;

  // 3️⃣ Determine status
  let paymentStatus = "Partially Paid";
  if (updatedAmountPaid >= totalAmount) {
    paymentStatus = "Paid";
  }

  // 4️⃣ Update purchased_order
  const { data: poData, error: updateError } = await supabase
    .from("purchased_order")
    .update({
      amount_paid: updatedAmountPaid,
      payment_status: paymentStatus,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) throw updateError;

  // 5️⃣ Insert payment history
  const { data: paymentHistory, error: paymentError } = await supabase
    .from("payment_history")
    .insert({
      purchased_order_id: id,
      payment_method: paymentdata.paymentMethod,
      amount_paid: newPayment, // store only THIS payment
    })
    .select()
    .single();

  if (paymentError) throw paymentError;

  return { poData, paymentHistory };
};

export const getPaymentHistory = async (id) => {
  const { data, error } = await supabase
    .from("payment_history")
    .select(`*`)
    .eq("purchased_order_id",id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};