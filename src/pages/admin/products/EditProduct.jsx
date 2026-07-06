import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { API_BASE_URL } from "../../../utils/axiosconfig";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    discountPrice: "",
    photos: [],
    description: "",
    stock: "",
    tags: "",
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: "In Stock",
    returnPolicy: "",
    isFeatured: false,
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          axios.get("/category"),
          axios.get(`/products/${id}`),
        ]);

        setCategories(categoryRes.data.createdcategory || []);

        const data = productRes.data.product || productRes.data;
        if (data) {
          const categoryId =
            data.category && typeof data.category === "object"
              ? data.category._id
              : data.category || "";

          setFormData({
            name: data.name || "",
            price: data.price || "",
            category: categoryId,
            discountPrice: data.discountPrice || "",
            photos: data.photos || [],
            description: data.description || "",
            stock: data.stock !== undefined ? data.stock : "",
            tags: data.tags || "",
            warrantyInformation: data.warrantyInformation || "",
            shippingInformation: data.shippingInformation || "",
            availabilityStatus: data.availabilityStatus || "In Stock",
            returnPolicy: data.returnPolicy || "",
            isFeatured: data.isFeatured || false,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Initialization Error:", error);
        toast.error("Could not load form data.");
        setLoading(false);
      }
    };

    initializeData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const renderImagePreview = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    if (typeof file === "string" && file.startsWith("http")) {
      return file;
    }
    return `${API_BASE_URL}/${file}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.photos.length === 0) {
        return toast.error("Please upload at least one image.");
      }

      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("price", formData.price);
      formPayload.append("category", formData.category);
      formPayload.append("discountPrice", formData.discountPrice || 0);
      formPayload.append("description", formData.description);
      formPayload.append("stock", formData.stock);
      formPayload.append("tags", formData.tags);
      formPayload.append("warrantyInformation", formData.warrantyInformation);
      formPayload.append("shippingInformation", formData.shippingInformation);
      formPayload.append("availabilityStatus", formData.availabilityStatus);
      formPayload.append("returnPolicy", formData.returnPolicy);
      formPayload.append("isFeatured", formData.isFeatured);

      formData.photos.forEach((file) => {
        if (file instanceof File) {
          formPayload.append("photos", file);
        } else if (typeof file === "string") {
          formPayload.append("existingPhotos", file);
        }
      });

      const res = await axios.put(
        `/products/${id}`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Product updated successfully!");
        navigate("/admin/ProductList");
      }
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response?.data || error.message,
      );
      toast.error(error.response?.data?.message || "Failed to update product.");
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
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">
            Edit Product
          </h2>
          <p className="text-sm text-primary/60 mt-1">
            Modify details below to update this item's record.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/ProductList")}
            className="px-5 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-bold uppercase tracking-wider text-xs transition-all hover:bg-light/10"
          >
            Cancel
          </button>
          <button
            form="product-form"
            type="submit"
            className="bg-primary text-whitecustom font-bold uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all shadow-md hover:bg-primary/90 active:scale-[0.99] text-xs"
          >
            Save Changes
          </button>
        </div>
      </div>

      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-whitecustom border border-light/40 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-primary text-base uppercase tracking-wider">
                Product Images
              </h3>
              <span className="text-[10px] font-bold bg-light/10 text-primary/70 px-2 py-0.5 rounded border border-light/20">
                1:1 Ratio
              </span>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary/70">
                Product Images
              </label>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.photos.map((file, index) => (
                  <div
                    key={index}
                    className="relative border border-light/30 rounded-xl overflow-hidden h-32"
                  >
                    <img
                      src={renderImagePreview(file)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <label className="h-32 border-2 border-dashed border-light/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-light/5 transition">
                  <span className="text-4xl font-light text-primary">+</span>
                  <span className="text-xs text-primary/60">Add Image</span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-whitecustom border border-light/40 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-black text-primary text-base uppercase tracking-wider">
              Product Logistics
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1.5">
                Availability Status
              </label>
              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all cursor-pointer"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="flex items-start gap-2.5 py-2">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-light/40 text-secondary focus:ring-secondary/40 cursor-pointer accent-secondary mt-0.5"
              />
              <label
                htmlFor="isFeatured"
                className="text-sm font-bold text-primary/80 cursor-pointer select-none"
              >
                <span className="block">Mark as Featured Product</span>
                <span className="block text-xs font-normal text-primary/50 mt-1 normal-case">
                  Promote this item on your homepage grid and search components.
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-whitecustom border border-light/40 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="font-black text-primary text-base uppercase tracking-wider border-b border-light/20 pb-3">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1.5">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    onChange={handleChange}
                    value={formData.category}
                    required
                    className="w-full px-4 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="text-primary/60">
                      Select Categories
                    </option>
                    {categories.map((cat) => (
                      <option
                        key={cat._id}
                        value={cat._id}
                        className="text-primary"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary/60">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1.5">
                Description
              </label>
              <textarea
                required
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product details here..."
                className="w-full px-4 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1.5">
                  Stock Quantity
                </label>
                <input
                  required
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1.5">
                  Tags (Comma Separated)
                </label>
                <input
                  required
                  type="text"
                  name="tags"
                  placeholder="e.g. smart, gadget, new"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-whitecustom border border-light/40 rounded-2xl p-6 shadow-xl">
            <h3 className="font-black text-primary text-base uppercase tracking-wider border-b border-light/20 pb-3 mb-5">
              Pricing Systems
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1.5">
                  Original Price ($)
                </label>
                <input
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1.5">
                  Discount Price ($)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-whitecustom border border-light/40 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="font-black text-primary text-base uppercase tracking-wider border-b border-light/20 pb-3">
              Fulfillment & Policies
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1.5">
                  Warranty Information
                </label>
                <input
                  required
                  type="text"
                  name="warrantyInformation"
                  placeholder="e.g. 1 year manufacturer warranty"
                  value={formData.warrantyInformation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1.5">
                  Shipping Information
                </label>
                <input
                  required
                  type="text"
                  name="shippingInformation"
                  placeholder="e.g. Ships in 3-5 business days"
                  value={formData.shippingInformation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary/70 mb-1.5">
                Return Policy
              </label>
              <input
                required
                type="text"
                name="returnPolicy"
                placeholder="e.g. 30 days return window policy"
                value={formData.returnPolicy}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-light/5 border border-light/40 rounded-xl text-primary font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
