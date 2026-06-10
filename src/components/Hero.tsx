"use client";

import { ArrowRight, CheckCircle2, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import GrowthSystemMockup from "./GrowthSystemMockup";

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-[#0b0f14]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-70" />
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-32">
        <div className="grid min-w-0 items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="min-w-0"
          >
            <span className="inline-flex items-center gap-2 rounded-md border border-[#1d4ed8]/50 bg-[#172554]/60 px-3 py-2 text-xs font-semibold text-[#93c5fd]">
              <PhoneCall size={14} />
              AI Receptionist systems are available now
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              AI-powered growth systems for service businesses
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#a8b5c7]">
              BookMoreHQ builds the infrastructure that helps businesses get
              found, capture every lead, answer every call, follow up faster,
              book more appointments, and see the entire pipeline in one place.
            </p>

            <div className="mt-7 grid max-w-2xl gap-3 text-sm text-[#d5dce6] sm:grid-cols-2">
              {[
                "24/7 AI call answering and qualification",
                "Outbound prospecting and appointment setting",
                "Conversion-focused websites and landing pages",
                "Automated follow-up, reviews, ads, and reporting",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#4ade80]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href="https://cal.com/austin-ellis-rvyav5"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#2563eb] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
              >
                Book a growth call
                <ArrowRight size={17} />
              </a>
              <a
                href="#services"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#344258] px-6 text-sm font-semibold text-white transition-colors hover:border-[#64748b] hover:bg-[#151c27]"
              >
                Explore our systems
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="min-w-0"
          >
            <GrowthSystemMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
