import { supabase } from "../config/supabaseClient.js";

export const getAllInvCounting = async () =>{
    const {data, error} = await supabase
    .from("inventory_counting")
    .select("*")
    .order("count_date", { ascending: true });
    if (!data) throw new error;
    return data;
};
export const addInvCounting = async (countData) => {
  // 1️⃣ Insert inventory_counting
  const { data: invCount, error: invError } = await supabase
    .from("inventory_counting")
    .insert([
      {
        count_date: countData.CountDate,
        warehouse: countData.Warehouse ?? null,
        remarks: countData.remarks,
        status: "Pending",
      },
    ])
    .select()
    .single();

  if (invError) throw invError;

  // 2️⃣ Prepare itemcount rows
  const itemRows = countData.itemsToCount.map((item) => ({
    inv_count_id: invCount.id,     // 🔑 foreign key
    name: item.item,
    counting_quantity: Number(item.quantity),
  }));

  // 3️⃣ Insert itemcount records
  const { error: itemsError } = await supabase
    .from("itemcount")
    .insert(itemRows);

  if (itemsError) throw itemsError;

  return invCount;
};
export const getCountingStats = async () => {
  const { count, error } = await supabase
    .from('inventory_counting')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count;
};

export const getBrands = async () => {
  const { data, error } = await supabase
    .from('brand_list')
    .select('*')
    .order('id', { ascending: false });
  
  if (error) throw error;
  return data;
}

export const getBrandStats = async () => {
  const { count, error } = await supabase
    .from('brand_list')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count;
}