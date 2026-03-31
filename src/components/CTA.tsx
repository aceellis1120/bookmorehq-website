"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="contact"
      className="relative py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0B0F14 0%, #0F172A 100%)",
      }}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Ready to <span className="text-[#3B82F6]">Scale</span> Your Business?
        </h2>
        <p className="mt-6 text-lg text-[#94A3B8]">
          Let&apos;s build your outbound system.
        </p>
        <div className="mt-10">
          <a
            href="https://cal.com/austin-ellis-rvyav5"
            className="inline-block px-10 py-4 bg-[#3B82F6] text-white text-lg font-semibold rounded-lg hover:bg-[#2563EB] transition-all duration-200 shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_80px_rgba(59,130,246,0.15)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6),0_0_100px_rgba(59,130,246,0.2)] hover:scale-[1.03]"
          >
            Book Your Call Now
          </a>
        </div>
      </motion.div>
    </section>
  );
}
