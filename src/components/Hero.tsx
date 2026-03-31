"use client";

import { motion } from "framer-motion";
import CalendarMockup from "./CalendarMockup";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              We Build Outbound Systems That Generate Clients{" "}
              <span className="text-[#3B82F6]">On Demand</span>
            </h1>
            <p className="mt-6 text-lg text-[#94A3B8] max-w-lg leading-relaxed">
              Infrastructure-driven outbound designed to create consistent,
              predictable lead flow.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://cal.com/austin-ellis-rvyav5"
                className="px-7 py-3.5 bg-[#3B82F6] text-white font-semibold rounded-lg hover:bg-[#2563EB] transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-[1.02]"
              >
                Book a Call
              </a>
              <a
                href="#how-it-works"
                className="px-7 py-3.5 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-[1.02]"
              >
                See How It Works
              </a>
            </div>
          </motion.div>

          {/* Right — Calendar Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden md:block"
          >
            <CalendarMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
