"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import BusinessCard from "@/components/BusinessCard";
import { sectors, cities, type Business as MockBusiness } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05 },
  }),
};

interface ApiBusinessItem {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  sector?: string | null;
  city?: string | null;
  overallScore: string;
  reviewCount: number;
  tier: string;
  verified: boolean;
}

function mapToBusiness(b: ApiBusinessItem, i: number): MockBusiness {
  return {
    id: b.slug || b.id,
    name: b.name,
    nameAr: b.nameAr || b.name,
    sector: b.sector || "other",
    sectorAr: b.sector || "أخرى",
    city: b.city || "riyadh",
    cityAr: b.city || "الرياض",
    tier: (["platinum","gold","silver","bronze","redflag"].includes(b.tier) ? b.tier : "silver") as MockBusiness["tier"],
    overallScore: parseFloat(b.overallScore) || 0,
    reviewCount: b.reviewCount,
    rank: i + 1,
    rankChange: 0,
    logo: b.name.charAt(0).toUpperCase(),
    description: "",
    descriptionAr: "",
    verified: b.verified,
    categories: [],
    reviews: [],
  };
}

export default function ExplorePage() {
  const [lang] = useState<"en" | "ar">("en");
  const [search, setSearch] = useState("");
  const [activeSector, setActiveSector] = useState("all");
  const [activeCity, setActiveCity] = useState("all");
  const [sort, setSort] = useState<"score" | "reviews" | "newest">("score");
  const [businesses, setBusinesses] = useState<MockBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeSector !== "all") params.set("sector", activeSector);
    if (activeCity !== "all") params.set("city", activeCity);
    if (sort) params.set("sort", sort);
    if (search.trim()) params.set("search", search.trim());

    fetch(`/api/businesses?${params.toString()}`)
      .then((r) => r.json() as Promise<{ businesses: ApiBusinessItem[] }>)
      .then((data) => {
        setBusinesses((data.businesses ?? []).map(mapToBusiness));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeSector, activeCity, sort, search]);

  useEffect(() => {
    const t = setTimeout(fetchBusinesses, 300);
    return () => clearTimeout(t);
  }, [fetchBusinesses]);

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navbar lang={lang} />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial="hidden" animate="visible" className="text-center py-12">
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-saudi-green uppercase tracking-wider mb-3">
              Explore
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Browse Saudi Businesses
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-base">
              {loading ? "Loading..." : `${businesses.length} businesses found`}
            </motion.p>
          </motion.div>

          {/* Search */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mb-6">
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
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex gap-2 flex-wrap flex-1">
              {sectors.slice(0, 6).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSector(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    activeSector === s.id ? "bg-saudi-green text-white border-saudi-green" : "bg-white text-gray-600 border-gray-200 hover:border-saudi-green/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
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
                <option value="score">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </motion.div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{businesses.length}</span> businesses
            </p>
            {(activeSector !== "all" || activeCity !== "all" || search) && (
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
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500">No businesses found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {businesses.map((biz, i) => (
                <motion.div key={biz.id} initial="hidden" animate="visible" variants={fadeUp} custom={i * 0.3}>
                  <BusinessCard business={biz} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
