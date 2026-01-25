import React,{useEffect, useState} from 'react'
import StatsGrid from './StatsGrid';
import ChartSection from './ChartSection';
import TableSection from './TableSection';
import ActivityFeed from './ActivityFeed';


function Dashboard() {

  useEffect(() => {
      fetchOrderTable();
      fetchSalesTable();
      getRevenueChartData();
  },[]);

  const [orderTableData, setOrderTableData] = useState([]);
  const [salesTableData, setSalesTableData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const fetchSalesTable = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/dashboard/sales-table');
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      setSalesTableData(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  const fetchOrderTable = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/dashboard/orders');

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      setOrderTableData(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };
  const getRevenueChartData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/dashboard');
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
          ordertable={orderTableData}
          />
        </div>
        <div>
          <ActivityFeed/>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
