import React from "react";

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
  };

  return (
    <footer className="bg-primary text-light font-sans pt-16 pb-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-6">
          <div className="max-w-md">
            <h2 className="text-whitecustom text-2xl font-extrabold tracking-wide mb-4">
              MyStore
            </h2>
            <p className="text-sm text-light/80 leading-relaxed">
              Bringing next-generation consumer electronics, premium gadgets,
              and quality home essentials right to your doorstep.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            <h4 className="text-whitecustom text-sm font-bold uppercase tracking-wider mb-3">
              Stay Updated
            </h4>
            <p className="text-sm text-light/80 mb-4">
              Subscribe to get notified about new season arrivals and exclusive
              tech deals.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-2 text-sm text-whitecustom bg-accent/30 border border-light/20 rounded-md focus:outline-none focus:border-secondary transition-colors placeholder-light/50"
              />
              <button
                type="submit"
                className="bg-secondary text-whitecustom font-semibold text-sm px-5 py-2 rounded-md hover:bg-accent transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="border-t border-light/10 my-8" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-whitecustom text-sm font-bold uppercase tracking-wider mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/products?cat=mobility"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  Mobility & Smart Devices
                </a>
              </li>
              <li>
                <a
                  href="/products?cat=home"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  Home Electronics
                </a>
              </li>
              <li>
                <a
                  href="/products?cat=accessories"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  Premium Accessories
                </a>
              </li>
              <li>
                <a
                  href="/products?cat=new"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-whitecustom text-sm font-bold uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/about"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/sustainability"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  Sustainability Initiatives
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  Contact & Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-whitecustom text-sm font-bold uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/shipping"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  Shipping & Fast Delivery
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="/track-order"
                  className="text-light hover:text-whitecustom transition-colors"
                >
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-whitecustom text-sm font-bold uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <p className="text-sm text-light mb-3">
              <strong className="text-whitecustom">Email:</strong>{" "}
              support@mystore.com
            </p>
            <p className="text-sm text-light mb-3">
              <strong className="text-whitecustom">Support:</strong> Available
              24/7
            </p>
            <p className="text-sm text-light">
              <strong className="text-whitecustom">Security:</strong>{" "}
              Industry-Standard Encrypted Payments
            </p>
          </div>
        </div>

        <hr className="border-t border-light/10 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <p className="text-xs text-light/60">
            &copy; {new Date().getFullYear()} MyStore. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-light/60">
            <a href="/privacy" className="hover:text-light transition-colors">
              Privacy Policy
            </a>
            <span className="text-light/20">|</span>
            <a href="/terms" className="hover:text-light transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
