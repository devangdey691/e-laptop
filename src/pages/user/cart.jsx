import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Tag,
  MapPin,
  Phone,
  CreditCard,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../../redux/cartSlicer";
import toast from "react-hot-toast";
import axios, { API_BASE_URL } from "../../utils/axiosconfig";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [showCheckout, setShowCheckout] = useState(
    location.state?.showCheckout || false
  );
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Get current authenticated user status safely
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (location.state?.showCheckout) {
      setShowCheckout(true);
      // Clean up the location state so refreshing or returning doesn't force checkout mode
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // 🛠️ HANDLERS (Relying fully on Redux middleware for auto-syncing cart changes to MongoDB)
  const handleIncrease = (itemId) => {
    dispatch(increaseQuantity(itemId));
  };

  const handleDecrease = (itemId, currentQuantity) => {
    if (currentQuantity <= 1) {
      handleRemove(itemId);
      return;
    }
    dispatch(decreaseQuantity(itemId));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const totalMRP = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalDiscountedPrice = cartItems.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0,
  );
  const totalSavings = totalMRP - totalDiscountedPrice;

  const handlePurchase = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!address || !phone) {
      toast.error("Please fill in all details!");
      return;
    }

    try {
      setIsSubmitting(true);

      const formattedItems = cartItems.map((item) => ({
        name: item.name || item.title,
        quantity: item.quantity || 1,
      }));

      const res = await axios.post(
        "/orders/create",
        {
          items: formattedItems,
          total: totalDiscountedPrice,
          address,
          phone,
          paymentMethod,
          status: "Processing",
        }
      );

      if (res.data.success) {
        toast.success("Product purchased successfully!");

        dispatch(clearCart());

        setShowCheckout(false);
        navigate("/profile");
      }
    } catch (error) {
      console.error(
        "Order completion failed:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message ||
        "Something went wrong while placing your order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-light/10 min-h-screen font-sans text-primary">
      <Breadcrumb
        items={[
          { label: "Cart", link: "/cart", onClick: () => setShowCheckout(false) },
          ...(showCheckout ? [{ label: "Checkout" }] : []),
        ]}
      />
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-secondary/10 p-2 rounded-lg">
          <ShoppingBag className="text-secondary" size={24} />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
          {showCheckout ? "Checkout Details" : "Your Basket"}
        </h1>
        {!showCheckout && (
          <span className="text-primary/40 font-medium">
            ({cartItems.length} items)
          </span>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-whitecustom rounded-3xl shadow-sm border border-light/40">
          <p className="text-primary/50 text-lg">
            Your cart feels a bit light...
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-8 py-3 bg-primary text-whitecustom rounded-full font-bold hover:bg-accent transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : !showCheckout ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const productImg =
                item.photos && item.photos.length > 0
                  ? item.photos[0].startsWith("http")
                    ? item.photos[0]
                    : `${API_BASE_URL}${item.photos[0].startsWith("/") ? "" : "/"}${item.photos[0].replace(/\\/g, "/")}`
                  : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";

              return (
                <div
                  key={item._id}
                  className="bg-whitecustom p-4 md:p-6 rounded-2xl shadow-sm border border-light/40 flex flex-col md:flex-row items-center gap-6 relative"
                >
                  <div className="w-full md:w-32 h-32 flex-shrink-0">
                    <img
                      src={productImg}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl border border-light/10"
                    />
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    <h2 className="font-bold text-primary text-lg leading-tight mb-1">
                      {item.name || item.title}
                    </h2>

                    <p className="text-sm text-primary/50 mb-3">
                      {item.category && typeof item.category === "object"
                        ? item.category.name
                        : item.category || "General"}
                    </p>

                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <span className="text-xl font-black text-primary">
                        ₹{item.discountPrice}
                      </span>
                      {item.price > item.discountPrice && (
                        <>
                          <span className="text-sm text-primary/40 line-through">
                            ₹{item.price}
                          </span>
                          <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                            {Math.round(
                              ((item.price - item.discountPrice) / item.price) *
                              100,
                            )}
                            % OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-4">
                    <div className="flex items-center bg-light/30 rounded-full p-1">
                      <button
                        onClick={() => handleDecrease(item._id, item.quantity)}
                        className="p-2 hover:bg-whitecustom text-primary rounded-full shadow-sm transition-all active:scale-90"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-bold text-primary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(item._id)}
                        className="p-2 hover:bg-whitecustom text-primary rounded-full shadow-sm transition-all active:scale-90"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-primary/40 hover:text-red-500 flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-whitecustom p-6 rounded-3xl shadow-xl border border-light/40 sticky top-24">
              <h2 className="text-xl font-bold text-primary mb-6">
                Price Details
              </h2>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between text-primary/60">
                  <span>Price ({cartItems.length} items)</span>
                  <span>₹{totalMRP}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Discount</span>
                  <span>- ₹{totalSavings}</span>
                </div>
                <div className="flex justify-between text-primary/60">
                  <span>Delivery Charges</span>
                  <span className="text-secondary font-bold">FREE</span>
                </div>
                <div className="h-px bg-light/30 my-2" />
                <div className="flex justify-between text-lg font-black text-primary">
                  <span>Total Amount</span>
                  <span>₹{totalDiscountedPrice}</span>
                </div>
              </div>
              <div className="mt-6 bg-secondary/10 border border-secondary/20 p-3 rounded-2xl flex items-center gap-3">
                <div className="bg-secondary p-1.5 rounded-full">
                  <Tag className="text-whitecustom" size={14} />
                </div>
                <p className="text-secondary text-xs font-bold">
                  You are saving ₹{totalSavings} on this order!
                </p>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full mt-6 bg-blue-900 text-whitecustom py-4 rounded-2xl font-bold text-lg hover:bg-blue-950 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-blue-900/25"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowCheckout(false)}
            className="flex items-center gap-2 text-primary/60 hover:text-primary mb-6 transition-colors font-semibold"
          >
            <ArrowLeft size={20} /> Back to Basket
          </button>

          <div className="bg-whitecustom p-6 md:p-10 rounded-3xl shadow-xl border border-light/40">
            <form onSubmit={handlePurchase} className="space-y-6">
              {/* Form Input fields */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-primary/80 mb-2">
                  <MapPin size={18} className="text-secondary" /> Shipping
                  Address
                </label>
                <textarea
                  required
                  disabled={isSubmitting}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-4 bg-light/20 border border-light/60 rounded-2xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all min-h-[100px] placeholder-primary/30 text-primary disabled:opacity-50"
                  placeholder="Enter your full address..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-primary/80 mb-2">
                  <Phone size={18} className="text-secondary" /> Phone Number
                </label>
                <input
                  type="tel"
                  required
                  disabled={isSubmitting}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-4 bg-light/20 border border-light/60 rounded-2xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-primary placeholder-primary/30 disabled:opacity-50"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-primary/80 mb-2">
                  <CreditCard size={18} className="text-secondary" /> Payment
                  Method
                </label>
                <select
                  disabled={isSubmitting}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-4 bg-light/20 border border-light/60 rounded-2xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none cursor-pointer text-primary disabled:opacity-50"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="UPI">UPI / Google Pay</option>
                  <option value="Card">Debit / Credit Card</option>
                </select>
              </div>

              <div className="bg-light/20 p-4 rounded-2xl border border-light/40">
                <div className="flex justify-between items-center text-primary">
                  <span className="font-bold">Amount to Pay:</span>
                  <span className="text-xl font-black">
                    ₹{totalDiscountedPrice}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-900 text-whitecustom py-4 rounded-2xl font-bold text-lg hover:bg-blue-950 transition-all active:scale-95 shadow-lg shadow-blue-900/25 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Processing
                    Order...
                  </>
                ) : (
                  "Complete Purchase"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
