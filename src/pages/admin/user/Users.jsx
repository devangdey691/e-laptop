import React, { useEffect, useState } from "react";
import axios, { API_BASE_URL } from "../../../utils/axiosconfig";
import toast from "react-hot-toast";
import {
  Mail,
  User,
  Calendar,
  Trash2,
  Eye,
  X,
  ShoppingBag,
  UserCheck
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setDetailLoading(true);
    try {
      const response = await axios.get(`/users/${user._id}`);
      setSelectedUserDetail(response.data);
    } catch (error) {
      console.error("Error fetching user detail:", error);
      toast.error("Could not load user details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone."))
      return;

    try {
      await axios.delete(`/users/${id}`);
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u._id !== id));
      if (selectedUser?._id === id) {
        setSelectedUser(null);
        setSelectedUserDetail(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Server error during user deletion.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary tracking-tight">
          Registered Users
        </h1>
        <p className="text-sm text-primary/60 mt-1">
          Monitor and manage accounts registered on Devang Store.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="bg-whitecustom border border-light/40 rounded-2xl p-12 text-center shadow-sm">
          <User className="mx-auto text-primary/30 mb-4" size={48} />
          <h3 className="text-lg font-bold text-primary mb-1">
            No Users Registered
          </h3>
          <p className="text-sm text-primary/60">
            There are currently no registered customer accounts in the database.
          </p>
        </div>
      ) : (
        <div className="bg-whitecustom border border-light/40 rounded-2xl shadow-xl overflow-hidden animate-scale-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-light/10 border-b border-light/30 text-xs font-bold uppercase tracking-wider text-primary/70">
                  <th className="p-4 sm:p-5">User Info</th>
                  <th className="p-4 sm:p-5">Active Cart</th>
                  <th className="p-4 sm:p-5">Registered On</th>
                  <th className="p-4 sm:p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light/20 text-sm">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-light/5 transition-colors"
                  >
                    <td className="p-4 sm:p-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.profilePhoto ? (
                          <img
                            src={`${API_BASE_URL}${user.profilePhoto}`}
                            alt={user.name}
                            className="w-10 h-10 rounded-xl object-cover border border-light/40"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "";
                            }}
                          />
                        ) : (
                          <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                            <User size={18} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-primary">
                            {user.name}
                          </p>
                          <span className="flex items-center gap-1 text-xs text-primary/60 mt-0.5">
                            <Mail size={12} /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 sm:p-5 align-middle text-primary">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        <ShoppingBag size={12} />
                        {user.cart ? user.cart.length : 0} items
                      </span>
                    </td>

                    <td className="p-4 sm:p-5 text-primary/60 whitespace-nowrap align-middle">
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </td>

                    <td className="p-4 sm:p-5 text-center whitespace-nowrap align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="px-3 py-1.5 text-sm bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-colors"
                          title="View User Details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                          title="Delete User Account"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-whitecustom rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-light/30 transform transition-all scale-100">
            <div className="p-6 border-b border-light/20 flex justify-between items-start bg-light/5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-1 rounded-md">
                  User Account Profile
                </span>
                <h2 className="text-xl font-black text-primary mt-2 break-words">
                  {selectedUser.name}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedUserDetail(null);
                }}
                className="p-1.5 text-primary/40 hover:text-primary/80 hover:bg-light/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-light/5 p-5 rounded-xl border border-light/10">
                {selectedUser.profilePhoto ? (
                  <img
                    src={`${API_BASE_URL}${selectedUser.profilePhoto}`}
                    alt={selectedUser.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/20 shadow-md"
                  />
                ) : (
                  <div className="bg-primary/10 text-primary w-24 h-24 rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-md">
                    <User size={48} />
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-lg font-black text-primary">{selectedUser.name}</span>
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <UserCheck size={12} /> Verified Member
                    </span>
                  </div>
                  <p className="text-sm text-primary/65 flex items-center justify-center sm:justify-start gap-2">
                    <Mail size={14} /> {selectedUser.email}
                  </p>
                  <p className="text-xs text-primary/50 flex items-center justify-center sm:justify-start gap-2">
                    <Calendar size={14} /> Joined on {new Date(selectedUser.createdAt).toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}
                  </p>
                </div>
              </div>

              {/* Cart Content Details */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary/50 mb-3 flex items-center gap-2">
                  <ShoppingBag size={16} /> Active Shopping Cart
                </h3>
                {detailLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : selectedUserDetail?.cart && selectedUserDetail.cart.length > 0 ? (
                  <div className="border border-light/20 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-light/5 border-b border-light/20 text-xs font-bold text-primary/60">
                            <th className="p-3">Product Name</th>
                            <th className="p-3 text-center">Qty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-light/10 text-primary">
                          {selectedUserDetail.cart.map((item, index) => (
                            <tr key={index} className="hover:bg-light/5">
                              <td className="p-3 font-semibold">
                                {item.product?.name || "Unknown Product"}
                              </td>
                              <td className="p-3 text-center font-bold text-secondary">
                                {item.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-light/5 border border-light/10 rounded-xl p-6 text-center text-primary/60">
                    <ShoppingBag className="mx-auto text-primary/30 mb-2" size={32} />
                    <p className="text-sm font-medium">Cart is empty</p>
                    <p className="text-xs text-primary/50 mt-1">This user currently has no items saved in their cart.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-light/5 border-t border-light/20 flex justify-end gap-3">
              <button
                onClick={() => handleDeleteUser(selectedUser._id)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete User
              </button>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedUserDetail(null);
                }}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-primary text-whitecustom hover:bg-primary/90 rounded-xl transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
