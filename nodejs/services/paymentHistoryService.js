import {supabase} from "../config/supabaseClient.js";

export const getPaymentHistoryCore = async (sourceType, sourceId) => {
  const { data, error } = await supabase
    .from("payment_history")
    .select(`
      id,
      payment_method,
      amount_paid,
      created_at
    `)
    .eq("source_type", sourceType)
    .eq("source_id", sourceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const applyPaymentCore = async ({
  table,
  sourceType,
  sourceId,
  paymentMethod,
  amount,
}) => {
  // 1️⃣ Fetch authoritative totals
  const { data: record, error: fetchError } = await supabase
    .from(table)
    .select("amount_paid, total")
    .eq("id", sourceId)
    .single();

  if (fetchError) throw fetchError;

  const currentPaid = Number(record.amount_paid || 0);
  const totalAmount = Number(record.total);
  const updatedAmountPaid = currentPaid + amount;

  // 2️⃣ Determine status
  const paymentStatus =
    updatedAmountPaid >= totalAmount ? "Paid" : "Partially Paid";

  // 3️⃣ Update parent record
  const { data: updated, error: updateError } = await supabase
    .from(table)
    .update({
      amount_paid: updatedAmountPaid,
      payment_status: paymentStatus,
    })
    .eq("id", sourceId)
    .select()
    .single();

  if (updateError) throw updateError;

  // 4️⃣ Append immutable history
  const { data: history, error: historyError } = await supabase
    .from("payment_history")
    .insert({
      source_type: sourceType,
      source_id: sourceId,
      payment_method: paymentMethod,
      amount_paid: amount,
    })
    .select()
    .single();

  if (historyError) throw historyError;

  return { updated, history };
};