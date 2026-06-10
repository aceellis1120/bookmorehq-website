"use client";

import { ArrowDown, CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Find the revenue leak",
    desc: "We map how leads currently find you, what happens when they call or submit a form, how estimates are followed up, and where opportunities are getting lost.",
  },
  {
    num: "02",
    title: "Install the right system",
    desc: "We start with the highest-impact layer, configure it around your services and workflow, connect tracking, and test the customer experience before launch.",
  },
  {
    num: "03",
    title: "Capture and work every lead",
    desc: "Calls, forms, replies, and ad leads are answered, qualified, routed, followed up, and organized so your team knows exactly what requires action.",
  },
  {
    num: "04",
    title: "Measure and expand",
    desc: "Your dashboard shows pipeline activity and account performance. Once the first system produces value, we add the next layer where it makes sense.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="bg-[#0b0f14] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]"
        >
          <div>
            <p className="text-sm font-semibold uppercase text-[#60a5fa]">
              How we build
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Start focused. Build toward the full system.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#9cacc1]">
              You do not need to buy every service at once. We launch the layer
              most likely to improve revenue first, prove the workflow, then
              expand from there.
            </p>
          </div>

          <div className="divide-y divide-[#273449] border-y border-[#273449]">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="grid gap-4 py-6 sm:grid-cols-[64px_1fr_28px] sm:items-start"
              >
                <span className="text-sm font-bold text-[#60a5fa]">{step.num}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#9cacc1]">{step.desc}</p>
                </div>
                {index === steps.length - 1 ? (
                  <CheckCircle2 size={20} className="text-[#4ade80]" />
                ) : (
                  <ArrowDown size={20} className="text-[#516176]" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
