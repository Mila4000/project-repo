import { supabase } from "../config/supabaseClient.js";


export const getAllReceivedItems = async () => {
    const { data, error } = await supabase
    .from('purchased_order_items')
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
        purchased_orders (
        id,
        po,
        transaction_date,
        delivery_status,
        remarks,
        supplier (
            id,
            businessname,
            name,
            contactno
        )
        )
    `);
    if (error) throw error;
    return data;
}

export const createReceivedItem = async (payload) => {
    console.log("Received Item Payload:", payload);

    const results = [];

    /* =========================
       UPDATE EXISTING ITEMS
    ========================= */
    if (payload.items && payload.items.length > 0) {
        const updatePromises = payload.items.map(item => {
            const lineTotal = item.quantity * item.unit_price;

            return supabase
                .from('purchased_order_items')
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
            .from('purchased_order_items')
            .insert(insertData)
            .select();

        if (error) throw error;

        results.push(...data);
    }

    return results;
};

export const updateReceivedItem = async (id, payload) => {
console.log('Update Payload:', {
  id,
  product_name: payload.product_name,
  actual_quantity: payload.actual_quantity,
  expected_quantity: payload.expected_quantity,
});
  const updateData = {
    product_name: payload.product_name,
    quantity: payload.quantity,
    expected_quantity: payload.expected_quantity,
  };

  const { data, error } = await supabase
    .from('purchased_order_items')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteReceivedItem = async (id) => {
    console.log("Deleting Received Item with ID:", id);
    const { error } = await supabase
        .from('purchased_order_items')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return;
};

export const getReceivedItemsStats = async () => {
    const { data, error } = await supabase
        .from('purchased_order_items')
        .select('id', { count: 'exact' });
    if (error) throw error;
    return {
        totalReceivedItems: data.length,
    };
}