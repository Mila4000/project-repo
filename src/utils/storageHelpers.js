import { supabase } from "../config/supabaseClient";

export const uploadReceipt = async (file, poNumber) => {
  if (!file) return null;

  const fileExt = file.name.split(".").pop().toLowerCase();
  const filePath = `${poNumber}/receipt-${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("purchase-receipts")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;
  return filePath;
};

export const getReceiptPublicUrl = (receiptPath) => {
  if (!receiptPath) return null;

  const { data } = supabase.storage
    .from("purchase-receipts")
    .getPublicUrl(receiptPath);

  return data.publicUrl;
};
