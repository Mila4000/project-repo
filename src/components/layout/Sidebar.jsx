import { 
  Zap,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ChevronDown,
  ShoppingCart,
  FolderOpen,
  BarChart3Icon,
  Warehouse
} from 'lucide-react'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';


const menuItems = [
  {
    id: "",
    icon: LayoutDashboard,
    label: "Dashboard",
    active: true,
    badge: "New"
  },
  {
    id: "purchasing",
    icon: ShoppingCart,
    label: "Purchasing",
    submenu: [
      {id: "createPurchase", label: "Create Purchase"},
      {id: "supplierList", label: "Supplier List"},
      {id: "receivedItems", label: "Received Items"}
    ],
  },
  {
    id: "sales",
    icon: FolderOpen,
    label: "Sales",
    count: "23",
    submenu: [
      {id: "createSalesInvoice", label: "Create Sales Invoice"},
      {id: "customerList", label: "Customer List"},
    ],
  },
  {
    id: "inventory",
    icon: Package,
    label: "Inventory",
    count: "67",
    submenu: [
      {id: "brandList", label: "Brand List"},
      {id: "stockManagement", label: "Item List"},
      {id: "inventoryCounting", label: "Inventory Counting"}
    ]
  },
  {
    id: "reports",
    icon: BarChart3Icon,
    label: "Reports",
  },
  {
    id: "warehouse",
    icon: Warehouse,
    label: "Warehouse",
  },
  {
    id: "activityLog",
    icon: FileText,
    label: "Activity Log",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
  }
]


function Sidebar ({collapsed /*onToggle currentPage, onPageChange*/}) {
  const [expandedItems , setExpandedItems] = useState(new Set(["analytics"]));

  const toggleExpanded = (itemid) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemid)) {
      newExpanded.delete(itemid);
    }else{
      newExpanded.add(itemid);
    }

    setExpandedItems(newExpanded);
  }

  return (
    <div className={`${
      collapsed ? "w-20" : "w-72"
    } transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex-col relative z-10`}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white"/>
          </div>

          {/* Conditional Rendering */}
          {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Meat ERP</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Admin Panel
                </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation dynamic menus */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          return (
          <div key={item.id}>
            {!item.submenu ? (
                <NavLink
                  to={`/${item.id}`}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                </NavLink>
              ) : (
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-slate-600 
                    dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                  {!collapsed && <ChevronDown className="w-4 h-4" />}
                </button>
              )}

            {/* Submenu */}
            {!collapsed && 
            item.submenu && 
            expandedItems.has(item.id) &&(
              <div className="ml-8 mt-2 space-y-1">
              {item.submenu.map((subitem) => {
                return (<NavLink
                    to={`/${item.id}/${subitem.id}`}
                    className={({ isActive }) =>
                      `block w-full text-left p-2 text-sm rounded-lg transition-all
                      ${isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      }`
                    }
                  >
                    {subitem.label}
                  </NavLink>
                );
              })}
            </div>
            )}
          </div>
          );
        })}
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <footer>
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4042/4042171.png"
              alt="user"
              className="w-10 h-10 rounded-full ring-2 ring-blue-500"
              />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                Earl Betez
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  )
}

export default Sidebar;
