import { supabase } from "../config/supabaseClient.js";

export const getOrderTable = async () => {
  const { data, error } = await supabase
    .from("purchased_order")
    .select(`
      *,
      supplier (
        businessname
      )
    `)
    .order("id", { ascending: false })
    .limit(5);

  if (error) throw error;

  return data;
};

export const getDashboardStats = async () => {
  const startOfCurrentMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();

  const startOfPrevMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1
  ).toISOString();

  /* ---------------- ACTIVE CUSTOMERS ---------------- */

  const { count: currentActiveCustomers } = await supabase
    .from("customer")
    .select("*", { count: "exact", head: true })
    .eq("status", "Active")
    .gte("created_at", startOfCurrentMonth);

  const { count: prevActiveCustomers } = await supabase
    .from("customer")
    .select("*", { count: "exact", head: true })
    .eq("status", "Active")
    .gte("created_at", startOfPrevMonth)
    .lt("created_at", startOfCurrentMonth);

  /* ---------------- TOTAL ORDERS ---------------- */

  const { count: currentOrders } = await supabase
    .from("purchased_order")
    .select("*", { count: "exact", head: true })
    .gte("transaction_date", startOfCurrentMonth);

  const { count: prevOrders } = await supabase
    .from("purchased_order")
    .select("*", { count: "exact", head: true })
    .gte("transaction_date", startOfPrevMonth)
    .lt("transaction_date", startOfCurrentMonth);

  /* ---------------- HELPERS ---------------- */

  const calcChange = (current, previous) => {
    // No data at all
    if (previous === 0 && current === 0) {
      return { change: "0%", trend: "up" };
    }

    // New data appeared this month
    if (previous === 0 && current > 0) {
      return { change: "+100%", trend: "up" };
      // OR use: { change: "New", trend: "up" }
    }

    const percent = ((current - previous) / previous) * 10;

    return {
      change: `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`,
      trend: percent >= 0 ? "up" : "down",
    };
  };

  const activeCustomersStats = calcChange(
    currentActiveCustomers,
    prevActiveCustomers
  );

  const ordersStats = calcChange(currentOrders, prevOrders);

  return {
    activeCustomers: {
      value: currentActiveCustomers,
      ...activeCustomersStats,
    },
    totalOrders: {
      value: currentOrders,
      ...ordersStats,
    },
  };
};