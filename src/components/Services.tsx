"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    title: "Cold Email Infrastructure",
    desc: "Custom domains, authenticated accounts, and deliverability optimization that ensures your emails hit the inbox.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="10" width="32" height="22" rx="3" stroke="#3B82F6" strokeWidth="2" />
        <path d="M4 13l16 10 16-10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Lead Generation Systems",
    desc: "AI-powered prospect sourcing that finds your ideal customers across multiple data sources.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke="#3B82F6" strokeWidth="2" />
        <circle cx="20" cy="20" r="8" stroke="#3B82F6" strokeWidth="2" />
        <circle cx="20" cy="20" r="2" fill="#3B82F6" />
        <path d="M20 6v4M20 30v4M6 20h4M30 20h4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Campaign Management",
    desc: "Multi-step sequences with smart follow-ups, A/B testing, and real-time optimization.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M10 30l8-12 6 4 8-14" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 8h4v4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "CRM & Automation",
    desc: "Automated reply handling, appointment booking, and pipeline management — all hands-free.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke="#3B82F6" strokeWidth="2" />
        <path d="M20 12v8l5 5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 6l-2-2M26 6l2-2" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="bg-[#0F172A] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            What We Build For You
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl border border-[#1F2937] bg-[#0B0F14] p-6 transition-all duration-300 hover:border-[#3B82F6] hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
