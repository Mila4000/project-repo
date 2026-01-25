import { supabase } from "../config/supabaseClient.js";

export const getDeliveryHistoryCore = async (sourceType, sourceId) => {
  const { data, error } = await supabase
    .from("delivery_status_history")
    .select(`
      id,
      delivery_status,
      remarks,
      created_at
    `)
    .eq("source_type", sourceType)
    .eq("source_id", sourceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const updateDeliveryStatusCore = async ({
  table,
  sourceType,
  sourceId,
  deliveryStatus,
  remark,
}) => {
  // 1️⃣ Update current status (authoritative)
  const { error: updateError } = await supabase
    .from(table)
    .update({
      delivery_status: deliveryStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sourceId);

  if (updateError) throw updateError;

  // 2️⃣ Append immutable history
  const { data, error: historyError } = await supabase
    .from("delivery_status_history")
    .insert({
      source_type: sourceType,
      source_id: sourceId,
      delivery_status: deliveryStatus,
      remarks: remark,
    })
    .select()
    .single();

  if (historyError) throw historyError;

  return data;
};
