
import { supabase } from "../config/supabaseClient.js";

export const getAllPurchases = async () => {
  const { data, error } = await supabase
    .from("purchased_orders")
    .select("*")
    .order("transactiondate", { ascending: false });
  if (error) throw error;
  return data;
};

export const createPurchase = async (newPurchase) => {
  const { data, error } = await supabase
    .from("purchased_orders")
    .insert([{
      po: newPurchase.PO,
      supplier: newPurchase.supplier,
      transactiondate: newPurchase.transactionDate,
      deliverydate: newPurchase.deliveryDate,
      total: newPurchase.total,
      approvalstatus: newPurchase.approvalStatus,
      deliverystatus: newPurchase.deliveryStatus,
      paymentstatus: newPurchase.paymentStatus,
      remarks: newPurchase.remarks,
      quantity: newPurchase.quantity,
      items: newPurchase.items,
      status: newPurchase.status
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updatePurchase = async (po, updatedData) => {
  const { data, error } = await supabase
    .from("purchased_orders")
    .update({
      supplier: updatedData.supplier,
      transactiondate: updatedData.transactiondate,
      deliverydate: updatedData.deliverydate,
      total: updatedData.total,
      approvalstatus: updatedData.approvalstatus,
      deliverystatus: updatedData.deliverystatus,
      paymentstatus: updatedData.paymentstatus,
      remarks: updatedData.remarks,
      quantity: updatedData.quantity,
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
  const { data, error } = await supabase
    .from("purchased_orders")
    .select("total, quantity, paymentstatus, deliverystatus");

  if (error) throw error;

  const totalPurchased = data.reduce((sum, o) => sum + Number(o.total), 0);
  const totalQuantity = data.reduce((sum, o) => sum + (o.quantity || 0), 0);
  const totalPayables = data
    .filter(o => o.paymentstatus !== "Paid")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const totalDeliveries = data.filter(o => o.deliverystatus === "Delivered").length;

  return { totalPurchased, totalQuantity, totalPayables, totalDeliveries };
};
