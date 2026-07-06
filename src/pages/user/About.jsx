import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { Award, ShieldCheck, Truck, Compass, Flame } from "lucide-react";

const About = () => {
  const leadership = [
    {
      name: "Aarav Sharma",
      role: "CEO & Co-Founder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      name: "Neha Patel",
      role: "Chief Technology Officer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      name: "Kabir Mehta",
      role: "VP of Operations",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    },
  ];

  return (
    <div className="relative bg-whitecustom text-slate-800 font-sans selection:bg-secondary selection:text-whitecustom overflow-hidden min-h-screen text-left">
      {/* Background radial gradient */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 [background:radial-gradient(100%_60%_at_50%_0%,rgba(79,70,229,0.05)_0%,rgba(255,255,255,0)_100%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-6 pb-16 sm:pb-24">
        <Breadcrumb items={[{ label: "About Us" }]} />

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-20 mt-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3.5 py-1 text-xs font-bold text-secondary border border-secondary/10 uppercase tracking-widest">
            <Flame size={12} className="animate-pulse" /> Driven by Quality
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mt-6 tracking-tight leading-[1.15]">
            Born to Innovate. <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Built for Your Connected Life.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 mt-6 leading-relaxed">
            Technology is the heart of smart connected living. At MyStore, we
            bridge the gap between premium, cutting-edge electronics and
            everyday accessibility, bringing an entirely elevated
            experience to your household.
          </p>
        </section>

        {/* Differentiators Section */}
        <section className="py-16 border-t border-light/60">
          <div className="text-center md:text-left mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Why Choose MyStore?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Our commitment to excellence sets us apart in the global tech retail landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-6 rounded-2xl bg-slate-50 border border-light hover:border-secondary/35 hover:bg-whitecustom hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 scroll-reveal delay-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-secondary flex items-center justify-center font-bold mb-4 group-hover:bg-secondary group-hover:text-whitecustom transition-colors duration-300">
                <Award size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Premium Standards
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every gadget and appliance in our inventory undergoes extensive testing to guarantee elite craftsmanship and durability.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-slate-50 border border-light hover:border-secondary/35 hover:bg-whitecustom hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 scroll-reveal delay-200">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-secondary flex items-center justify-center font-bold mb-4 group-hover:bg-secondary group-hover:text-whitecustom transition-colors duration-300">
                <Truck size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Reliable Delivery
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Partnered with leading logistics networks to ensure fast, secure, and fully-tracked shipping directly to your doorstep.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-slate-50 border border-light hover:border-secondary/35 hover:bg-whitecustom hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 scroll-reveal delay-300">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-secondary flex items-center justify-center font-bold mb-4 group-hover:bg-secondary group-hover:text-whitecustom transition-colors duration-300">
                <Compass size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Sustainable Innovation
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We prioritize eco-friendly, energy-efficient brands that enhance electronic lifecycles while reducing footprint.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-slate-50 border border-light hover:border-secondary/35 hover:bg-whitecustom hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 scroll-reveal delay-400">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-secondary flex items-center justify-center font-bold mb-4 group-hover:bg-secondary group-hover:text-whitecustom transition-colors duration-300">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Payment Encryption
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                State-of-the-art secure payment channels ensure that your transactional information is safe and private.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-16 border-t border-light/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden p-8 sm:p-10 bg-slate-900 text-whitecustom rounded-3xl shadow-lg border border-white/5 flex flex-col justify-between scroll-reveal delay-100">
              <div className="absolute -right-6 -bottom-6 text-9xl text-indigo-500 font-serif select-none pointer-events-none opacity-10">
                “
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-accent">
                  The North Star
                </span>
                <h3 className="text-2xl font-extrabold text-whitecustom mt-2 mb-4">
                  Our Vision
                </h3>
                <p className="text-sm text-slate-350 leading-relaxed">
                  To establish a premier, sustainable, and next-generation electronic marketplace, empower customers globally with innovative tech solutions, and elevate daily smart living.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden p-8 sm:p-10 bg-slate-900 text-whitecustom rounded-3xl shadow-lg border border-white/5 flex flex-col justify-between scroll-reveal delay-200">
              <div className="absolute -right-6 -bottom-6 text-9xl text-indigo-500 font-serif select-none pointer-events-none opacity-10">
                ”
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-accent">
                  Our Purpose
                </span>
                <h3 className="text-2xl font-extrabold text-whitecustom mt-2 mb-4">
                  Our Mission
                </h3>
                <p className="text-sm text-slate-350 leading-relaxed">
                  To create unmatched value for our tech community through constant research, prompt deliveries, transparent pricing, and rigorous standards of electronic safety and longevity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 border-t border-light/60">
          <div className="text-center md:text-left mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Our Core Values
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              The fundamental pillars on which we build trust and long-lasting customer relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:h-4 before:w-1.5 before:rounded-full before:bg-secondary scroll-reveal delay-100">
              <h4 className="text-base font-bold text-slate-900">Customer Centricity</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
                We put our customer community at the core of all operations. We proactively resolve issues, anticipate user needs, and offer 24/7 client care.
              </p>
            </div>

            <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:h-4 before:w-1.5 before:rounded-full before:bg-secondary scroll-reveal delay-200">
              <h4 className="text-base font-bold text-slate-900">Unceasing Innovation</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
                We do not simply follow technological changes; we curate and present the latest, most functional electronic gadgets for your smart connected home.
              </p>
            </div>

            <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:h-4 before:w-1.5 before:rounded-full before:bg-secondary scroll-reveal delay-300">
              <h4 className="text-base font-bold text-slate-900">Absolute Integrity</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
                We commit to complete transparency. What you browse on your screen is exactly the level of top-tier quality you receive in your parcel.
              </p>
            </div>
          </div>
        </section>

        {/* Meet Our Team Section */}
        <section className="py-16 border-t border-light/60">
          <div className="text-center md:text-left mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Meet Our Leadership
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              The tech enthusiasts and operations professionals steering the vision of MyStore.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((member, idx) => (
              <div key={idx} className="bg-slate-50 border border-light p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:border-secondary/35 transition-all duration-300 scroll-reveal" style={{ transitionDelay: `${idx * 100}ms` }}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover border border-light shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{member.name}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
