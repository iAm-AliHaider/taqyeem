"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus, BadgeCheck, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import TierBadge from "@/components/TierBadge";
import StarRating from "@/components/StarRating";
import { getLeaderboard, sectors } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.04 },
  }),
};

const podiumColors = ["bg-warm-gold", "bg-gray-300", "bg-amber-600"];
const podiumTextColors = ["text-amber-800", "text-gray-700", "text-amber-900"];
const podiumIcons = ["🥇", "🥈", "🥉"];
const podiumHeights = ["h-28", "h-20", "h-16"];

export default function LeaderboardPage() {
  const [lang] = useState<"en" | "ar">("en");
  const [activeSector, setActiveSector] = useState("all");

  const leaderboard = getLeaderboard(activeSector);
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navbar lang={lang} />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center py-10"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 bg-warm-gold/10 border border-warm-gold/30 text-warm-gold text-sm font-medium px-4 py-1.5 rounded-full mb-4"
            >
              <Trophy className="w-4 h-4" />
              National Rankings
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Saudi Business Leaderboard
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-sm">
              Live rankings based on {leaderboard.reduce((a, b) => a + b.reviewCount, 0).toLocaleString()} verified reviews
            </motion.p>
          </motion.div>

          {/* Sector Tabs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex gap-2 flex-wrap justify-center mb-8"
          >
            {sectors.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSector(s.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                  activeSector === s.id
                    ? "bg-saudi-green text-white border-saudi-green shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-saudi-green/30"
                }`}
              >
                {s.label}
              </button>
            ))}
          </motion.div>

          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <motion.div
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <motion.h2 variants={fadeUp} custom={0} className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                Top Performers
              </motion.h2>

              {/* Podium visual */}
              <div className="flex items-end justify-center gap-3 mb-6">
                {/* 2nd place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-saudi-green text-lg mb-2 shadow-card">
                    {top3[1].logo}
                  </div>
                  <p className="text-xs font-semibold text-gray-700 text-center mb-2 max-w-[80px] truncate">
                    {top3[1].name}
                  </p>
                  <TierBadge tier={top3[1].tier} size="sm" />
                  <div className="mt-2 text-lg font-bold text-gray-800">{top3[1].overallScore}</div>
                  <div className={`w-20 ${podiumHeights[1]} ${podiumColors[1]} rounded-t-lg flex items-center justify-center mt-2`}>
                    <span className="text-2xl">{podiumIcons[1]}</span>
                  </div>
                </motion.div>

                {/* 1st place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-50 border-2 border-warm-gold flex items-center justify-center font-bold text-saudi-green text-xl mb-2 shadow-[0_4px_16px_rgba(200,150,46,0.25)]"
                  >
                    {top3[0].logo}
                  </motion.div>
                  <p className="text-xs font-semibold text-gray-900 text-center mb-2 max-w-[90px] truncate">
                    {top3[0].name}
                  </p>
                  <TierBadge tier={top3[0].tier} size="sm" animated />
                  <div className="mt-2 text-2xl font-bold text-gray-900">{top3[0].overallScore}</div>
                  <div className={`w-24 ${podiumHeights[0]} ${podiumColors[0]} rounded-t-lg flex items-center justify-center mt-2 shadow-sm`}>
                    <span className="text-3xl">{podiumIcons[0]}</span>
                  </div>
                </motion.div>

                {/* 3rd place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center font-bold text-saudi-green text-lg mb-2 shadow-card">
                    {top3[2].logo}
                  </div>
                  <p className="text-xs font-semibold text-gray-700 text-center mb-2 max-w-[80px] truncate">
                    {top3[2].name}
                  </p>
                  <TierBadge tier={top3[2].tier} size="sm" />
                  <div className="mt-2 text-lg font-bold text-gray-800">{top3[2].overallScore}</div>
                  <div className={`w-20 ${podiumHeights[2]} ${podiumColors[2]} rounded-t-lg flex items-center justify-center mt-2`}>
                    <span className="text-2xl">{podiumIcons[2]}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Full rankings */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">Full Rankings</h3>
              <span className="text-xs text-gray-400">{leaderboard.length} businesses</span>
            </div>

            <div className="divide-y divide-gray-50">
              {leaderboard.map((biz, i) => (
                <motion.div
                  key={biz.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={i * 0.3}
                >
                  <Link href={`/business/${biz.id}`}>
                    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-warm-gray transition-colors cursor-pointer group">
                      {/* Rank */}
                      <div className="w-8 text-center flex-shrink-0">
                        {i < 3 ? (
                          <span className="text-lg">{podiumIcons[i]}</span>
                        ) : (
                          <span className="text-sm font-bold text-gray-400">#{i + 1}</span>
                        )}
                      </div>

                      {/* Logo */}
                      <div className="w-9 h-9 rounded-lg bg-saudi-green/8 border border-saudi-green/10 flex items-center justify-center text-saudi-green font-bold text-xs flex-shrink-0">
                        {biz.logo}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-semibold text-gray-900 text-sm group-hover:text-saudi-green transition-colors truncate">
                            {biz.name}
                          </span>
                          {biz.verified && <BadgeCheck className="w-3 h-3 text-saudi-green flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{biz.sector}</span>
                          <span>·</span>
                          <span>{biz.reviewCount.toLocaleString()} reviews</span>
                        </div>
                      </div>

                      {/* Tier */}
                      <TierBadge tier={biz.tier} size="sm" animated={false} />

                      {/* Score */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-gray-900">{biz.overallScore.toFixed(1)}</div>
                        <div className="flex items-center gap-0.5 justify-end">
                          {[...Array(5)].map((_, s) => (
                            <svg
                              key={s}
                              className={`w-2.5 h-2.5 ${s < Math.round(biz.overallScore) ? "fill-warm-gold stroke-warm-gold" : "fill-none stroke-gray-200"}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 1L12.39 6.26L18 7.27L14 11.14L14.76 17L10 14.27L5.24 17L6 11.14L2 7.27L7.61 6.26L10 1Z" strokeWidth="1.5" />
                            </svg>
                          ))}
                        </div>
                      </div>

                      {/* Rank change */}
                      <div className={`flex items-center gap-0.5 text-xs font-semibold w-8 justify-center flex-shrink-0 ${
                        biz.rankChange > 0 ? "text-green-500" : biz.rankChange < 0 ? "text-red-400" : "text-gray-300"
                      }`}>
                        {biz.rankChange > 0 ? (
                          <><TrendingUp className="w-3 h-3" />{biz.rankChange}</>
                        ) : biz.rankChange < 0 ? (
                          <><TrendingDown className="w-3 h-3" />{Math.abs(biz.rankChange)}</>
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-gray-200 group-hover:text-saudi-green transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
