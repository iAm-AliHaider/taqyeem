"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  lang?: "en" | "ar";
  onLangToggle?: () => void;
}

export default function Navbar({ lang = "en", onLangToggle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAr = lang === "ar";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = isAr
    ? [
        { href: "/", label: "الرئيسية" },
        { href: "/explore", label: "استعرض" },
        { href: "/leaderboard", label: "الترتيب" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/leaderboard", label: "Leaderboard" },
      ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn("flex items-center justify-between h-16", isAr && "flex-row-reverse")}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-saudi-green rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">ت</span>
            </div>
            <span className="font-bold text-gray-900 group-hover:text-saudi-green transition-colors">
              {isAr ? "تقييم" : "تقييم | Taqyeem"}
            </span>
          </Link>

          {/* Desktop links */}
          <div className={cn("hidden md:flex items-center gap-8", isAr && "flex-row-reverse")}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-saudi-green font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className={cn("hidden md:flex items-center gap-3", isAr && "flex-row-reverse")}>
            <button
              onClick={onLangToggle}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-saudi-green transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">{isAr ? "EN" : "AR"}</span>
            </button>
            <Link
              href="/explore"
              className="bg-saudi-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-saudi-green-dark transition-colors"
            >
              {isAr ? "أضف نشاطك" : "Add Your Business"}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-700 font-medium py-2 hover:text-saudi-green transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={onLangToggle}
                  className="flex items-center gap-1.5 text-sm text-gray-600 font-medium"
                >
                  <Globe className="w-4 h-4" />
                  {isAr ? "EN" : "AR"}
                </button>
                <Link
                  href="/explore"
                  className="flex-1 bg-saudi-green text-white text-sm font-semibold px-4 py-2 rounded-xl text-center hover:bg-saudi-green-dark transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {isAr ? "أضف نشاطك" : "Add Your Business"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
