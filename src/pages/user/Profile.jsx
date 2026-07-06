import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Package, ShoppingBag, Camera, Eye, X } from "lucide-react";
import axios, { API_BASE_URL } from "../../utils/axiosconfig";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumb";

const Profile = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login to view your profile");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders/my-orders");
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        } else {
          toast.error("Could not fetch order history.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, navigate]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic file type validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setUploading(true);
      const res = await axios.patch("/users/profile-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Profile photo updated successfully!");
        const updatedUser = {
          ...user,
          profilePhoto: res.data.user.profilePhoto,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setProfilePhoto(res.data.user.profilePhoto);
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to upload profile photo.");
      }
    } finally {
      setUploading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative bg-whitecustom text-slate-800 font-sans selection:bg-secondary selection:text-whitecustom overflow-hidden min-h-screen text-left">
      {/* Background radial gradient */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 [background:radial-gradient(100%_60%_at_50%_0%,rgba(79,70,229,0.05)_0%,rgba(255,255,255,0)_100%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-6 pb-16 sm:pb-24">
        <Breadcrumb items={[{ label: "My Profile" }]} />

        {/* Profile Header Card */}
        <div className="bg-whitecustom rounded-3xl p-6 md:p-8 border border-light/60 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-6 mb-10 mt-8 relative z-10">
          <div className="relative group">
            <div 
              onClick={() => profilePhoto && setIsModalOpen(true)}
              className={`w-24 h-24 rounded-full overflow-hidden bg-indigo-50 text-secondary flex items-center justify-center text-4xl font-black shadow-inner border-2 border-secondary/20 relative ${profilePhoto ? "cursor-pointer hover:border-secondary transition-all duration-300" : ""}`}
            >
              {profilePhoto ? (
                <div className="w-full h-full relative group/img">
                  <img
                    src={`${API_BASE_URL}${profilePhoto}`}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                      setProfilePhoto("");
                    }}
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <Eye size={20} className="text-whitecustom drop-shadow-md" />
                  </div>
                </div>
              ) : (
                user?.name ? user.name[0].toUpperCase() : "U"
              )}
              {uploading && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-whitecustom border-t-transparent"></div>
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-secondary text-whitecustom p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition shadow-md border-2 border-whitecustom flex items-center justify-center">
              <Camera size={14} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex-grow text-center md:text-left space-y-2">
            <h1 className="text-3xl font-black text-slate-900">{user?.name || "User Profile"}</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-slate-500 text-sm font-semibold justify-center md:justify-start">
              <span className="flex items-center gap-1.5 justify-center">
                <Mail size={16} className="text-secondary" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1.5 justify-center">
                <User size={16} className="text-secondary" />
                Customer Account
              </span>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="space-y-6 relative z-10 pt-6 border-t border-light/60">
          <div className="flex items-center gap-3 pb-2">
            <div className="bg-indigo-50 p-2 rounded-xl text-secondary">
              <Package size={22} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Your Order History</h2>
            <span className="text-sm font-semibold text-slate-400">({orders.length} orders)</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-whitecustom rounded-3xl p-12 text-center border border-light/60 shadow-xl shadow-slate-200/50">
              <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-400 mb-4">
                <ShoppingBag size={36} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No orders placed yet</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                Looks like you haven't placed any orders yet. Visit our product listing to explore our latest items!
              </p>
              <button
                onClick={() => navigate("/product-list")}
                className="px-6 py-2.5 bg-blue-900 text-whitecustom font-bold rounded-xl hover:bg-blue-950 transition-all text-sm shadow-md shadow-blue-900/15 cursor-pointer uppercase tracking-wider"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="bg-whitecustom rounded-3xl border border-light/60 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-light/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Items</th>
                      <th className="py-4 px-6">Delivery Address</th>
                      <th className="py-4 px-6 text-right">Total</th>
                      <th className="py-4 px-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light/30 text-sm">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50/30 transition duration-150">
                        <td className="py-4 px-6 font-mono text-xs text-slate-450 font-semibold">
                          {order.orderId || `#${order._id.slice(-6).toUpperCase()}`}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1.5 max-w-xs">
                            {order.items?.map((item, index) => (
                              <div
                                key={index}
                                className="text-slate-800 font-bold text-xs bg-slate-100 border border-light/50 rounded-lg px-2.5 py-1 inline-flex items-center"
                              >
                                {item.name}
                                <span className="text-slate-400 font-semibold ml-1.5">
                                  x{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-xs text-slate-600 max-w-[200px] truncate" title={order.address}>
                            {order.address}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 font-bold">
                            Tel: {order.phone}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-black text-slate-900">
                          ₹{order.total}
                          <span className="block text-[10px] text-slate-450 font-bold mt-0.5">
                            {order.paymentMethod || "COD"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                              order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                                : order.status === "Shipped"
                                ? "bg-blue-50 text-blue-700 border-blue-250"
                                : "bg-amber-50 text-amber-700 border-amber-250"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && profilePhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 transition-all duration-300 animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative max-w-2xl w-full bg-whitecustom rounded-3xl overflow-hidden shadow-2xl p-2 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 bg-slate-100 hover:bg-light text-slate-700 hover:text-slate-900 rounded-full p-2 transition-all shadow-md z-10 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={18} className="stroke-[2.5]" />
            </button>
            <div className="rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[75vh]">
              <img
                src={`${API_BASE_URL}${profilePhoto}`}
                alt="Profile Large"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold text-slate-800">{user?.name || "Profile Photo"}</h3>
              <p className="text-xs text-slate-500 font-semibold">{user?.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
