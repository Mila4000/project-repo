import { supabase } from "../config/supabaseClient.js";


export const getAllStockItems = async () => {
    const { data, error } = await supabase
    .from('items')
    .select(`
        id,
        item_name,
        quantity,
        threshold_count,
        suggested_retail_price,
        selling_price,
        status,
        item_code,
        warehouse(
        id,
        whouse_name,
        whouse_address
        ),
        purchased_order_item(
        *,
            purchased_order(
            *
            )
        )
    `);
    if (error) throw error;
    return data;
}
export const createStockItem = async (stock) => {
    const {data, error} = await supabase
        .from("items")
        .insert([{
            item_name:stock.name,
            quantity:stock.quantity,
            suggested_retail_price:stock.price,
            item_code:"FLD_FR_TST",
            quantity:1,
            whouse_id:stock.warehouse_id,
            threshold_count:stock.threshold_count,
            status:"In Stock"
        }])
        .select()
        .single();
    if(!data) throw error;
    return data;
};

export const deleteStockItem = async (id) => {
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

export const getStockStats = async() =>{

    const { data: totalItems, error: countError } = await supabase
        .from("items")
        .select("*", {count:"exact"});
    if (countError) throw countError;
    const totalProduct = totalItems.length;
    const { data: totalQuantity, error: stockError } = await supabase
        .from("items")
        .select("quantity");
    if (stockError) throw stockError;

    const totalStock = totalQuantity.reduce(
        (sum, row) => sum + Number(row.quantity || 0),
        0
    );

    const { data: totalCost, error: costError } = await supabase
        .from("purchased_order_item")
        .select("line_total");
    if (costError) throw costError;
    const totalVal = totalCost.reduce(
        (sum, row) => sum + Number(row.line_total || 0),
        0
    );
    const { data: totalCritical, error: CritError } = await supabase
        .from("items")
        .select("*", {count:"exact"})
        .eq("status","Critical Stock");
    if (CritError) throw CritError;
    const totalCritStock = totalCritical.length;
    return {
        totalProduct,
        totalStock,
        totalVal,
        totalCritStock
    };
}