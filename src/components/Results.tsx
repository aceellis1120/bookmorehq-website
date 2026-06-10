"use client";

import { Eye, Gauge, Layers3, PhoneIncoming } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const outcomes = [
  {
    title: "Fewer missed opportunities",
    desc: "Calls are answered, lead details are captured, and follow-up does not depend on someone remembering to do it later.",
    icon: PhoneIncoming,
  },
  {
    title: "A faster sales response",
    desc: "New opportunities reach the right person with the context needed to call back, qualify, quote, or schedule.",
    icon: Gauge,
  },
  {
    title: "One visible pipeline",
    desc: "See prospects, clients, services, payments, commissions, and account activity without stitching together separate reports.",
    icon: Eye,
  },
  {
    title: "A system that can expand",
    desc: "Add new channels and automation as capacity grows instead of replacing the original setup every few months.",
    icon: Layers3,
  },
];

export default function Results() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="results" className="bg-[#0b0f14] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase text-[#60a5fa]">
            What changes
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Better control over how growth actually happens
          </h2>
          <p className="mt-5 text-base leading-7 text-[#9cacc1]">
            BookMoreHQ does not sell a mystery campaign. We build operating
            systems your team can use, supervise, and improve.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-[#273449] bg-[#273449] sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="min-h-64 bg-[#101722] p-6"
              >
                <Icon size={22} className="text-[#60a5fa]" />
                <h3 className="mt-8 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#9cacc1]">{item.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
