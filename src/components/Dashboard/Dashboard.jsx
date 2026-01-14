import React,{useEffect, useState} from 'react'
import StatsGrid from './StatsGrid';
import ChartSection from './ChartSection';
import TableSection from './TableSection';
import ActivityFeed from './ActivityFeed';


function Dashboard() {

  useEffect(() => {
      fetchOrderTable();
  },[]);

  const [orderTableData, setOrderTableData] = useState([]);

  const fetchOrderTable = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`);

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      setOrderTableData(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };
  console.log(orderTableData);
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <StatsGrid />

      {/* Chart Section */}
      <ChartSection />

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
