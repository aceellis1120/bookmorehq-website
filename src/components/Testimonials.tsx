"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    quote:
      "BookMore HQ completely transformed our pipeline. We went from 3 meetings a month to 25.",
    name: "Michael R.",
    company: "Founder, GrowthStack",
  },
  {
    quote:
      "The system just works. We barely touch it and appointments keep flowing in.",
    name: "Jessica L.",
    company: "CEO, BrightPath Consulting",
  },
  {
    quote:
      "Best investment we have made for our business growth. Period.",
    name: "Daniel K.",
    company: "Managing Director, Apex Solutions",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-[#0F172A] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-6"
            >
              {/* Quote icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                className="mb-4"
              >
                <path
                  d="M6 18h6l-2 8h4l2-8V8H6v10zm14 0h6l-2 8h4l2-8V8H20v10z"
                  fill="#3B82F6"
                  opacity="0.4"
                />
              </svg>
              <p className="text-[#94A3B8] leading-relaxed mb-6 text-sm">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="text-white font-semibold text-sm">
                  {t.name}
                </div>
                <div className="text-[#94A3B8] text-xs">{t.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
