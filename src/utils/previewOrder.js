import { supabase } from "../config/supabaseClient";

export const fetchPoPreview = async (transactionDate) => {
  if (!transactionDate) return "";

  const { data, error } = await supabase.rpc(
    "preview_po_number",
    { p_transaction_date: transactionDate }
  );

  if (error) {
    console.error("PO preview error:", error);
    return "";
  }

  return data;
};

export const fetchSIPreview = async (transactionDate) => {
  if (!transactionDate) return "";

  const { data, error } = await supabase.rpc(
    "preview_si_number",
    { p_transaction_date: transactionDate }
  );

  if (error) {
    console.error("SI preview error:", error);
    return "";
  }

  return data;
};