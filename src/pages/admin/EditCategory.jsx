import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosconfig";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Loader2, ArrowLeft, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = `/category`;

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        const data = res.data.category || res.data;
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          isActive: data.isActive ?? true,
        });
      } catch (err) {
        toast.error("Failed to load category");
        navigate("/admin/category");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, navigate]);

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
    const loadingToast = toast.loading("Updating records...");

    try {
      await axios.put(`${API_URL}/${id}`, formData);
      toast.success("Changes saved successfully!", { id: loadingToast });
      navigate("/admin/category");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed", {
        id: loadingToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-secondary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-10 bg-light/10">
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
                Edit Category
              </h2>
              <p className="text-sm text-primary/60 mt-1">
                Update information for category:{" "}
                <span className="font-bold text-secondary">
                  {formData.name}
                </span>
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
                  className="bg-light/5 border border-light/40 p-2.5 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all font-mono text-xs"
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
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-light/20">
              <div className="flex items-center gap-3 cursor-pointer">
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

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/category")}
                  className="px-6 py-3.5 border border-light/40 text-primary font-bold uppercase tracking-wider rounded-xl hover:bg-light/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={submitting}
                  className="bg-primary text-whitecustom px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-70 shadow-md shadow-primary/10"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
