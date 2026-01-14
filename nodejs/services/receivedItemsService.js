import { supabase } from "../config/supabaseClient.js";


export const getAllReceivedItems = async () => {
  const { data, error } = await supabase
    .from("purchased_order_item")
    .select(`
      id,
      product_name,
      quantity,
      expected_quantity,
      purchased_order_id,
      unit_price,
      status,
      warehouse,
      item_code,
      purchased_order!inner (
        id,
        po,
        transaction_date,
        delivery_status,
        remarks,
        approval_status,
        supplier (
          id,
          businessname,
          name,
          contactno
        )
      )
    `)
    .eq("purchased_order.approval_status", "Approved");
  if (error) throw error;
  return data;
};

export const createReceivedItem = async (payload) => {

    const results = [];

    /* =========================
       UPDATE EXISTING ITEMS
    ========================= */
    if (payload.items && payload.items.length > 0) {
        const updatePromises = payload.items.map(item => {
            const lineTotal = item.quantity * item.unit_price;

            return supabase
                .from('purchased_order_item')
                .update({
                    product_name: item.product_name,
                    quantity: item.quantity,
                    expected_quantity: item.expected_quantity,
                    unit_price: item.unit_price,
                    line_total: lineTotal,
                    type: "Standard Items",
                })
                .eq('id', item.id)
                .select();
        });

        const updateResults = await Promise.all(updatePromises);

        updateResults.forEach(({ error }) => {
            if (error) throw error;
        });

        results.push(...updateResults.flatMap(r => r.data));
    }

    /* =========================
       INSERT NEW ITEMS
    ========================= */
    if (payload.newItem && payload.newItem.length > 0) {
        const insertData = payload.newItem.map(item => ({
            purchased_order_id: payload.items?.[0]?.purchased_order_id, // or payload.purchased_order_id
            product_name: item.product_name,
            quantity: item.quantity,
            expected_quantity: item.expected_quantity,
            unit_price: item.unit_price,
            warehouse:"Saog",
            line_total: item.quantity * item.unit_price,
            type: "Standard Items",
        }));

        const { data, error } = await supabase
            .from('purchased_order_item')
            .insert(insertData)
            .select();

        if (error) throw error;

        results.push(...data);
    }

    return results;
};

export const updateReceivedItem = async (id, payload) => {

  const updateData = {
    product_name: payload.product_name,
    quantity: payload.quantity,
    expected_quantity: payload.expected_quantity,
  };

  const { data, error } = await supabase
    .from('purchased_order_item')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteReceivedItem = async (id) => {
    const { error } = await supabase
        .from('purchased_order_item')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return;
};

export const getReceivedItemsStats = async () => {
  const { count, error } = await supabase
    .from("purchased_order_item")
    .select(
      `
      id,
      purchased_order!inner (
        approval_status
      )
      `,
      { count: "exact", head: true }
    )
    .eq("purchased_order.approval_status", "Approved")
    .neq("purchased_order.delivery_status", "Out for Delivery");
  if (error) throw error;

  return {
    totalReceivedItems: count ?? 0,
  };
};

export const bulkSave = async (items) => {
  const toInsert = [];
  const toUpdate = [];

  let purchasedOrderId = null;

  for (const item of items) {
    const {
      id,
      product_name,
      purchased_order_id,
      type,
      quantity,
      unit_price,
      line_total
    } = item;

    purchasedOrderId = purchased_order_id;

    const data = {
      product_name,
      purchased_order_id,
      type,
      quantity,
      unit_price,
      line_total
    };

    if (id) {
      toUpdate.push({ id, ...data });
    } else {
      toInsert.push(data);
    }
  }

  /* ---------- INSERT ---------- */
  if (toInsert.length) {
    const { error } = await supabase
      .from("purchased_order_item")
      .insert(toInsert);

    if (error) throw error;
  }

  /* ---------- UPDATE ---------- */
  for (const item of toUpdate) {
    const { id, ...data } = item;

    const { error } = await supabase
      .from("purchased_order_item")
      .update(data)
      .eq("id", id);

    if (error) throw error;
  }

  /* ---------- RECALCULATE MERCHANDISE SUBTOTAL ---------- */
  const { data: rows, error: sumError } = await supabase
    .from("purchased_order_item")
    .select("line_total")
    .eq("purchased_order_id", purchasedOrderId);

  if (sumError) throw sumError;

  const merchandiseSubtotal = rows.reduce(
    (sum, row) => sum + Number(row.line_total || 0),
    0
  );

  /* ---------- GET SHIPPING & DISCOUNT ---------- */
  const { data: order, error: orderError } = await supabase
    .from("purchased_order")
    .select("shipping_subtotal, discount_subtotal")
    .eq("id", purchasedOrderId)
    .single();

  if (orderError) throw orderError;

  const shippingSubtotal = Number(order.shipping_subtotal || 0);
  const discountSubtotal = Number(order.discount_subtotal || 0);

  /* ---------- CALCULATE TOTAL ---------- */
  const total =
    merchandiseSubtotal + shippingSubtotal - discountSubtotal;

  /* ---------- UPDATE PURCHASE ORDER ---------- */
  const { error: updateError } = await supabase
    .from("purchased_order")
    .update({
      merchandise_subtotal: merchandiseSubtotal,
      total: total
    })
    .eq("id", purchasedOrderId);

  if (updateError) throw updateError;
};
