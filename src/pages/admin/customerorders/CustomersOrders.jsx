import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../../../utils/axiosconfig";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  IndianRupee,
  Search,
  Filter,
  Eye,
  X,
  Calendar,
  User,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  TrendingUp,
  Printer,
  Package,
} from "lucide-react";

const CustomersOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders/all");
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error("Failed to load orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(
        error.response?.data?.message || "Could not connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `/orders/status/${orderId}`,
        { status: newStatus }
      );
      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Server error.");
    }
  };

  // Calculations for stats dashboard
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === "Processing").length;
  const completedCount = orders.filter((o) => o.status === "Delivered").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Filtering logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.userId?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order.userId?.email || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Processing":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Shipped":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans text-primary">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">
            Customer Orders
          </h1>
          <p className="text-sm text-primary/60 mt-1">
            Track, monitor, and manage user purchases and delivery status.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="self-start px-4 py-2 text-xs font-bold uppercase tracking-wider bg-light/20 text-primary border border-light/60 rounded-xl hover:bg-light/40 transition-colors"
        >
          Refresh Orders
        </button>
      </div>

      {/* Stats Cards Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Orders */}
        <div className="bg-whitecustom border border-light/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary/50 block">
              Total Orders
            </span>
            <span className="text-2xl font-black text-primary block mt-1">
              {totalOrdersCount}
            </span>
          </div>
          <div className="bg-primary/5 text-primary p-3 rounded-2xl">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="bg-whitecustom border border-light/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary/50 block">
              Pending Processing
            </span>
            <span className="text-2xl font-black text-amber-600 block mt-1">
              {pendingCount}
            </span>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
            <Clock size={24} />
          </div>
        </div>

        {/* Card 3: Delivered Orders */}
        <div className="bg-whitecustom border border-light/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary/50 block">
              Delivered
            </span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">
              {completedCount}
            </span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="bg-whitecustom border border-light/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary/50 block">
              Net Revenue
            </span>
            <span className="text-2xl font-black text-secondary block mt-1 flex items-center">
              <IndianRupee size={20} className="inline mr-0.5" />
              {totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="bg-secondary/10 text-secondary p-3 rounded-2xl">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-whitecustom border border-light/40 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary/40">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by Customer name, email, or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-light/20 border border-light/60 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-sm placeholder-primary/40"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold uppercase tracking-wider text-primary/50 mr-2 flex items-center gap-1">
            <Filter size={14} /> Filter:
          </span>
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap border ${statusFilter === status
                  ? "bg-secondary text-whitecustom border-secondary"
                  : "bg-light/10 text-primary/70 border-light/40 hover:bg-light/25"
                  }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-whitecustom border border-light/40 rounded-2xl p-12 text-center shadow-sm">
          <ShoppingBag className="mx-auto text-primary/30 mb-4" size={48} />
          <h3 className="text-lg font-bold text-primary mb-1">
            No Orders Found
          </h3>
          <p className="text-sm text-primary/60">
            Could not find any orders matching the current filter or search criteria.
          </p>
        </div>
      ) : (
        <div className="bg-whitecustom border border-light/40 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-light/10 border-b border-light/30 text-xs font-bold uppercase tracking-wider text-primary/70">
                  <th className="p-4 sm:p-5">Order ID</th>
                  <th className="p-4 sm:p-5">Customer Info</th>
                  <th className="p-4 sm:p-5">Date</th>
                  <th className="p-4 sm:p-5">Items</th>
                  <th className="p-4 sm:p-5">Total</th>
                  <th className="p-4 sm:p-5">Payment</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light/20 text-sm">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-light/5 transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-mono text-xs font-bold text-secondary">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="hover:underline text-left text-secondary"
                        title="Click to view details"
                      >
                        #{order._id.substring(order._id.length - 8)}
                      </button>
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

                    <td className="p-4 sm:p-5 whitespace-nowrap text-primary/80">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="p-4 sm:p-5 max-w-[200px] truncate font-medium text-primary/80">
                      {order.items?.map((i) => `${i.name} (${i.quantity})`).join(", ")}
                    </td>

                    <td className="p-4 sm:p-5 font-black text-primary whitespace-nowrap">
                      ₹{order.total}
                    </td>

                    <td className="p-4 sm:p-5 whitespace-nowrap align-middle">
                      <span className="px-2.5 py-1 text-xs font-bold tracking-wider bg-light/30 text-primary/80 rounded-md border border-light/50">
                        {order.paymentMethod || "COD"}
                      </span>
                    </td>

                    <td className="p-4 sm:p-5 whitespace-nowrap align-middle">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-colors ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 sm:p-5 text-center whitespace-nowrap align-middle">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-colors flex items-center gap-1.5 mx-auto"
                        title="View Details"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-whitecustom rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-light/30 transform transition-all flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-light/20 flex justify-between items-start bg-light/5">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-1 rounded-md">
                    Order Invoice
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getStatusStyle(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <h2 className="text-xl font-black text-primary mt-2">
                  Order ID: #{selectedOrder._id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-primary/40 hover:text-primary/80 hover:bg-light/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
              {/* Customer and Delivery Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-light/10 p-4 rounded-2xl border border-light/20">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary/40 block mb-1">
                    Customer Information
                  </h3>
                  <p className="font-bold text-primary flex items-center gap-2 text-sm">
                    <User size={15} className="text-secondary" />
                    {selectedOrder.userId?.name || "Guest Customer"}
                  </p>
                  <p className="text-xs text-primary/70 flex items-center gap-2 break-all">
                    <Mail size={15} className="text-secondary" />
                    {selectedOrder.userId?.email || "No email available"}
                  </p>
                  <p className="text-xs text-primary/70 flex items-center gap-2">
                    <Phone size={15} className="text-secondary" />
                    {selectedOrder.phone || "No phone number"}
                  </p>
                </div>

                <div className="space-y-2 border-t md:border-t-0 md:border-l border-light/25 pt-3 md:pt-0 md:pl-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary/40 block mb-1">
                    Shipping & Payment
                  </h3>
                  <p className="text-xs text-primary/70 flex items-start gap-2">
                    <MapPin size={15} className="text-secondary mt-0.5 flex-shrink-0" />
                    <span>{selectedOrder.address}</span>
                  </p>
                  <p className="text-xs text-primary/70 flex items-center gap-2 mt-2">
                    <CreditCard size={15} className="text-secondary" />
                    <span>Method: {selectedOrder.paymentMethod || "COD"}</span>
                  </p>
                  <p className="text-xs text-primary/70 flex items-center gap-2">
                    <Calendar size={15} className="text-secondary" />
                    <span>
                      Placed On:{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString(
                        undefined,
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </span>
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary/40 mb-3 flex items-center gap-1.5">
                  <Package size={14} className="text-secondary" /> Order Items
                </h3>
                <div className="border border-light/40 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-light/10 border-b border-light/30 font-bold uppercase text-primary/70">
                        <th className="p-3">Item Name</th>
                        <th className="p-3 text-center w-20">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light/20 text-primary/95 font-medium">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index} className="hover:bg-light/5">
                          <td className="p-3">{item.name}</td>
                          <td className="p-3 text-center">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-center bg-light/10 p-4 rounded-xl border border-light/20">
                <span className="text-xs font-bold uppercase tracking-wider text-primary/50">
                  Total Amount Paid:
                </span>
                <span className="text-xl font-black text-primary">
                  ₹{selectedOrder.total}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-light/5 border-t border-light/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Inline status update in modal */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary/60">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder._id, e.target.value)
                  }
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${getStatusStyle(
                    selectedOrder.status
                  )}`}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-light/60 text-primary rounded-xl hover:bg-light/20 transition-colors flex items-center gap-1.5"
                >
                  <Printer size={14} /> Print Invoice
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-primary text-whitecustom hover:bg-primary/90 rounded-xl transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersOrders;
