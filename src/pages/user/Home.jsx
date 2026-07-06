import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { API_BASE_URL } from "../../utils/axiosconfig";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  fetchCartFromMongoDB,
} from "../../redux/cartSlicer";
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Mail, 
  Sparkles, 
  Smartphone, 
  Laptop, 
  Tv, 
  Headphones 
} from "lucide-react";
import Tech3DCanvas from "../../components/Tech3DCanvas";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartStatus = useSelector((state) => state.cart?.status || "idle");

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from MongoDB if we haven't successfully loaded it already
  useEffect(() => {
    if (cartStatus === "idle") {
      dispatch(fetchCartFromMongoDB());
    }
  }, [dispatch, cartStatus]);

  useEffect(() => {
    const getFeatured = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/products");

        const products = res.data.createdProducts || [];
        const featured = products.filter((item) => item.isFeatured === true);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    getFeatured();
  }, []);

  const handleShopRedirect = () => {
    navigate("/product-list");
  };

  const handleProductRedirect = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    console.log("Added to cart via Redux:", product.name);
  };

  return (
    <div className="home-container bg-slate-50 min-h-screen font-sans antialiased text-slate-800">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-b-[40px] px-6 py-20 lg:py-28 shadow-xl">
        <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 [background:radial-gradient(100%_60%_at_50%_0%,rgba(99,102,241,0.15)_0%,rgba(255,255,255,0)_100%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest animate-fade-in-left delay-100">
              <Sparkles size={12} className="animate-pulse" /> New Season Arrivals
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] animate-fade-in-left delay-200">
              Next-Gen Tech <br />
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                For Your Smart Living
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed animate-fade-in-left delay-300">
              Explore our curated selection of premium electronics, smart home gadgets, and lifestyle devices. We blend cutting-edge technology with minimalist design.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 animate-fade-in-left delay-400">
              <button
                className="px-8 py-4 bg-secondary text-whitecustom rounded-xl font-bold hover:bg-opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer text-sm"
                onClick={handleShopRedirect}
              >
                Shop Collection <ArrowRight size={16} />
              </button>
              <button
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 active:scale-95 transition-all text-sm cursor-pointer"
                onClick={handleShopRedirect}
              >
                Explore Deals
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center animate-fade-in-right delay-300">
            <div className="relative group p-4 bg-white/5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm max-w-md w-full overflow-hidden flex items-center justify-center min-h-[350px]">
              <Tech3DCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BADGES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-6 bg-whitecustom rounded-2xl border border-light/60 shadow-xs hover:shadow-md transition-all duration-300 text-left scroll-reveal delay-100">
            <div className="p-3 bg-indigo-50 text-secondary rounded-xl">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Fast Delivery</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Free secure shipping on all orders over $100.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-whitecustom rounded-2xl border border-light/60 shadow-xs hover:shadow-md transition-all duration-300 text-left scroll-reveal delay-200">
            <div className="p-3 bg-indigo-50 text-secondary rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Secure Payment</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Shop safely using industry-standard encrypted channels.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-whitecustom rounded-2xl border border-light/60 shadow-xs hover:shadow-md transition-all duration-300 text-left scroll-reveal delay-300">
            <div className="p-3 bg-indigo-50 text-secondary rounded-xl">
              <RotateCcw size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Easy Return Policy</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Hassle-free 30 days window with customer support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE CATEGORIES GRID */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center md:text-left mb-10 scroll-reveal delay-100">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
          <p className="text-sm text-slate-500 mt-1">Explore curated electronics built to elevate your daily life.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={handleShopRedirect}
            className="group cursor-pointer p-6 rounded-2xl bg-whitecustom border border-light hover:border-secondary/30 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left scroll-reveal delay-200"
          >
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Smartphone size={22} />
            </div>
            <div className="mt-8">
              <h3 className="font-bold text-slate-900 group-hover:text-secondary transition-colors">Smart Devices</h3>
              <p className="text-xs text-slate-500 mt-1">Phones, Tablets & Wearables</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary mt-4 group-hover:translate-x-1 transition-transform">
                Browse <ArrowRight size={12} />
              </span>
            </div>
          </div>

          <div
            onClick={handleShopRedirect}
            className="group cursor-pointer p-6 rounded-2xl bg-whitecustom border border-light hover:border-secondary/30 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left scroll-reveal delay-300"
          >
            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <Laptop size={22} />
            </div>
            <div className="mt-8">
              <h3 className="font-bold text-slate-900 group-hover:text-secondary transition-colors">Laptops & PCs</h3>
              <p className="text-xs text-slate-500 mt-1">Computers, Screens & Parts</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary mt-4 group-hover:translate-x-1 transition-transform">
                Browse <ArrowRight size={12} />
              </span>
            </div>
          </div>

          <div
            onClick={handleShopRedirect}
            className="group cursor-pointer p-6 rounded-2xl bg-whitecustom border border-light hover:border-secondary/30 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left scroll-reveal delay-400"
          >
            <div className="p-3.5 bg-cyan-50 text-cyan-600 rounded-xl w-fit group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300">
              <Tv size={22} />
            </div>
            <div className="mt-8">
              <h3 className="font-bold text-slate-900 group-hover:text-secondary transition-colors">Smart Living</h3>
              <p className="text-xs text-slate-500 mt-1">TVs, Smart Home & Appliances</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary mt-4 group-hover:translate-x-1 transition-transform">
                Browse <ArrowRight size={12} />
              </span>
            </div>
          </div>

          <div
            onClick={handleShopRedirect}
            className="group cursor-pointer p-6 rounded-2xl bg-whitecustom border border-light hover:border-secondary/30 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left scroll-reveal delay-500"
          >
            <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl w-fit group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
              <Headphones size={22} />
            </div>
            <div className="mt-8">
              <h3 className="font-bold text-slate-900 group-hover:text-secondary transition-colors">Premium Audio</h3>
              <p className="text-xs text-slate-500 mt-1">Headphones, Speakers & Accessories</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary mt-4 group-hover:translate-x-1 transition-transform">
                Browse <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center md:text-left mb-10 flex flex-col md:flex-row justify-between items-baseline gap-4 scroll-reveal delay-100">
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Featured Products</h2>
            <p className="text-sm text-slate-500 mt-1">Check out our highly-recommended premium electronics of the week.</p>
          </div>
          <button
            onClick={handleShopRedirect}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-indigo-700 transition-colors group"
          >
            Explore Full Catalog <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            <div className="animate-pulse">Loading amazing deals...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => {
                const productId = product._id || product.id;

                return (
                  <div
                    key={productId}
                    onClick={() => handleProductRedirect(productId)}
                    className="flex flex-col bg-whitecustom border border-light rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full cursor-pointer text-left scroll-reveal"
                    style={{ transitionDelay: `${(index % 4) * 100}ms` }}
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-slate-50 flex items-center justify-center p-4 border-b border-light/50">
                      <img
                        src={
                          product.photos && product.photos[0]
                            ? product.photos[0].startsWith("http")
                              ? product.photos[0]
                              : `${API_BASE_URL}${product.photos[0]}`
                            : "https://via.placeholder.com/400"
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400";
                        }}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {product.discountPrice > 0 && product.discountPrice < product.price && (
                          <span className="text-[10px] font-black text-rose-600 uppercase bg-rose-50 px-2 py-0.5 rounded shadow-3xs border border-rose-100">
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 flex items-center text-amber-500 text-xs font-bold gap-0.5 bg-whitecustom/90 px-1.5 py-0.5 rounded shadow-3xs border border-light/45">
                        ★ <span className="text-slate-800">4.8</span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-indigo-50/70 px-2 py-0.5 rounded">
                          {product.category && typeof product.category === "object"
                            ? product.category.name
                            : product.category || "General"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-850 line-clamp-1 mb-2 group-hover:text-secondary transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 min-h-[32px]">
                        {product.description || "Premium smart electronics designed for high performance and durability."}
                      </p>

                      <div className="mt-auto flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-black text-slate-900">
                          ₹{product.discountPrice > 0 ? product.discountPrice : product.price}
                        </span>
                        {product.discountPrice > 0 && product.discountPrice < product.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-full bg-slate-900 text-whitecustom py-2.5 rounded-xl font-bold hover:bg-secondary active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 text-xs shadow-xs"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 bg-whitecustom rounded-2xl border border-light/60">
                <p className="text-slate-500 text-lg font-medium">No featured items at the moment.</p>
                <p className="text-sm text-slate-400 mt-1">Check back later or explore our full collection.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. NEWSLETTER SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12 scroll-reveal delay-200">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 to-slate-900 text-whitecustom rounded-3xl p-8 sm:p-12 shadow-xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="absolute top-0 left-0 -z-10 h-full w-full [background:radial-gradient(100%_100%_at_0%_0%,rgba(60,110,113,0.1)_0%,rgba(255,255,255,0)_100%)] pointer-events-none" />
          <div className="text-center md:text-left space-y-3 max-w-md">
            <span className="text-xs font-black text-accent uppercase tracking-widest">Newsletter Subscription</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Stay ahead of the curve</h3>
            <p className="text-sm text-slate-350 leading-relaxed">
              Get notified immediately about new season tech arrivals, exclusive brand deals, and flash sales.
            </p>
          </div>
          <div className="w-full max-w-md">
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 text-sm text-whitecustom bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-secondary transition-colors placeholder-slate-400"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-secondary text-whitecustom font-bold text-sm rounded-xl hover:bg-opacity-90 active:scale-95 transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer"
              >
                <Mail size={16} /> Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
