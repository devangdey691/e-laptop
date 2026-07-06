import React, { useEffect, useState } from "react";
import axios, { API_BASE_URL } from "../../utils/axiosconfig";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlicer";
import { CreditCard, Search, SlidersHorizontal, Sparkles, ShoppingBag, ChevronDown, ArrowUpDown } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndexes, setCurrentPhotoIndexes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Price filter and sorting states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [priceSort, setPriceSort] = useState("none"); // "none", "lowToHigh", "highToLow"
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isCustomActive, setIsCustomActive] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/products");
        setProducts(res.data.createdProducts || res.data);
      } catch (error) {
        console.log("Error found:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isDropdownOpen && !e.target.closest(".price-dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isDropdownOpen]);

  const nextSlide = (id, total) => {
    setCurrentPhotoIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % total,
    }));
  };

  const prevSlide = (id, total) => {
    setCurrentPhotoIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) - 1 + total) % total,
    }));
  };

  // Helper function to handle navigation to details page
  const handleViewDetails = (id) => {
    navigate(`/product/${id}`); 
  };

  // Helper function to handle immediate checkout
  const handleBuyNow = (item) => {
    dispatch(addToCart(item));
    navigate("/cart", { state: { showCheckout: true } });
  };

  // Dynamically compute category filters
  const categories = ["All", ...new Set(products.map((item) => {
    const rawCategory = item.category || item.catagory;
    return rawCategory && typeof rawCategory === "object"
      ? rawCategory.name
      : rawCategory || "Uncategorized";
  }))];

  // Filter products by category, search query, and custom price range
  const filteredProducts = products.filter((item) => {
    const rawCategory = item.category || item.catagory;
    const catName = rawCategory && typeof rawCategory === "object"
      ? rawCategory.name
      : rawCategory || "Uncategorized";
    
    const matchesCategory = selectedCategory === "All" || catName === selectedCategory;
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const price = item.discountPrice !== undefined && item.discountPrice !== null ? item.discountPrice : item.price;
    const matchesMinPrice = minPrice === "" || price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === "" || price <= parseFloat(maxPrice);

    return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  // Sort products based on price sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice !== undefined && a.discountPrice !== null ? a.discountPrice : a.price;
    const priceB = b.discountPrice !== undefined && b.discountPrice !== null ? b.discountPrice : b.price;
    if (priceSort === "lowToHigh") {
      return priceA - priceB;
    }
    if (priceSort === "highToLow") {
      return priceB - priceA;
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-slate-800 font-sans">
      <Breadcrumb items={[{ label: "Products" }]} />

      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-10 mb-10 shadow-xl border border-slate-800">
        {/* Abstract Glowing Gradients in Background */}
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="text-left space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
              <Sparkles size={11} className="animate-pulse text-indigo-400" /> Live Catalog
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Our <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent animate-gradient-xy">Premium Tech</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Explore our fully verified high-end consumer electronics. Tailored for quality, elegance, and extreme performance.
            </p>
          </div>

          {/* Interactive Modern Search Box */}
          <div className="w-full lg:max-w-md text-left">
            <div className="relative group">
              {/* Animated Background Border Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl opacity-20 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
              
              <div className="relative flex items-center bg-slate-950/60 backdrop-blur-md rounded-2xl border border-slate-800/80 overflow-hidden px-4">
                <Search className="text-indigo-400 mr-2 flex-shrink-0" size={18} />
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3.5 bg-transparent border-none outline-none text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Quick Metrics display */}
            <div className="flex items-center justify-between mt-2.5 px-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                Found <strong className="text-indigo-400">{sortedProducts.length}</strong> {sortedProducts.length === 1 ? "product" : "products"}
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-emerald-400 hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Sorting Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-8 border-b border-light/30">
        {/* Category Pills Filter */}
        {categories.length > 1 ? (
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none select-none flex-grow">
            <div className="text-slate-500 p-2 border-r border-light mr-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <SlidersHorizontal size={14} className="text-secondary" /> Filter
            </div>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer relative overflow-hidden ${
                    isActive
                      ? "bg-secondary text-whitecustom shadow-lg shadow-indigo-600/25 scale-[1.02]"
                      : "bg-whitecustom border border-light text-slate-600 hover:border-secondary/40 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex-grow" />
        )}

        {/* Price Dropdown filter */}
        <div className="relative flex-shrink-0 price-dropdown-container">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-whitecustom border transition-all duration-300 cursor-pointer shadow-sm select-none ${
              priceSort !== "none" || isCustomActive
                ? "border-secondary/50 text-secondary bg-indigo-50/20"
                : "border-light text-slate-700 hover:border-secondary/40 hover:text-slate-900"
            }`}
          >
            <ArrowUpDown size={14} className={priceSort !== "none" || isCustomActive ? "text-secondary" : "text-slate-400"} />
            <span>
              {priceSort === "lowToHigh"
                ? "Price: Low to High"
                : priceSort === "highToLow"
                ? "Price: High to Low"
                : isCustomActive
                ? `Price: ₹${minPrice || 0} - ₹${maxPrice || "∞"}`
                : "Price Range"}
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              } ${priceSort !== "none" || isCustomActive ? "text-secondary" : "text-slate-400"}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-whitecustom rounded-2xl border border-light shadow-xl z-50 p-4 animate-scale-in">
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setPriceSort("lowToHigh");
                    setIsCustomActive(false);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    priceSort === "lowToHigh"
                      ? "bg-secondary text-whitecustom shadow-sm"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>📈 Price: Low to High</span>
                  {priceSort === "lowToHigh" && <span className="text-[10px]">✓</span>}
                </button>

                <button
                  onClick={() => {
                    setPriceSort("highToLow");
                    setIsCustomActive(false);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    priceSort === "highToLow"
                      ? "bg-secondary text-whitecustom shadow-sm"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>📉 Price: High to Low</span>
                  {priceSort === "highToLow" && <span className="text-[10px]">✓</span>}
                </button>

                <hr className="border-light/50" />

                <div className="space-y-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Custom Range
                  </span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      value={tempMinPrice}
                      onChange={(e) => setTempMinPrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-light rounded-xl focus:outline-none focus:border-secondary bg-slate-50 text-slate-900"
                    />
                    <span className="text-slate-400 text-xs">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-light rounded-xl focus:outline-none focus:border-secondary bg-slate-50 text-slate-900"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setMinPrice(tempMinPrice);
                        setMaxPrice(tempMaxPrice);
                        setIsCustomActive(tempMinPrice !== "" || tempMaxPrice !== "");
                        setPriceSort("none");
                        setIsDropdownOpen(false);
                      }}
                      className="flex-1 py-2 bg-secondary text-whitecustom text-xs font-bold rounded-xl hover:bg-opacity-95 active:scale-[0.98] transition-all text-center cursor-pointer shadow-md shadow-indigo-600/10"
                    >
                      Apply
                    </button>
                    {(tempMinPrice || tempMaxPrice || isCustomActive || priceSort !== "none") && (
                      <button
                        onClick={() => {
                          setTempMinPrice("");
                          setTempMaxPrice("");
                          setMinPrice("");
                          setMaxPrice("");
                          setIsCustomActive(false);
                          setPriceSort("none");
                          setIsDropdownOpen(false);
                        }}
                        className="px-3 py-2 border border-light text-slate-500 hover:text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all text-center cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-whitecustom rounded-2xl border border-light/60 p-5 space-y-4 animate-pulse"
            >
              <div className="h-48 w-full bg-slate-100 rounded-xl"></div>
              <div className="flex justify-between items-center">
                <div className="h-5 w-20 bg-slate-150 rounded-md"></div>
                <div className="h-5 w-10 bg-slate-150 rounded-md"></div>
              </div>
              <div className="h-6 w-3/4 bg-slate-150 rounded-md"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded-md"></div>
                <div className="h-4 w-5/6 bg-slate-100 rounded-md"></div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-light/40">
                <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
                <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-whitecustom rounded-3xl border border-dashed border-light/60">
          <p className="text-slate-500 text-lg font-medium">No products match your search or filter.</p>
          <p className="text-sm text-slate-400 mt-1">Try resetting the category filter or typing a different keyword.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setPriceSort("none");
              setMinPrice("");
              setMaxPrice("");
              setTempMinPrice("");
              setTempMaxPrice("");
              setIsCustomActive(false);
            }}
            className="mt-6 px-6 py-2.5 bg-secondary text-whitecustom font-bold rounded-xl hover:bg-opacity-90 transition-all text-xs cursor-pointer shadow-md shadow-indigo-600/10"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((item, index) => {
            const photos =
              item.photos && item.photos.length > 0
                ? item.photos
                : [
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
                ];

            const activeIdx = currentPhotoIndexes[item._id] || 0;
            const rawCategory = item.category || item.catagory;
            const isOutOfStock = item.stock === 0 || item.quantity === 0;

            const currentPhotoUrl = photos[activeIdx]?.startsWith("http")
              ? photos[activeIdx]
              : `${API_BASE_URL}${photos[activeIdx]}`;

            const categoryName = rawCategory && typeof rawCategory === "object"
              ? rawCategory.name
              : rawCategory || "Uncategorized";

            return (
              <div
                key={item._id}
                className="flex flex-col bg-whitecustom rounded-2xl border border-light hover:border-secondary/35 shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group h-full cursor-pointer text-left overflow-hidden scroll-reveal"
                style={{ transitionDelay: `${(index % 4) * 100}ms` }}
              >
                {/* --- CLICKABLE IMAGE ZONE --- */}
                <div
                  onClick={() => handleViewDetails(item._id)}
                  className="relative h-48 w-full bg-slate-50 flex items-center justify-center p-4 border-b border-light/50 overflow-hidden flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={currentPhotoUrl}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";
                    }}
                    className="max-h-full max-w-full object-contain group-hover:scale-103 transition-transform duration-500"
                    alt={item.name || "product"}
                  />

                  <div className="absolute top-3 left-3 bg-white px-2 py-0.5 border border-light/50 rounded-full font-semibold z-10">
                    {!isOutOfStock && item.stock <= 5 && (
                      <span className="text-[10px] font-bold text-red-500 animate-pulse">
                        Only {item.stock} left!
                      </span>
                    )}
                  </div>

                  {isOutOfStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm z-10">
                      Out of Stock
                    </div>
                  )}

                  {/* Slideshow Arrows (only show if multiple photos) */}
                  {photos.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevSlide(item._id, photos.length);
                        }}
                        className="bg-whitecustom/85 text-primary rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-whitecustom transition-colors z-10 font-bold"
                      >
                        ←
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextSlide(item._id, photos.length);
                        }}
                        className="bg-whitecustom/85 text-primary rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-whitecustom transition-colors z-10 font-bold"
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>

                {/* --- CLICKABLE DETAILS ZONE --- */}
                <div
                  className="p-5 flex flex-col flex-grow cursor-pointer"
                  onClick={() => handleViewDetails(item._id)}
                >
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase bg-indigo-50 text-secondary rounded">
                      {categoryName}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-secondary transition-colors mb-1.5 line-clamp-1">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 min-h-[32px] mb-4">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-auto pt-3 flex items-baseline gap-2 mb-4">
                    <span className="text-base font-black text-slate-950">
                      ₹{item.discountPrice}
                    </span>
                    {item.price > item.discountPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{item.price}
                      </span>
                    )}
                  </div>

                  {/* --- ACTION BUTTONS --- */}
                  <div
                    className="flex gap-2 pt-3 border-t border-light/50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      disabled={isOutOfStock}
                      onClick={() => dispatch(addToCart(item))}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all text-[11px] flex items-center justify-center gap-1 cursor-pointer ${isOutOfStock
                          ? "bg-light text-primary/40 cursor-not-allowed"
                          : "bg-slate-900 text-whitecustom hover:bg-secondary active:scale-[0.98]"
                        }`}
                    >
                      <ShoppingBag size={13} /> Add
                    </button>

                    <button
                      disabled={isOutOfStock}
                      onClick={() => handleBuyNow(item)}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all active:scale-[0.98] text-[11px] flex items-center justify-center gap-1 shadow-md shadow-blue-900/15 cursor-pointer ${isOutOfStock
                          ? "bg-light text-primary/30 cursor-not-allowed shadow-none"
                          : "bg-blue-900 hover:bg-blue-950 text-whitecustom"
                        }`}
                    >
                      <CreditCard size={13} /> Buy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Product;