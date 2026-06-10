"use client";

import {
  BarChart3,
  Bot,
  Check,
  Globe2,
  Megaphone,
  MessagesSquare,
  Search,
  Star,
} from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    title: "AI Receptionist",
    label: "Lead capture",
    desc: "A custom voice agent that answers inbound calls, handles common questions, qualifies the opportunity, routes urgent callers, captures appointment requests, and sends structured call data into your operation.",
    includes: [
      "Dedicated business number and custom greeting",
      "Call qualification, transfers, recordings, and summaries",
      "Business-hours and after-hours call handling",
    ],
    icon: Bot,
    accent: "text-[#60a5fa] bg-[#172554]",
  },
  {
    title: "Outbound Growth",
    label: "Demand creation",
    desc: "A managed prospecting engine built to put your offer in front of targeted businesses and move interested replies toward a scheduled sales conversation.",
    includes: [
      "Targeted lead sourcing and list building",
      "Cold email infrastructure and multi-step campaigns",
      "Reply handling, appointment setting, and reporting",
    ],
    icon: Search,
    accent: "text-[#fbbf24] bg-[#422006]",
  },
  {
    title: "Website Conversion",
    label: "Digital storefront",
    desc: "Professional websites and landing pages designed around trust, mobile usability, clear service information, and simple actions that turn visitors into calls and form submissions.",
    includes: [
      "Custom mobile-friendly website design",
      "Service pages, reviews, FAQs, forms, and click-to-call",
      "Local SEO foundations, launch, and edit support",
    ],
    icon: Globe2,
    accent: "text-[#34d399] bg-[#052e2b]",
  },
  {
    title: "AI Follow-Up",
    label: "Lead recovery",
    desc: "Automated follow-up that keeps new leads, open estimates, no-shows, and old contacts from disappearing because nobody had time to call or text again.",
    includes: [
      "Missed-lead and estimate follow-up sequences",
      "No-show recovery and old-database reactivation",
      "Segmented SMS and email nurture campaigns",
    ],
    icon: MessagesSquare,
    accent: "text-[#c084fc] bg-[#2e1065]",
  },
  {
    title: "Local Authority",
    label: "Trust and reputation",
    desc: "A local presence system that helps prospects find stronger proof, better reviews, and more complete business information when they compare you with competitors.",
    includes: [
      "Google Business Profile optimization",
      "Review requests and testimonial capture",
      "Local trust content and reputation reporting",
    ],
    icon: Star,
    accent: "text-[#fb7185] bg-[#4c0519]",
  },
  {
    title: "Paid Growth",
    label: "Scalable acquisition",
    desc: "Managed paid campaigns for businesses ready to purchase demand, with tracking designed to connect ad activity to calls, leads, and booked opportunities.",
    includes: [
      "Google Ads or Local Services Ads management",
      "Retargeting, landing-page guidance, and testing",
      "Call tracking, conversion reporting, and optimization",
    ],
    icon: Megaphone,
    accent: "text-[#fb923c] bg-[#431407]",
  },
  {
    title: "BookMoreHQ Growth OS",
    label: "Unified operations",
    desc: "The complete system combines demand generation, lead capture, conversion, follow-up, reputation, and reporting into one managed growth operation.",
    includes: [
      "Combined service stack built around your bottlenecks",
      "Central sales, client, payment, and performance dashboard",
      "Multi-location routing, attribution, and growth reporting",
    ],
    icon: BarChart3,
    accent: "text-[#67e8f9] bg-[#083344]",
    featured: true,
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="bg-[#0f151f] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase text-[#60a5fa]">
            The BookMoreHQ service stack
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Every system a growing service business needs
          </h2>
          <p className="mt-5 text-base leading-7 text-[#9cacc1]">
            Start with the bottleneck costing you the most opportunities. As
            the business grows, each layer can connect into a larger system
            without rebuilding everything from scratch.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className={`rounded-lg border p-6 ${
                  service.featured
                    ? "border-[#2563eb] bg-[#101d34] md:col-span-2"
                    : "border-[#273449] bg-[#0b111a]"
                }`}
              >
                <div className={service.featured ? "lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-12" : ""}>
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className={`grid h-11 w-11 place-items-center rounded-md ${service.accent}`}>
                        <Icon size={21} />
                      </span>
                      <span className="rounded-md border border-[#344258] px-2 py-1 text-[10px] font-semibold uppercase text-[#91a1b7]">
                        {service.label}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#9cacc1]">
                      {service.desc}
                    </p>
                  </div>
                  <ul className={`mt-5 space-y-3 border-t border-[#273449] pt-5 ${service.featured ? "lg:mt-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-2" : ""}`}>
                    {service.includes.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-5 text-[#d5dce6]">
                        <Check size={16} className="mt-0.5 shrink-0 text-[#4ade80]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
