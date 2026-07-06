import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { clearCart } from "../../redux/cartSlicer";
import axios, { API_BASE_URL } from "../../utils/axiosconfig";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const totalQuantity = useSelector((state) => state.cart.totalQuantity || 0);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = async () => {
    try {
      const res = await axios.get("/users/logout");

      if (res.data.success) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        dispatch(clearCart());
        toast.success("Logged out successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/product-list" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const activeClass = (path) =>
    location.pathname === path
      ? "text-secondary border-b-2 border-secondary font-bold"
      : "text-primary hover:text-secondary transition-colors font-medium";

  return (
    <nav className="bg-whitecustom border-b border-light/40 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-primary flex items-center">
                🛒 E-<span className="text-secondary">Commerce</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 px-1 ${activeClass(link.path)}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Link */}
            <Link to="/cart" className="relative p-2 text-primary hover:text-secondary transition-colors">
              <ShoppingCart size={24} />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-whitecustom bg-secondary rounded-full transform translate-x-1/2 -translate-y-1/2 shadow-sm">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-primary hover:text-secondary transition-all font-semibold"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20">
                    {user?.profilePhoto ? (
                      <img src={`${API_BASE_URL}${user.profilePhoto}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name || "Profile"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-primary/60 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl border border-light text-primary font-bold hover:border-secondary hover:text-secondary transition-all text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl bg-primary text-whitecustom font-bold hover:bg-accent transition-all text-sm shadow-md shadow-primary/10"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="relative p-2 text-primary mr-4">
              <ShoppingCart size={22} />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-3xs font-bold leading-none text-whitecustom bg-secondary rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-primary hover:bg-light/25 transition-colors focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-whitecustom border-t border-light/20 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block py-3 px-4 rounded-xl font-bold ${
                location.pathname === link.path
                  ? "bg-secondary/10 text-secondary"
                  : "text-primary hover:bg-light/10"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-light/30 my-4" />
          {isLoggedIn ? (
            <div className="space-y-3">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-primary hover:bg-light/10 font-bold"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20">
                  {user?.profilePhoto ? (
                    <img src={`${API_BASE_URL}${user.profilePhoto}`} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <span>{user?.name || "Profile"}</span>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-red-500 hover:bg-red-50 font-bold"
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center rounded-xl border border-light text-primary font-bold hover:border-secondary transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center rounded-xl bg-primary text-whitecustom font-bold hover:bg-accent transition-all shadow-md shadow-primary/10"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
