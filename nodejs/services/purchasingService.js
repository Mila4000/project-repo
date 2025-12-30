
import { supabase } from "../config/supabaseClient.js";

export const getAllPurchases = async () => {
  const { data, error } = await supabase
    .from("purchased_orders")
    .select(`
      id,
      po,
      transaction_date,
      delivery_date,
      total,
      approval_status,
      delivery_status,
      payment_status,
      remarks,
      status,
      supplier_id,
      supplier (
        id,
        businessname
      )
    `)
    .order("transaction_date", { ascending: false });

  if (error) throw error;
  return data;
};

export const createPurchase = async (payload) => {
  const {
    PO,
    supplier,
    transaction_date,
    delivery_date,
    approval_status,
    delivery_status,
    payment_status,
    remarks,
    status,
    items = []
  } = payload;

  if (!items.length) {
    throw new Error("Purchase must have at least one item");
  }

  // 🔒 AUTHORITATIVE CALCULATIONS
  let total = 0;
  let totalQuantity = 0;
  console.log("Preparing items for insertion:", items);
  const preparedItems = items.map(item => {
    const lineTotal = item.quantity * item.unitPrice;
    total += lineTotal;
    totalQuantity += item.quantity;

    return {
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      line_total: lineTotal,
      type: item.type
    };
  });

  /**
   * STEP 1: INSERT PURCHASE HEADER
   */
  const { data: purchase, error: purchaseError } = await supabase
    .from("purchased_orders")
    .insert({
      po: PO,
      supplier_id: supplier,
      transaction_date: transaction_date,
      delivery_date: delivery_date,
      total,
      approval_status: approval_status,
      delivery_status: delivery_status,
      payment_status: payment_status,
      remarks,
      status
    })
    .select()
    .single();

  if (purchaseError) throw purchaseError;

  /**
   * STEP 2: INSERT LINE ITEMS
   */
  const itemsToInsert = preparedItems.map(item => ({
    purchased_order_id: purchase.id,
    ...item
  }));
  console.log("Inserting items:", itemsToInsert);
  const { error: itemsError } = await supabase
    .from("purchased_order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    // optional manual cleanup (since Supabase JS has no multi-table transaction)
    await supabase
      .from("purchased_orders")
      .delete()
      .eq("id", purchase.id);

    throw itemsError;
  }

  return {
    ...purchase,
    items: preparedItems
  };
};


export const updatePurchase = async (po, updatedData) => {
  const { data, error } = await supabase
    .from("purchased_orders")
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
      status: updatedData.status
    })
    .eq("po", po)
    .select();

  if (error) throw error;
  return data;
};

export const deletePurchase = async (po) => {
  const { error } = await supabase
    .from("purchased_orders")
    .delete()
    .eq("po", po);
  if (error) throw error;
};

export const getPurchaseStats = async () => {

  // 1️⃣ Fetch order-level stats
  const { data: orders, error: ordersError } = await supabase
    .from("purchased_orders")
    .select("id, total, payment_status, delivery_status");

  if (ordersError) throw ordersError;

  // 2️⃣ Fetch quantity from line items
  const { data: items, error: itemsError } = await supabase
    .from("purchased_order_items")
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

