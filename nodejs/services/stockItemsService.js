import { supabase } from "../config/supabaseClient.js";


export const getAllStockItems = async () => {
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
export const createStockItem = async (stock) => {
    console.log("Stock",stock);
    const unitPrice = Number(stock.pricing[0]?.price || 0);
    console.log("Unit Price", unitPrice);
    
    const {data, error} = await supabase
        .from("purchased_order_items")
        .insert([{
            product_name:stock.name,
            purchased_order_id:"37",//replace this soon
            quantity:stock.quantity,
            unit_price:unitPrice,
            line_total: stock.quantity * unitPrice,
            type:stock.type,
            expected_quantity:stock.expected_quantity,
            warehouse:stock.warehouse,
            item_code:"FLD_FR_TST",//replace this soon
            status:"In Stock"
        }])
        .select()
        .single();
    if(!data) throw error;
    return data;
};

export const deleteStockItem = async (id) => {
  const { error } = await supabase
    .from("purchased_order_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

export const getStockStats = async() =>{

    const { data: totalItems, error: countError } = await supabase
        .from("purchased_order_items")
        .select("*", {count:"exact"});
    if (countError) throw countError;
    const totalProduct = totalItems.length;
    const { data: totalQuantity, error: stockError } = await supabase
        .from("purchased_order_items")
        .select("quantity");
    if (stockError) throw stockError;

    const totalStock = totalQuantity.reduce(
        (sum, row) => sum + Number(row.quantity || 0),
        0
    );

    const { data: totalCost, error: costError } = await supabase
        .from("purchased_order_items")
        .select("line_total");
    if (costError) throw costError;
    const totalVal = totalCost.reduce(
        (sum, row) => sum + Number(row.line_total || 0),
        0
    );
    const { data: totalCritical, error: CritError } = await supabase
        .from("purchased_order_items")
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