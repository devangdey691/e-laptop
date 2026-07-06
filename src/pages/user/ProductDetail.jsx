import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlicer";
import axios, { API_BASE_URL } from "../../utils/axiosconfig";
import {
  ArrowLeft,
  Layers,
  Boxes,
  ShieldCheck,
  Truck,
  RotateCcw,
  Hash,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  useEffect(() => {
    const fetchProductAndSuggestions = async () => {
      try {
        setSuggestionsLoading(true);
        const res = await axios.get(`/products/${id}`);
        const data = res.data.product || res.data;
        console.log(data);

        setProduct(data);
        setSelectedImage(0);
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Fetch suggestions of same category
        const currentCategoryId = data.category?._id || data.category || data.catagory?._id || data.catagory;
        if (currentCategoryId) {
           const allRes = await axios.get("/products");
          const allProducts = allRes.data.createdProducts || allRes.data;
          
          const filtered = allProducts.filter(item => {
            const itemCategoryId = item.category?._id || item.category || item.catagory?._id || item.catagory;
            return item._id !== data._id && itemCategoryId === currentCategoryId;
          });
          setSuggestedProducts(filtered);
        } else {
          setSuggestedProducts([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSuggestionsLoading(false);
      }
    };
    fetchProductAndSuggestions();
  }, [id]);

  const handleBuyNow = () => {
    dispatch(addToCart(product));
    navigate("/cart", { state: { showCheckout: true } });
  };

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3 bg-whitecustom">
        <h2 className="text-xl font-semibold text-primary/60 animate-pulse">
          Loading Product Details...
        </h2>
      </div>
    );
  }

  const rawCategory = product.category || product.catagory;
  const categoryName =
    rawCategory && typeof rawCategory === "object"
      ? rawCategory.name
      : rawCategory || "Uncategorized";

  const priceNum = Number(product.price || 0);
  const discountNum = Number(product.discountPrice || 0);
  const savings = priceNum - discountNum;

  const isOutOfStock = product.stock === 0 || product.quantity === 0;

  const currentPhotoPath =
    product.photos && product.photos[selectedImage]
      ? product.photos[selectedImage]
      : "";
  const processedMainImageUrl = currentPhotoPath.startsWith("http")
    ? currentPhotoPath
    : `${API_BASE_URL}/${currentPhotoPath.replace(/\\/g, "/")}`.replace(
        /([^:]\/)\/+/g,
        "$1",
      );

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4 sm:p-8 min-h-screen antialiased">
      <Breadcrumb
        items={[
          { label: "Products", link: "/product-list" },
          { label: product?.name || "Product Details" },
        ]}
      />
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-secondary mb-6 hover:text-accent font-bold text-sm transition group"
      >
        <ArrowLeft
          size={16}
          className="transform group-hover:-translate-x-0.5 transition-transform"
        />
        Back to Products
      </button>

      <div className="bg-whitecustom shadow-xl border border-light/40 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 items-start">
        <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky ">
          <div className="flex flex-col justify-center items-center bg-slate-50 rounded-2xl border border-slate-100 p-6 h-[380px] relative group transition-colors hover:bg-slate-100/50">
            <img
              src={processedMainImageUrl}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";
              }}
              className="max-w-full max-h-[340px] object-contain transition-transform duration-500 group-hover:scale-105"
              alt={product.name}
            />

            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-red-500 text-whitecustom text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md">
                Out of Stock
              </div>
            )}
          </div>
          {product.photos && product.photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5 justify-center py-1">
              {product.photos.slice(0, 8).map((img, i) => {
                const thumbnailSrc = img.startsWith("http")
                  ? img
                  : `${API_BASE_URL}/${img.replace(/\\/g, "/")}`.replace(
                      /([^:]\/)\/+/g,
                      "$1",
                    );

                return (
                  <button
                    key={i}
                    onMouseEnter={() => setSelectedImage(i)}
                    onClick={() => setSelectedImage(i)}
                    className={`w-full aspect-square rounded-xl overflow-hidden border bg-whitecustom p-1 transition-all flex items-center justify-center ${
                      selectedImage === i
                        ? "border-secondary ring-4 ring-secondary/20"
                        : "border-light/60 hover:border-secondary"
                    }`}
                  >
                    <img
                      src={thumbnailSrc}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-md border border-secondary/10 uppercase tracking-wide">
                  <Layers size={12} /> {categoryName}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight leading-tight">
                {product.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {priceNum > discountNum && (
                <div className="p-3 bg-light/20 rounded-xl border border-light/40">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-primary/40 mb-0.5">
                    Original Price
                  </span>
                  <span className="text-base font-bold text-primary/40 line-through">
                    ₹{priceNum}
                  </span>
                </div>
              )}

              <div
                className={`p-3 rounded-xl border ${priceNum > discountNum ? "bg-secondary/5 border-secondary/20" : "bg-light/20 border-light/40 col-span-2"}`}
              >
                <span
                  className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${priceNum > discountNum ? "text-secondary" : "text-primary/50"}`}
                >
                  Current Price
                </span>
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <span className="text-xl sm:text-2xl font-black text-primary">
                    ₹{discountNum}
                  </span>
                  {savings > 0 && (
                    <span className="text-[11px] font-bold text-secondary bg-whitecustom px-2 py-0.5 rounded border border-secondary/20 shadow-3xs">
                      Save ₹{savings.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-primary bg-light/10 border border-light/40 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Boxes size={16} className="text-primary/40" />
                {isOutOfStock ? (
                  <span className="text-sm font-bold text-red-500">
                    {product.availabilityStatus || "Currently unavailable"}
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="text-sm font-bold text-red-500 animate-pulse">
                    ⚠️ Only {product.stock} items remaining (
                    {product.availabilityStatus || "Low Stock"})!
                  </span>
                ) : (
                  <span className="text-sm font-medium text-emerald-600">
                    ✔{" "}
                    {product.availabilityStatus ||
                      "In Stock (Available to ship)"}
                  </span>
                )}
              </div>
              <span className="text-xs font-extrabold text-primary/80 bg-whitecustom px-2.5 py-0.5 rounded-md border border-light/60 shadow-3xs">
                {product.stock !== undefined ? product.stock : 0} left
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary/40">
                Product Specifications & Details
              </h4>
              <p className="text-sm text-primary/80 bg-light/10 rounded-xl border border-light/30 p-4 leading-relaxed whitespace-pre-line">
                {product.description ||
                  "This premium product is crafted with high-quality materials to ensure durability and top-notch performance. Perfect for daily use."}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary/40 mb-1">
                Fulfillment Rules & Assurances
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-start gap-2.5 p-3 bg-whitecustom border border-light/30 rounded-xl shadow-3xs">
                  <ShieldCheck
                    size={16}
                    className="text-secondary mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="block text-[10px] font-bold text-primary/40 uppercase tracking-wide">
                      Warranty
                    </span>
                    <span className="text-xs font-semibold text-primary/80 leading-tight block mt-0.5">
                      {product.warrantyInformation || "1 Year Warranty"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-whitecustom border border-light/30 rounded-xl shadow-3xs">
                  <Truck size={16} className="text-secondary mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-[10px] font-bold text-primary/40 uppercase tracking-wide">
                      Shipping
                    </span>
                    <span className="text-xs font-semibold text-primary/80 leading-tight block mt-0.5">
                      {product.shippingInformation || "Free Shipping"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-whitecustom border border-light/30 rounded-xl shadow-3xs">
                  <RotateCcw
                    size={16}
                    className="text-secondary mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="block text-[10px] font-bold text-primary/40 uppercase tracking-wide">
                      Return Window
                    </span>
                    <span className="text-xs font-semibold text-primary/80 leading-tight block mt-0.5">
                      {product.returnPolicy || "30 Days Returns"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {product.tags && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary/40 flex items-center gap-1">
                  <Hash size={12} /> Metadata Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(product.tags)
                    ? product.tags
                    : product.tags.split(",")
                  ).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium text-primary/70 bg-light px-2.5 py-1 rounded-md border border-light/20 transition-colors cursor-default"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-light/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className={`w-full font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] tracking-wide uppercase text-xs flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? "bg-light text-primary/30 cursor-not-allowed shadow-none"
                  : "bg-blue-900 hover:bg-blue-950 text-whitecustom shadow-blue-900/25"
              }`}
            >
              <CreditCard size={14} />
              {isOutOfStock ? "Sold Out" : "Buy Now"}
            </button>

            <button
              disabled={isOutOfStock}
              onClick={() => dispatch(addToCart(product))}
              className={`w-full border-2 font-bold py-3.5 rounded-xl transition-all active:scale-[0.99] uppercase text-xs flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? "border-light/40 bg-transparent text-primary/30 cursor-not-allowed"
                  : "bg-whitecustom border-light text-primary hover:border-primary shadow-sm"
              }`}
            >
              <ShoppingBag size={14} />
              {isOutOfStock ? "Item Unavailable" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="mt-16 pt-8 border-t border-light/40">
        <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
          <Boxes className="text-secondary" size={24} />
          You Might Also Like
        </h3>
        
        {suggestionsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex flex-col bg-whitecustom rounded-xl shadow-md overflow-hidden border border-light/40 p-4 space-y-4 animate-pulse">
                <div className="h-40 w-full bg-light/30 rounded-lg"></div>
                <div className="h-4 w-20 bg-light/30 rounded-md"></div>
                <div className="h-5 w-3/4 bg-light/30 rounded-md"></div>
                <div className="h-4 w-1/2 bg-light/20 rounded-md"></div>
                <div className="flex justify-between items-center pt-2 mt-auto">
                  <div className="h-6 w-16 bg-light/30 rounded-md"></div>
                  <div className="h-8 w-20 bg-light/30 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        ) : suggestedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {suggestedProducts.map((item) => {
              const photos = item.photos && item.photos.length > 0
                ? item.photos
                : ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"];
              const currentPhotoUrl = photos[0]?.startsWith("http")
                ? photos[0]
                : `${API_BASE_URL}${photos[0]}`;
              const itemCategory = item.category || item.catagory;
              const catName = itemCategory && typeof itemCategory === "object"
                ? itemCategory.name
                : itemCategory || "Uncategorized";
              const isItemOutOfStock = item.stock === 0 || item.quantity === 0;

              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="flex flex-col bg-whitecustom rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-light/40 cursor-pointer group overflow-hidden h-full transform hover:-translate-y-1"
                >
                  <div className="relative h-44 w-full bg-light/10 overflow-hidden flex-shrink-0 flex items-center justify-center p-4">
                    <img
                      src={currentPhotoUrl}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";
                      }}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      alt={item.name}
                    />
                    {isItemOutOfStock && (
                      <span className="absolute top-2 left-2 bg-red-500 text-whitecustom text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 block">
                      {catName}
                    </span>
                    <h4 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-primary/60 line-clamp-2 min-h-[32px] mb-3">
                      {item.description}
                    </p>

                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-accent">
                          ₹{item.discountPrice || item.price}
                        </span>
                        {item.discountPrice && item.price > item.discountPrice && (
                          <span className="text-xs text-primary/40 line-through">
                            ₹{item.price}
                          </span>
                        )}
                      </div>
                      <button
                        disabled={isItemOutOfStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(addToCart(item));
                        }}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-colors ${
                          isItemOutOfStock
                            ? "bg-light text-primary/30 cursor-not-allowed"
                            : "bg-secondary text-whitecustom hover:bg-accent"
                        }`}
                      >
                        {isItemOutOfStock ? "Sold Out" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-primary/50 text-sm border border-dashed border-light/60 rounded-2xl bg-light/5">
            No related products found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
