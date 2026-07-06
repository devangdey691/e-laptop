import React, { useState } from "react";
import axios from "../../utils/axiosconfig";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumb";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/customer", formData);

      if (response.status === 200 || response.status === 201 || response.data.success) {
        toast.success("Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(response.data?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message ||
        "Unable to connect to the server. Please try again later."
      );
    }
  };

  return (
    <div className="relative bg-whitecustom text-slate-800 font-sans selection:bg-secondary selection:text-whitecustom overflow-hidden min-h-screen text-left">
      {/* Background radial gradient */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 [background:radial-gradient(100%_60%_at_50%_0%,rgba(79,70,229,0.05)_0%,rgba(255,255,255,0)_100%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-6 pb-16 sm:pb-24">
        <Breadcrumb items={[{ label: "Contact Us" }]} />

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-20 mt-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3.5 py-1 text-xs font-bold text-secondary border border-secondary/10 uppercase tracking-widest">
            <MessageSquare size={12} className="animate-pulse" /> Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mt-6 tracking-tight leading-[1.15]">
            We'd Love to <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Hear From You.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 mt-6 leading-relaxed">
            Have a question about a premium gadget, an order delivery, or just
            want to leave feedback? Drop us a message, and our customer support
            squad will get back to you within 24 hours.
          </p>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6 border-t border-light/60">
          {/* Info Cards Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Email Card */}
            <div className="group p-6 rounded-2xl bg-slate-50 border border-light hover:border-secondary/35 hover:bg-whitecustom hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex gap-4 scroll-reveal delay-100">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-whitecustom transition-colors duration-300 shadow-sm">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Email Our Team
                </h3>
                <p className="text-xs text-slate-500 mb-2.5 leading-relaxed">
                  For general support, sales queries, or corporate partnership.
                </p>
                <a
                  href="mailto:support@mystore.com"
                  className="text-secondary font-bold hover:text-accent transition-colors text-sm underline decoration-secondary/20 hover:decoration-accent/40 underline-offset-4"
                >
                  support@mystore.com
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group p-6 rounded-2xl bg-slate-50 border border-light hover:border-secondary/35 hover:bg-whitecustom hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex gap-4 scroll-reveal delay-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-whitecustom transition-colors duration-300 shadow-sm">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Call Support
                </h3>
                <p className="text-xs text-slate-500 mb-2.5 leading-relaxed">
                  Available 24/7 for critical purchase or payment tracking issues.
                </p>
                <a
                  href="tel:+917896541230"
                  className="text-secondary font-bold hover:text-accent transition-colors text-sm underline decoration-secondary/20 hover:decoration-accent/40 underline-offset-4"
                >
                  +(91) 7896541230
                </a>
              </div>
            </div>

            {/* HQ Office Card */}
            <div className="group p-6 rounded-2xl bg-slate-50 border border-light hover:border-secondary/35 hover:bg-whitecustom hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex gap-4 scroll-reveal delay-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-whitecustom transition-colors duration-300 shadow-sm">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  HQ Office
                </h3>
                <p className="text-xs text-slate-500 mb-1 leading-relaxed">
                  MyStore Electronics Logistics Inc.
                </p>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                  1024 Tech Innovation Way, Suite 400
                  <br />
                  Silicon Valley, CA 94016
                </p>
              </div>
            </div>

            {/* Live Assistance Box */}
            <div className="relative overflow-hidden p-6 bg-slate-900 text-whitecustom rounded-2xl shadow-lg border border-white/5 flex flex-col justify-between scroll-reveal delay-400">
              <div className="absolute -right-6 -bottom-6 text-whitecustom/5 pointer-events-none select-none">
                <MessageSquare size={140} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-accent font-black text-xs uppercase tracking-widest mb-3">
                  <Clock size={14} /> Live Assistance Hours
                </div>
                <h4 className="text-lg font-extrabold mb-2 text-whitecustom">
                  Customer First Support
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our digital response channels operate around the clock. Ticket
                  review timelines take less than 12 hours on standard weekdays.
                </p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 scroll-reveal delay-200">
            <div className="bg-whitecustom border border-light rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-200/50">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                Send a Message
              </h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Fill out the quick form details below to securely reach our inbox.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-slate-50/50 border border-light hover:border-slate-300 focus:border-secondary focus:bg-whitecustom rounded-xl outline-none transition-all text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-secondary/10 text-sm"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-slate-50/50 border border-light hover:border-slate-300 focus:border-secondary focus:bg-whitecustom rounded-xl outline-none transition-all text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-secondary/10 text-sm"
                      placeholder="johndoe@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">
                    Subject Matter
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-slate-50/50 border border-light hover:border-slate-300 focus:border-secondary focus:bg-whitecustom rounded-xl outline-none transition-all text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-secondary/10 text-sm"
                    placeholder="Order Status / Product Inquiry / Help"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">
                    Detailed Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-slate-50/50 border border-light hover:border-slate-300 focus:border-secondary focus:bg-whitecustom rounded-xl outline-none transition-all text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-secondary/10 text-sm min-h-[140px] resize-y"
                    placeholder="Tell us exactly how we can support you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-whitecustom rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:bg-secondary hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-xs uppercase tracking-widest"
                >
                  <Send size={14} /> Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
