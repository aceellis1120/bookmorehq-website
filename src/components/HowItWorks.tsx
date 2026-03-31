"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    num: 1,
    title: "We Build Your Infrastructure",
    desc: "Custom domains, email accounts, and deliverability systems — all set up for maximum inbox placement.",
  },
  {
    num: 2,
    title: "We Launch Campaigns",
    desc: "Targeted outreach sequences designed to reach your ideal customers at the right time.",
  },
  {
    num: 3,
    title: "Leads Start Coming In",
    desc: "Interested prospects reply, and our AI system qualifies and routes them automatically.",
  },
  {
    num: 4,
    title: "You Close Deals",
    desc: "Show up to pre-qualified appointments and focus on what you do best — closing.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="bg-[#0B0F14] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            How It Works
          </h2>
          <p className="mt-4 text-[#94A3B8] text-lg">
            A proven system, not a guessing game.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group rounded-xl border border-[#1F2937] bg-[#0F172A] p-6 transition-all duration-300 hover:border-[#3B82F6] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
            >
              <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold text-sm mb-5">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
