import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Pages
import DashboardPage from "./pages/DashboardPage";

// Purchasing
import CreatePurchase from "./pages/Purchasing/CreatePurchase";
import SupplierList from "./pages/Purchasing/SupplierList";
import ReceivedItems from "./pages/Purchasing/ReceivedItems";

// Sales
import CreateSalesInvoice from "./pages/Sales/CreateSalesInvoice";
import CustomerList from "./pages/Sales/CustomerList";

// Inventory
import StockManagement from "./pages/Inventory/StockManagement";
import InventoryCounting from "./pages/Inventory/InventoryCounting";

// Others
import Reports from "./pages/Reports";
import Warehouse from "./pages/Warehouse";
import ActivityLog from "./pages/ActivityLog";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Dashboard */}
        <Route path="" element={<DashboardPage />} />

        {/* Purchasing */}
        <Route path="purchasing/createpurchase" element={<CreatePurchase />} />
        <Route path="purchasing/supplierlist" element={<SupplierList />} />
        <Route path="purchasing/receiveditems" element={<ReceivedItems />} />

        {/* Sales */}
        <Route path="sales/createSalesInvoice" element={<CreateSalesInvoice />} />
        <Route path="sales/customerList" element={<CustomerList />} />

        {/* Inventory */}
        <Route path="inventory/stockManagement" element={<StockManagement />} />
        <Route path="inventory/inventoryCounting" element={<InventoryCounting />} />

        {/* Single Pages */}
        <Route path="reports" element={<Reports />} />
        <Route path="warehouse" element={<Warehouse />} />
        <Route path="activityLog" element={<ActivityLog />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
