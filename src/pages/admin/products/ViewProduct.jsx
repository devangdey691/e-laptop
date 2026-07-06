import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { API_BASE_URL } from "../../../utils/axiosconfig";
import {
  ArrowLeft,
  DollarSign,
  Percent,
  Image as ImageIcon,
  Layers,
  ShieldCheck,
  Truck,
  RotateCcw,
  Boxes,
  Hash,
} from "lucide-react";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        console.log("Response from Server:", res.data);
        const productData = res.data.product || res.data;
        setProduct(productData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getCategoryName = (category) => {
    if (!category) return "Uncategorized";
    if (typeof category === "object" && category.name) {
      return category.name;
    }
    return String(category);
  };

  const getAvailabilityBadgeColor = (status) => {
    const checkStatus = status?.toLowerCase() || "";
    if (checkStatus.includes("in stock"))
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (checkStatus.includes("low stock"))
      return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500 font-medium">
        Loading product details...
      </div>
    );

  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="p-10 text-center max-w-md mx-auto mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <h2 className="text-red-500 text-xl font-bold mb-2">
          Product Not Found
        </h2>
        <p className="text-slate-500 mb-6">
          The server returned no data for ID: {id}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const photosArray = Array.isArray(product.photos)
    ? product.photos.filter((url) => url && String(url).trim() !== "")
    : [];

  const formatImageUrl = (url) => {
    if (!url) return "";

    // 1. Convert backslashes from operating systems (like Windows paths) into standard slashes
    let cleanPath = String(url).replace(/\\/g, "/");

    // 2. If it's already an external absolute URL, return it directly
    if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
      return cleanPath;
    }

    // 3. Drop leading slashes to prevent url duplication issues
    if (cleanPath.startsWith("/")) {
      cleanPath = cleanPath.substring(1);
    }

    // 4. Strip out "public/" if your backend server exposes the inside of the public folder statically
    if (cleanPath.startsWith("public/")) {
      cleanPath = cleanPath.replace("public/", "");
    }

    // 5. Construct final serving URL endpoint
    const finalUrl = `${API_BASE_URL}/${cleanPath}`;

    // Check your browser console to see what URL is being outputted!
    console.log("Formed Asset Image Path ->", finalUrl);

    return finalUrl;
  };

  const activeImageSource =
    photosArray.length > 0 ? photosArray[activeImageIndex] : null;

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4 sm:p-8 bg-slate-50/50 min-h-screen antialiased">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 mb-6 hover:text-slate-900 font-bold text-sm transition"
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div className="bg-white shadow-xl border border-slate-200/60 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex flex-col justify-center items-center bg-slate-100 rounded-2xl border border-slate-200 p-6 h-[380px] relative group transition-colors">
            {activeImageSource ? (
              <img
                src={formatImageUrl(activeImageSource)}
                alt={product.name}
                className="w-full h-full object-contain rounded-xl drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  console.error("Image target failed to load: ", e.target.src);
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x400?text=Image+Not+Found+On+Server";
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <ImageIcon size={44} strokeWidth={1.5} />
                <span className="text-sm font-medium">
                  No Image Found in Database
                </span>
              </div>
            )}
          </div>

          {photosArray.length > 1 && (
            <div className="grid grid-cols-3 gap-3 justify-center py-1">
              {photosArray.map((photoUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-full aspect-square rounded-xl overflow-hidden border-2 bg-white p-1 transition-all flex items-center justify-center ${
                    activeImageIndex === idx
                      ? "border-indigo-600 ring-4 ring-indigo-50"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img
                    src={formatImageUrl(photoUrl)}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/100?text=Error";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 uppercase tracking-wide">
                  <Layers size={12} /> {getCategoryName(product.category)}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wide ${getAvailabilityBadgeColor(product.availabilityStatus)}`}
                >
                  {product.availabilityStatus || "In Stock"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  <DollarSign size={13} /> Original Price
                </span>
                <span className="text-lg font-bold text-slate-400 line-through">
                  ${product.price}
                </span>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
                  <Percent size={13} /> Exclusive Deal Price
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600">
                  {product.discountPrice
                    ? `$${product.discountPrice}`
                    : `$${product.price}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3">
              <Boxes size={16} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-500">
                Current Stock Inventory:
              </span>
              <span className="text-sm font-extrabold text-slate-800 bg-white px-2.5 py-0.5 rounded-md border shadow-2xs">
                {product.stock !== undefined ? product.stock : 0} units
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Product Specifications & Details
              </h4>
              <p className="text-sm font-medium text-slate-600 bg-slate-50/50 rounded-xl border border-slate-100/80 p-4 leading-relaxed whitespace-pre-line">
                {product.description ||
                  "No description overview provided for this product database record."}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Fulfillment Rules & Assurances
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-start gap-2.5 p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                  <ShieldCheck
                    size={16}
                    className="text-indigo-600 mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Warranty Setup
                    </span>
                    <span className="text-xs font-semibold text-slate-700 leading-tight">
                      {product.warrantyInformation || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                  <Truck
                    size={16}
                    className="text-indigo-600 mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Courier Shipping
                    </span>
                    <span className="text-xs font-semibold text-slate-700 leading-tight">
                      {product.shippingInformation || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                  <RotateCcw
                    size={16}
                    className="text-indigo-600 mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Return Window
                    </span>
                    <span className="text-xs font-semibold text-slate-700 leading-tight">
                      {product.returnPolicy || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {product.tags && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Hash size={12} /> Database Metadata Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(product.tags)
                    ? product.tags
                    : product.tags.split(",")
                  ).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md hover:bg-slate-200/70 transition-colors cursor-default"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-slate-800 active:scale-[0.99] transition shadow-md hover:shadow-lg"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
