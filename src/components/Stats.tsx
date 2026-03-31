"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItemProps {
  end: number;
  suffix: string;
  label: string;
  inView: boolean;
}

function StatItem({ end, suffix, label, inView }: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, end]);

  return (
    <div className="text-center px-8 py-6">
      <div className="text-4xl sm:text-5xl font-bold text-white">
        {suffix === "/7" ? "24/7" : suffix === " Min" ? "<5 Min" : count.toLocaleString()}
        {suffix !== "/7" && suffix !== " Min" && suffix}
      </div>
      <div className="mt-2 text-sm text-[#94A3B8]">{label}</div>
    </div>
  );
}

const stats = [
  { end: 4, suffix: "", label: "Outbound Channels" },
  { end: 24, suffix: "/7", label: "Automation" },
  { end: 5, suffix: " Min", label: "Response Time" },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-[#0F172A] py-20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl px-6"
      >
        <div className="flex flex-col sm:flex-row justify-center items-center divide-y sm:divide-y-0 sm:divide-x divide-[#1F2937]">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} inView={inView} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
