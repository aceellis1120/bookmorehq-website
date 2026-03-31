"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const outcomes = [
  {
    title: "Predictable Pipeline",
    desc: "Stop guessing where your next client is coming from. Our systems create consistent deal flow month after month.",
  },
  {
    title: "Consistent Lead Flow",
    desc: "Wake up to interested prospects in your inbox every morning. Automated outreach that never sleeps.",
  },
  {
    title: "Scalable Growth",
    desc: "Built to scale from 5 to 500 clients. The infrastructure grows with you.",
  },
];

export default function Results() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="results" className="bg-[#0B0F14] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            The Outcome
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {outcomes.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center sm:text-left"
            >
              <h3 className="text-xl font-bold text-white mb-1">
                {item.title}
              </h3>
              <div className="w-12 h-0.5 bg-[#3B82F6] mb-4 mx-auto sm:mx-0" />
              <p className="text-[#94A3B8] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
