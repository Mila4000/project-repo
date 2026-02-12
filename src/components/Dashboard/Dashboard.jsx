import React,{useEffect, useState} from 'react'
import StatsGrid from './StatsGrid';
import ChartSection from './ChartSection';
import TableSection from './TableSection';
import InventoryStatus from './InventoryStatus';


function Dashboard() {

  useEffect(() => {
      fetchSalesWeightChart();
      fetchSalesTable();
      getRevenueChartData();
      getBalanceChartData();
      getInventoryStatus();
  },[]);

  const [salesWeightData, setSalesWeightData] = useState([]);
  const [salesTableData, setSalesTableData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [clientSupplierBalanceData, setClientSupplierBalanceData] = useState([]);
  const [inventoryStatusData, setInventoryStatusData] = useState([]);
  const fetchSalesTable = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/sales-table`);
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      setSalesTableData(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  const fetchSalesWeightChart = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/sales-weight-chart`);

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      setSalesWeightData(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };
  const getRevenueChartData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`);
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      setRevenueChartData(data);
      console.log("Revenue Chart Data:", data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };
  const getBalanceChartData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/client-supplier-balance-chart`);
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      setClientSupplierBalanceData(data);
      console.log("Client Supplier Balance Data:", data);
    
    }
    catch (err) {
      console.error("Fetch failed:", err);
    }
  };
  const getInventoryStatus = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/inventory-status`);
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      setInventoryStatusData(data);
    }
    catch (err) {
      console.error("Fetch failed:", err);
    }
  };
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <StatsGrid />

      {/* Chart Section */}
      <ChartSection
        salesTableData={salesTableData}
        revenueChartData={revenueChartData}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TableSection
          salesandweightdata={salesWeightData}
          balanceData={clientSupplierBalanceData}
          />
        </div>
        <div>
          <InventoryStatus
          inventoryStatusData={inventoryStatusData}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
