import { supabase } from "../config/supabaseClient.js";

export const getAllSuppliers = async () => {
  const { data, error } = await supabase
    .from("supplier")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
};

export const getSupplierStats = async () => {
  // Total suppliers
  const { count: totalCount, error: totalError } = await supabase
    .from("supplier")
    .select("*", { count: "exact", head: true });

  if (totalError) throw totalError;

  // Active suppliers
  const { count: activeCount, error: activeError } = await supabase
    .from("supplier")
    .select("*", { count: "exact", head: true })
    .eq("status", "Active");

  if (activeError) throw activeError;

  // Inactive suppliers
  const { count: inactiveCount, error: inactiveError } = await supabase
    .from("supplier")
    .select("*", { count: "exact", head: true })
    .eq("status", "Inactive");

  if (inactiveError) throw inactiveError;

  return {
    total: totalCount,
    active: activeCount,
    inactive: inactiveCount,
  };
};

export const addSupplier = async (newSupplier) => {
  const { data, error } = await supabase
    .from("supplier")
    .insert([{
      name: newSupplier.name,
      businessname: newSupplier.businessname,
      contactno: newSupplier.contactno,
      tinno: newSupplier.tinno,
      bankaccount: newSupplier.bankaccount,
      email: newSupplier.email,
      address: newSupplier.address,
      status: newSupplier.status
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};
export const updateSupplier = async (id, updatedData) => {
  const { data, error } = await supabase
    .from("supplier")
    .update({
      name: updatedData.name,
      businessname: updatedData.businessname,
      contactno: updatedData.contactno,
      tinno: updatedData.tinno,
      bankaccount: updatedData.bankaccount,
      email: updatedData.email,
      address: updatedData.address,
      status: updatedData.status
    })
    .eq("id", id)
    .select(); 
  if (error) throw error;
  return data;
};

export const deleteSupplier = async (id) => {
  const { error } = await supabase
    .from("supplier")
    .delete()
    .eq("id", id);
  if (error) throw error;
};