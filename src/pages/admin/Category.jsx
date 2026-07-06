import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosconfig";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = "/category";

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data.createdcategory || []);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const confirmDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <span className="font-bold text-primary">
            Delete this category permanently?
          </span>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-xs bg-light text-primary font-bold rounded-md hover:bg-light/80 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleDelete(id);
              }}
              className="px-3 py-1 text-xs bg-red-600 text-whitecustom font-bold rounded-md hover:bg-red-700 transition"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      ),
      { duration: 6000 },
    );
  };

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Processing delete...");
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Category removed", { id: loadingToast });
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      toast.error("Failed to delete", { id: loadingToast });
    }
  };

  return (
    <div className="p-6 md:p-10 bg-light/10 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">
            Category Management
          </h2>
        </div>

        <button
          onClick={() => navigate("/admin/category/create")}
          className="bg-primary text-whitecustom px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition shadow-md shadow-primary/10 self-start sm:self-auto"
        >
          <Plus size={18} /> Create Category
        </button>
      </div>

      <div className="bg-whitecustom rounded-2xl shadow-xl border border-light/40 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-light/10 border-b border-light/30">
            <tr className="text-xs font-bold uppercase tracking-wider text-primary/70">
              <th className="p-4 sm:p-5">#</th>
              <th className="p-4 sm:p-5">Name</th>
              <th className="p-4 sm:p-5">Slug</th>
              <th className="p-4 sm:p-5">Status</th>
              <th className="p-4 sm:p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light/20 text-sm">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-secondary"
                    size={32}
                  />
                </td>
              </tr>
            ) : (
              categories.map((cat, index) => (
                <tr
                  key={cat._id}
                  className="hover:bg-light/5 transition-colors"
                >
                  <td className="p-4 sm:p-5 text-primary/40 font-bold">
                    {index + 1}
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-primary">
                    {cat.name}
                  </td>
                  <td className="p-4 sm:p-5 text-primary/60 italic">
                    {cat.slug || "—"}
                  </td>
                  <td className="p-4 sm:p-5 whitespace-nowrap align-middle">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                        cat.isActive
                          ? "text-green-600 bg-green-50"
                          : "text-red-500 bg-red-50"
                      }`}
                    >
                      {cat.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-center whitespace-nowrap align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/category/edit/${cat._id}`)
                        }
                        className="px-3 py-1.5 text-sm bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-colors"
                        title="Edit Category"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => confirmDelete(cat._id)}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default Category;
