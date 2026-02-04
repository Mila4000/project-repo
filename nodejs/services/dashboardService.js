import { supabase } from "../config/supabaseClient.js";

export const getSalesWeightChart = async () => {
  const { data, error } = await supabase
    .from("monthly_sales_weight")
    .select(`
      month_label,
      total_sales,
      total_weight
    `);

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
  /* ---------------- TOTAL SALES ---------------- */
  const { data: currentSales, error: currentSalesError } =
    await supabase.from("sales_invoice")
    .select("total")
    .eq("payment_status", "Paid")
    .gte("transaction_date", startOfCurrentMonth);
  if (currentSalesError) throw currentSalesError;
  const { data: prevSales, error: prevSalesError } =
    await supabase.from("sales_invoice")
    .select("total")
    .eq("payment_status", "Paid")
    .gte("transaction_date", startOfPrevMonth)
    .lt("transaction_date", startOfCurrentMonth);
  if (prevSalesError) throw prevSalesError;
  

  const sumSales = (rows = []) =>
  rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
  const currentSalesTotal = sumSales(currentSales);
  const prevSalesTotal = sumSales(prevSales);
  /* ---------------- KG Sold ---------------- */
  const { data: currentSoldKG } = await supabase
    .rpc("get_sold_kg_between", {
      start_date: startOfCurrentMonth,
      end_date: null
    });

  const { data: prevSoldKG } = await supabase
    .rpc("get_sold_kg_between", {
      start_date: startOfPrevMonth,
      end_date: startOfCurrentMonth
    });
  /* ---------------- TOTAL RECEIVABLES ---------------- */
  const { data: currentReceivables, error: currentReceivablesError } =
    await supabase.from("sales_invoice")
    .select("total")
    .gte("transaction_date", startOfCurrentMonth);
  if (currentReceivablesError) throw currentReceivablesError;
  const { data: prevReceivables, error: prevReceivablesError } =
    await supabase.from("sales_invoice")
    .select("total")
    .gte("transaction_date", startOfPrevMonth)
    .lt("transaction_date", startOfCurrentMonth);
  if (prevReceivablesError) throw prevReceivablesError;
  

  const receivablesTotal = (rows = []) =>
  rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
  const currentReceivablesTotal = receivablesTotal(currentReceivables);
  const prevReceivablesTotal = receivablesTotal(prevReceivables);
  /* ---------------- TOTAL PAYABLES ---------------- */
  const { data: currentPayables, error: currentPayablesError } =
    await supabase.from("purchased_order")
    .select("total")
    .eq("payment_status", "Unpaid")
    .gte("transaction_date", startOfCurrentMonth);
  if (currentPayablesError) throw currentPayablesError;
  const { data: prevPayables, error: prevPayablesError } =
    await supabase.from("purchased_order")
    .select("total")
    .eq("payment_status", "Unpaid")
    .gte("transaction_date", startOfPrevMonth)
    .lt("transaction_date", startOfCurrentMonth);
  if (prevPayablesError) throw prevPayablesError;
  

  const payablesTotal = (rows = []) =>
  rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
  const currentPayablesTotal = payablesTotal(currentPayables);
  const prevPayablesTotal = payablesTotal(prevPayables);
  /* ---------------- INACTIVE CUSTOMERS ---------------- */

  const { count: currentInactiveCustomers } = await supabase
    .from("customer")
    .select("*", { count: "exact", head: true })
    .eq("status", "Inactive");
  
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


  const salesStats = calcChange(currentSalesTotal, prevSalesTotal);
  const kgSoldStats = calcChange(currentSoldKG, prevSoldKG);
  const receivablesStats = calcChange(currentReceivablesTotal, prevReceivablesTotal);
  const payablesStats = calcChange(currentPayablesTotal, prevPayablesTotal);
  return {
    sales: {
      value: currentSalesTotal,
      ...salesStats,
    },
    kgSold: {
      value: currentSoldKG,
      ...kgSoldStats,
    },
    receivables: {
      value: currentReceivablesTotal,
      ...receivablesStats,
    },
    payables: {
      value: currentPayablesTotal,
      ...payablesStats,
    },
    inactiveCustomers: {
      value: currentInactiveCustomers
    },
    
  };
};

export const getSalesTable = async () => {
const { data, error } = await supabase
    .from("sales_invoice_item")
    .select(`
      *
    `)
    .order("id", { ascending: false });

  if (error) throw error;

  return data;
}
export const getMonthlySalesExpenses = async () => {
  const { data, error } = await supabase
    .from("monthly_sales_expenses")
    .select(`
      month,
      sales,
      expenses
    `);

  if (error) throw error;

  return data;
};
export const getClientSupplierBalance = async () => {
  const { data, error } = await supabase
    .rpc("get_client_supplier_balance");

  if (error) throw error;
  return data;
};

export const getInventoryStatus = async () => {
  const { data, error } = await supabase
    .rpc("get_inventory_status");

  if (error) throw error;
  return data;
};