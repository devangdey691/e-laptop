import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosconfig";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  IndianRupee,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Premium Skeleton Loader for Dashboard while fetching data
const DashboardSkeleton = () => {
  return (
    <div className="p-6 md:p-10 bg-light/10 min-h-screen animate-pulse">
      <div className="mb-8">
        <div className="h-9 w-64 bg-gray-200 rounded-lg mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Metric Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-whitecustom p-6 rounded-2xl border border-light/40 shadow-xl h-44 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
            </div>
            <div>
              <div className="h-8 w-36 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Graph Sections Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-whitecustom p-6 rounded-2xl border border-light/40 shadow-xl h-[380px]"
          >
            <div className="h-4 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="w-full h-[300px] bg-gray-100 rounded-xl"></div>
          </div>
        ))}
      </div>

      {/* Bottom Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-whitecustom rounded-2xl shadow-xl overflow-hidden border border-light/40 h-80 p-6 space-y-4">
          <div className="h-4 w-48 bg-gray-200 rounded mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="bg-whitecustom p-6 rounded-2xl border border-light/40 shadow-xl h-80 space-y-4">
          <div className="h-4 w-48 bg-gray-200 rounded mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          axios.get("/orders/all"),
          axios.get("/products"),
          axios.get("/users"),
        ]);

        if (ordersRes.data.success) {
          setOrders(ordersRes.data.orders);
        }
        setProducts(productsRes.data.createdProducts || productsRes.data || []);
        setUsers(usersRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Could not load dashboard data from backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Helper styling for transaction statuses
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Processing":
        return "text-amber-600 bg-amber-50 border border-amber-100";
      case "Shipped":
        return "text-blue-600 bg-blue-50 border border-blue-100";
      case "Delivered":
        return "text-green-600 bg-green-50 border border-green-100";
      case "Cancelled":
        return "text-red-600 bg-red-50 border border-red-100";
      default:
        return "text-gray-600 bg-gray-50 border border-gray-100";
    }
  };

  // Compute metrics from real data
  const successfulOrders = orders.filter((o) => o.status !== "Cancelled");
  
  const totalRevenue = successfulOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  
  const productsSold = successfulOrders.reduce(
    (sum, o) => sum + (o.items ? o.items.reduce((itemSum, i) => itemSum + (i.quantity || 1), 0) : 0),
    0
  );

  const activeCustomers = users.length;

  // Month-over-Month calculation details
  const today = new Date();
  const currentMonthNum = today.getMonth();
  const currentYear = today.getFullYear();

  const prevMonthNum = currentMonthNum === 0 ? 11 : currentMonthNum - 1;
  const prevMonthYear = currentMonthNum === 0 ? currentYear - 1 : currentYear;

  const currentMonthOrders = successfulOrders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === currentMonthNum && d.getFullYear() === currentYear;
  });

  const prevMonthOrders = successfulOrders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === prevMonthNum && d.getFullYear() === prevMonthYear;
  });

  // MoM Revenue
  const currentMonthRevenue = currentMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const prevMonthRevenue = prevMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // MoM Products Sold
  const currentMonthProducts = currentMonthOrders.reduce(
    (sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + (i.quantity || 1), 0) : 0),
    0
  );
  const prevMonthProducts = prevMonthOrders.reduce(
    (sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + (i.quantity || 1), 0) : 0),
    0
  );

  // MoM Signups (Active Customer Indicator)
  const currentMonthSignups = users.filter((u) => {
    const d = new Date(u.createdAt);
    return d.getMonth() === currentMonthNum && d.getFullYear() === currentYear;
  }).length;
  const prevMonthSignups = users.filter((u) => {
    const d = new Date(u.createdAt);
    return d.getMonth() === prevMonthNum && d.getFullYear() === prevMonthYear;
  }).length;

  // Calculated Percentages
  const revenueChangePercent = prevMonthRevenue > 0 ? Math.round(((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100) : (currentMonthRevenue > 0 ? 100 : 0);
  const productsChangePercent = prevMonthProducts > 0 ? Math.round(((currentMonthProducts - prevMonthProducts) / prevMonthProducts) * 100) : (currentMonthProducts > 0 ? 100 : 0);
  const signupsChangePercent = prevMonthSignups > 0 ? Math.round(((currentMonthSignups - prevMonthSignups) / prevMonthSignups) * 100) : (currentMonthSignups > 0 ? 100 : 0);

  // Dynamically generate monthly details for charts (last 6 months)
  const generateSalesData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      chartData.push({
        name: months[d.getMonth()],
        monthNum: d.getMonth(),
        year: d.getFullYear(),
        sales: 0,
        revenue: 0,
      });
    }

    successfulOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();

      const matchedMonth = chartData.find((c) => c.monthNum === orderMonth && c.year === orderYear);
      if (matchedMonth) {
        matchedMonth.revenue += order.total || 0;
        const qty = order.items ? order.items.reduce((s, i) => s + (i.quantity || 1), 0) : 0;
        matchedMonth.sales += qty;
      }
    });

    return chartData.map(({ name, sales, revenue }) => ({ name, sales, revenue }));
  };

  const chartSalesData = generateSalesData();

  // Get recent 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Find products that are low in stock (stock <= 5)
  const lowStockProducts = products
    .filter((p) => p.stock !== undefined && p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  return (
    <div className="p-6 md:p-10 bg-light/10 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-primary tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-sm text-primary/60 mt-1">
          Monitor performance metrics, real-time store trends, and campaign
          targets.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-whitecustom p-6 rounded-2xl border border-light/40 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary/60">
              Total Revenue
            </span>
            <div className="bg-secondary/10 text-secondary p-2.5 rounded-xl">
              <IndianRupee size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-primary tracking-tight mb-2">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${revenueChangePercent >= 0 ? "text-green-600" : "text-red-500"}`}>
              {revenueChangePercent >= 0 ? (
                <>
                  <ArrowUpRight size={16} /> +{revenueChangePercent}% from last month
                </>
              ) : (
                <>
                  <ArrowDownRight size={16} /> {revenueChangePercent}% from last month
                </>
              )}
            </div>
          </div>
        </div>

        {/* Products Sold */}
        <div className="bg-whitecustom p-6 rounded-2xl border border-light/40 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary/60">
              Products Sold
            </span>
            <div className="bg-accent/10 text-accent p-2.5 rounded-xl">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-primary tracking-tight mb-2">
              {productsSold.toLocaleString("en-IN")}
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${productsChangePercent >= 0 ? "text-green-600" : "text-red-500"}`}>
              {productsChangePercent >= 0 ? (
                <>
                  <ArrowUpRight size={16} /> +{productsChangePercent}% from last month
                </>
              ) : (
                <>
                  <ArrowDownRight size={16} /> {productsChangePercent}% from last month
                </>
              )}
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-whitecustom p-6 rounded-2xl border border-light/40 shadow-xl flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary/60">
              Active Customers
            </span>
            <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-primary tracking-tight mb-2">
              {activeCustomers.toLocaleString("en-IN")}
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${signupsChangePercent >= 0 ? "text-green-600" : "text-red-500"}`}>
              {signupsChangePercent >= 0 ? (
                <>
                  <ArrowUpRight size={16} /> +{signupsChangePercent}% signups this month
                </>
              ) : (
                <>
                  <ArrowDownRight size={16} /> {signupsChangePercent}% signups this month
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Graph Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Area Chart Component */}
        <div className="bg-whitecustom p-6 rounded-2xl border border-light/40 shadow-xl">
          <h3 className="text-base font-bold text-primary mb-6 uppercase tracking-wider text-xs">
            Revenue Growth (INR)
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartSalesData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3C6E71" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3C6E71" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#D9D9D9"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  stroke="#353535"
                  opacity={0.6}
                  tickLine={false}
                  className="text-xs font-semibold"
                />
                <YAxis
                  stroke="#353535"
                  opacity={0.6}
                  tickLine={false}
                  className="text-xs font-semibold"
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    borderColor: "#D9D9D9",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3C6E71"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Component */}
        <div className="bg-whitecustom p-6 rounded-2xl border border-light/40 shadow-xl">
          <h3 className="text-base font-bold text-primary mb-6 uppercase tracking-wider text-xs">
            Product Sales Performance (Units Sold)
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartSalesData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#D9D9D9"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  stroke="#353535"
                  opacity={0.6}
                  tickLine={false}
                  className="text-xs font-semibold"
                />
                <YAxis
                  stroke="#353535"
                  opacity={0.6}
                  tickLine={false}
                  className="text-xs font-semibold"
                />
                <Tooltip
                  cursor={{ fill: "#D9D9D9", opacity: 0.1 }}
                  formatter={(value) => [value, "Units Sold"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    borderColor: "#D9D9D9",
                  }}
                />
                <Bar dataKey="sales" fill="#284B63" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity and Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-whitecustom rounded-2xl shadow-xl overflow-hidden border border-light/40 flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-light/20 flex justify-between items-center">
              <h3 className="text-base font-bold text-primary uppercase tracking-wider text-xs">
                Recent Store Orders
              </h3>
              <a
                href="/admin/orders"
                className="text-xs font-bold text-secondary hover:underline"
              >
                View All Orders
              </a>
            </div>
            <div className="overflow-x-auto">
              {recentOrders.length === 0 ? (
                <div className="p-12 text-center text-primary/50 text-sm">
                  No orders placed yet.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-light/10 border-b border-light/30 text-xs font-bold uppercase tracking-wider text-primary/70">
                      <th className="p-4 sm:p-5">Order ID</th>
                      <th className="p-4 sm:p-5">Customer</th>
                      <th className="p-4 sm:p-5">Date</th>
                      <th className="p-4 sm:p-5">Status</th>
                      <th className="p-4 sm:p-5">Net Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light/20 text-sm">
                    {recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-light/5 transition-colors"
                      >
                        <td className="p-4 sm:p-5 font-mono text-xs font-bold text-secondary">
                          {order.orderId || `#${order._id.substring(order._id.length - 8)}`}
                        </td>
                        <td className="p-4 sm:p-5">
                          <div>
                            <p className="font-bold text-primary">
                              {order.userId?.name || "Guest Customer"}
                            </p>
                            <span className="text-xs text-primary/50 block">
                              {order.userId?.email || "No Email"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-5 text-primary/80 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="p-4 sm:p-5 whitespace-nowrap align-middle">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${getStatusBadgeStyle(
                              order.status
                            )}`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-primary font-bold whitespace-nowrap">
                          ₹{order.total.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-whitecustom p-6 rounded-2xl border border-light/40 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-primary uppercase tracking-wider text-xs flex items-center gap-1.5">
                <AlertTriangle size={16} className="text-amber-500" /> Inventory Alerts
              </h3>
              <span className="text-[10px] font-black tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                {lowStockProducts.length} LOW STOCK
              </span>
            </div>
            <div className="space-y-4">
              {lowStockProducts.length === 0 ? (
                <div className="p-8 text-center text-primary/50 text-xs border border-dashed border-light/40 rounded-xl">
                  All products are adequately stocked!
                </div>
              ) : (
                lowStockProducts.map((product) => (
                  <div
                    key={product._id || product.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-light/5 border border-light/20"
                  >
                    <div className="max-w-[70%]">
                      <p className="font-bold text-xs text-primary truncate">
                        {product.name}
                      </p>
                      <span className="text-[10px] text-primary/50 block mt-0.5">
                        Price: ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-black px-2 py-1 rounded-lg ${
                          product.stock === 0
                            ? "text-red-600 bg-red-50 border border-red-100"
                            : "text-amber-600 bg-amber-50 border border-amber-100"
                        }`}
                      >
                        {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                      </span>
                      <div className="w-16 bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden ml-auto">
                        <div
                          className={`h-full ${product.stock === 0 ? "bg-red-500" : "bg-amber-500"}`}
                          style={{
                            width: `${Math.min((product.stock / 5) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-light/20">
            <a
              href="/admin/ProductList"
              className="text-xs font-bold text-secondary hover:underline block text-center uppercase tracking-wider"
            >
              Manage Catalog
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
