"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "Results", href: "#results" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[#0B0F14]/95 backdrop-blur-md border-b border-[#1F2937]/50" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <img src="/logo.svg" alt="BookMore HQ" className="h-8" />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#94A3B8] hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://cal.com/austin-ellis-rvyav5"
            className="ml-2 px-5 py-2.5 bg-[#3B82F6] text-white text-sm font-medium rounded-lg hover:bg-[#2563EB] transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          >
            Book a Call
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-white"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0B0F14]/98 backdrop-blur-md border-b border-[#1F2937]"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[#94A3B8] hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://cal.com/austin-ellis-rvyav5"
                onClick={() => setMobileOpen(false)}
                className="inline-block w-full text-center px-5 py-2.5 bg-[#3B82F6] text-white font-medium rounded-lg"
              >
                Book a Call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
