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
export const uploadProofOfPayment = async (file, siNumber) => {
  if (!file) return null;

  const fileExt = file.name.split(".").pop().toLowerCase();
  const filePath = `${siNumber}/payment-${crypto.randomUUID()}.${fileExt}`;
  const { error } = await supabase.storage
    .from("proof-of-payment-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;
  return filePath;
};
export const uploadComputation = async (file, siNumber) => {
  if (!file) return null;

  const fileExt = file.name.split(".").pop().toLowerCase();
  const filePath = `${siNumber}/computation-${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("computation-image")
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
export const getProofUrl = (url) => {
  if (!url) return null;

  const { data } = supabase.storage
    .from("proof-of-payment-images")
    .getPublicUrl(url);

  return data.publicUrl;
};

export const getComputationImageUrl = (url) => {
  if (!url) return null;

  const { data } = supabase.storage
    .from("computation-image")
    .getPublicUrl(url);

  return data.publicUrl;
};

