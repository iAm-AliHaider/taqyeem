"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, TrendingUp, SearchX } from "lucide-react";
import Navbar from "@/components/Navbar";
import BusinessCard from "@/components/BusinessCard";
import { businesses, sectors, cities } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05 },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function ExplorePage() {
  const [lang] = useState<"en" | "ar">("en");
  const [search, setSearch] = useState("");
  const [activeSector, setActiveSector] = useState("all");
  const [activeCity, setActiveCity] = useState("all");
  const [sort, setSort] = useState<"rating" | "reviews" | "name">("rating");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    let result = [...businesses];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.nameAr.includes(q) ||
          b.sector.includes(q)
      );
    }

    if (activeSector !== "all") {
      result = result.filter((b) => b.sector === activeSector);
    }

    if (activeCity !== "all") {
      result = result.filter((b) => b.city === activeCity);
    }

    result.sort((a, b) => {
      if (sort === "rating") return b.overallScore - a.overallScore;
      if (sort === "reviews") return b.reviewCount - a.reviewCount;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [search, activeSector, activeCity, sort]);

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navbar lang={lang} />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center py-12"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold text-saudi-green uppercase tracking-wider mb-3"
            >
              Explore
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
            >
              Browse Saudi Businesses
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-gray-500 text-base"
            >
              {businesses.length} verified businesses across Saudi Arabia
            </motion.p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mb-6"
          >
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search businesses..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-saudi-green/30 shadow-card"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            {/* Sector pills */}
            <div className="flex gap-2 flex-wrap flex-1">
              {sectors.slice(0, 5).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSector(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    activeSector === s.id
                      ? "bg-saudi-green text-white border-saudi-green"
                      : "bg-white text-gray-600 border-gray-200 hover:border-saudi-green/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* City + Sort */}
            <div className="flex gap-2">
              <select
                value={activeCity}
                onChange={(e) => setActiveCity(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-saudi-green/30"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-saudi-green/30"
              >
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="name">A-Z</option>
              </select>
            </div>
          </motion.div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{isLoading ? "..." : filtered.length}</span> businesses
            </p>
            {(activeSector !== "all" || activeCity !== "all" || search) && !isLoading && (
              <button
                onClick={() => { setActiveSector("all"); setActiveCity("all"); setSearch(""); }}
                className="text-xs text-saudi-green font-medium flex items-center gap-1 hover:underline"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          {isLoading ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={cardFadeUp}
                  custom={i}
                >
                  <div className="rounded-2xl shimmer-bg h-48 w-full" />
                </motion.div>
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-warm-gray rounded-full flex items-center justify-center">
                <SearchX className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn&apos;t find any businesses matching your search. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => { setActiveSector("all"); setActiveCity("all"); setSearch(""); }}
                className="mt-6 bg-saudi-green text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-saudi-green-dark transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map((biz, i) => (
                <motion.div
                  key={biz.id}
                  variants={cardFadeUp}
                  custom={i}
                >
                  <BusinessCard business={biz} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
