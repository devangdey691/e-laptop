import React, { useState } from "react";
import axios from "../../utils/axiosconfig";
import { Plus, Loader2, ArrowLeft, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  const API_URL = "/category";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const loadingToast = toast.loading("Creating category...");

    try {
      await axios.post(API_URL, formData);
      toast.success("Category created successfully!", { id: loadingToast });
      navigate("/admin/category");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating category", {
        id: loadingToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start p-4 md:p-10 bg-light/10">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-4 mb-8">
          <button
            onClick={() => navigate("/admin/category")}
            className="flex items-center gap-2 text-sm font-bold text-primary/60 hover:text-secondary transition-colors w-fit"
          >
            <ArrowLeft size={16} /> Back to Categories
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-primary tracking-tight">
                Create New Category
              </h2>
              <p className="text-primary/60 text-sm mt-1">
                Organize your products by adding a new classification.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-whitecustom rounded-2xl shadow-xl border border-light/40 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-primary/70">
                  Category Name
                </label>
                <input
                  className="bg-light/5 border border-light/40 p-2.5 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all"
                  placeholder="e.g. Electronics"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-primary/70">
                  URL Slug
                </label>
                <input
                  className="bg-light/5 border border-light/40 p-2.5 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all"
                  placeholder="electronics-item"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-primary/70">
                Description
              </label>
              <textarea
                className="bg-light/5 border border-light/40 p-2.5 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all min-h-[120px]"
                placeholder="Describe the type of products in this category..."
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-light/20">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    className="sr-only peer"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <div className="w-11 h-6 bg-light rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-whitecustom after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-whitecustom after:border-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </div>
                <label
                  htmlFor="isActive"
                  className="text-sm font-bold text-primary/80 cursor-pointer select-none"
                >
                  Visible to customers
                </label>
              </div>

              <button
                disabled={submitting}
                className="bg-primary text-whitecustom px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-primary/10"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Plus size={20} />
                )}
                Create Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
