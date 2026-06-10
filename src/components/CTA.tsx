"use client";

import { ArrowRight, PhoneCall } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="border-t border-[#273449] bg-[#101722] py-24">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
        className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_auto] lg:items-end"
      >
        <div>
          <span className="grid h-11 w-11 place-items-center rounded-md bg-[#172554] text-[#60a5fa]">
            <PhoneCall size={21} />
          </span>
          <h2 className="mt-6 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            Find the part of your growth system that is leaking revenue.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#9cacc1]">
            We will review how your business generates leads, answers calls,
            follows up, and tracks the pipeline, then recommend the best system
            to launch first.
          </p>
        </div>
        <a
          href="https://cal.com/austin-ellis-rvyav5"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#2563eb] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
        >
          Book your growth call
          <ArrowRight size={17} />
        </a>
      </motion.div>
    </section>
  );
}
