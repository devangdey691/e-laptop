import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosconfig";
import toast from "react-hot-toast";
import {
  Mail,
  User,
  MessageSquare,
  Calendar,
  Trash2,
  Eye,
  X,
} from "lucide-react";

const Customers = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get("/customer");
      setInquiries(response.data.customers || response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?"))
      return;

    try {
      await axios.delete(`/customer/${id}`);
      toast.success("Inquiry deleted successfully");
      setInquiries(inquiries.filter((item) => item._id !== id));
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error(error.response?.data?.message || "Server error during deletion.");
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
          Customer Inquiries
        </h1>
        <p className="text-sm text-primary/60 mt-1">
          Manage and review support tickets submitted by store visitors.
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-whitecustom border border-light/40 rounded-2xl p-12 text-center shadow-sm">
          <MessageSquare className="mx-auto text-primary/30 mb-4" size={48} />
          <h3 className="text-lg font-bold text-primary mb-1">
            All Caught Up!
          </h3>
          <p className="text-sm text-primary/60">
            No customer messages or support tickets found in the system.
          </p>
        </div>
      ) : (
        <div className="bg-whitecustom border border-light/40 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-light/10 border-b border-light/30 text-xs font-bold uppercase tracking-wider text-primary/70">
                  <th className="p-4 sm:p-5">Customer Info</th>
                  <th className="p-4 sm:p-5">Subject</th>
                  <th className="p-4 sm:p-5">Message Body</th>
                  <th className="p-4 sm:p-5">Submitted On</th>
                  <th className="p-4 sm:p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light/20 text-sm">
                {inquiries.map((inquiry) => (
                  <tr
                    key={inquiry._id}
                    className="hover:bg-light/5 transition-colors"
                  >
                    <td className="p-4 sm:p-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 text-secondary p-2.5 rounded-xl">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-primary">
                            {inquiry.name}
                          </p>
                          <span className="flex items-center gap-1 text-xs text-primary/60 mt-0.5">
                            <Mail size={12} /> {inquiry.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 sm:p-5 font-semibold text-primary align-middle max-w-[200px] truncate">
                      {inquiry.subject}
                    </td>

                    <td className="p-4 sm:p-5 text-primary/80 align-middle max-w-sm">
                      <p className="line-clamp-2 leading-relaxed">
                        {inquiry.message}
                      </p>
                    </td>

                    <td className="p-4 sm:p-5 text-primary/60 whitespace-nowrap align-middle">
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar size={14} />
                        {new Date(inquiry.createdAt).toLocaleDateString(
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
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="px-3 py-1.5 text-sm bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-colors"
                          title="View Ticket Details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(inquiry._id)}
                          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                          title="Delete Ticket"
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

      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-whitecustom rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-light/30 transform transition-all scale-100">
            <div className="p-6 border-b border-light/20 flex justify-between items-start bg-light/5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-1 rounded-md">
                  Inquiry Details
                </span>
                <h2 className="text-xl font-black text-primary mt-2 break-words">
                  {selectedInquiry.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 text-primary/40 hover:text-primary/80 hover:bg-light/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-light/5 p-4 rounded-xl border border-light/10">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-primary/40 block">
                    From
                  </label>
                  <p className="font-bold text-primary flex items-center gap-2 mt-0.5">
                    <User size={14} className="text-primary/60" />{" "}
                    {selectedInquiry.name}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-primary/40 block">
                    Email Address
                  </label>
                  <p className="font-medium text-primary flex items-center gap-2 mt-0.5 break-all">
                    <Mail size={14} className="text-primary/60" />{" "}
                    {selectedInquiry.email}
                  </p>
                </div>
                <div className="sm:col-span-2 border-t border-light/10 pt-3 mt-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary/40 block">
                    Received On
                  </label>
                  <p className="text-sm text-primary/70 flex items-center gap-2 mt-0.5">
                    <Calendar size={14} className="text-primary/60" />
                    {new Date(selectedInquiry.createdAt).toLocaleString(
                      undefined,
                      {
                        dateStyle: "long",
                        timeStyle: "short",
                      },
                    )}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-primary/40 block mb-2">
                  Message Body
                </label>
                <div className="bg-light/5 border border-light/10 rounded-xl p-4 min-h-[120px]">
                  <p className="text-primary/90 leading-relaxed whitespace-pre-wrap break-words text-sm">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-light/5 border-t border-light/20 flex justify-end gap-3">
              <button
                onClick={() => handleDelete(selectedInquiry._id)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete Ticket
              </button>
              <button
                onClick={() => setSelectedInquiry(null)}
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

export default Customers;
