import React, { useState } from "react";
import {
  Contact as ContactIcon, // Renamed alias to avoid confusion with page components
  Grid2X2,
  LayoutDashboard,
  ShoppingBasket,
  ClipboardList,
  User as UserIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isMobile = false, onClose = () => {} }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      name: "Products",
      path: "/admin/ProductList",
      icon: <ShoppingBasket />,
    },
    {
      name: "Categories",
      path: "/admin/category",
      icon: <Grid2X2 />,
    },
    {
      name: "Customer Inquiries", 
      path: "/admin/customers",
      icon: <ContactIcon />,
    },
    {
      name: "Customer Orders",
      path: "/admin/orders",
      icon: <ClipboardList />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <UserIcon />,
    },
  ];

  return (
    <div
      className={`bg-gray-900 text-white flex flex-col ${
        isMobile
          ? "w-full h-full"
          : `sticky top-0 h-screen transition-all duration-300 ${
              isOpen ? "w-64" : "w-20"
            } z-50`
      }`}
    >
      {!isMobile && (
        <button
          className="p-2 m-2 bg-gray-800 rounded hover:bg-gray-600 transition text-sm font-bold"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "← Collapse" : "→"}
        </button>
      )}

      <ul className="mt-4 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={index}>
              <Link
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition ${
                  isActive
                    ? "bg-gray-800 border-l-4 border-blue-500 font-semibold text-blue-400"
                    : "hover:bg-gray-800/50 text-gray-300"
                }`}
              >
                <span className={isActive ? "text-blue-400" : "text-gray-400"}>
                  {item.icon}
                </span>
                {(isMobile || isOpen) && <span>{item.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
