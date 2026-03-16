"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { use } from "react";
import {
  MapPin,
  MessageSquare,
  BadgeCheck,
  ArrowLeft,
  ThumbsUp,
  Building,
  Star,
  Reply,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import TierBadge from "@/components/TierBadge";
import StarRating from "@/components/StarRating";
import { getBusiness, businesses } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

export default function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lang] = useState<"en" | "ar">("en");
  const business = getBusiness(id) || getBusiness("stc")!;

  const avgCategoryScore = (catName: string) => {
    const cat = business.categories.find((c) => c.name === catName);
    return cat ? cat.score : 0;
  };

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navbar lang={lang} />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="flex items-center gap-2 text-sm text-gray-400 py-4 mb-2"
          >
            <Link href="/explore" className="flex items-center gap-1 hover:text-saudi-green transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Explore
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-600 font-medium">{business.name}</span>
          </motion.div>

          {/* Business Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card mb-5"
          >
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Logo */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-saudi-green/10 to-saudi-green/5 border border-saudi-green/15 flex items-center justify-center font-bold text-2xl text-saudi-green flex-shrink-0">
                {business.logo}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
                      {business.verified && (
                        <BadgeCheck className="w-5 h-5 text-saudi-green flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{business.nameAr}</p>
                  </div>
                  <TierBadge tier={business.tier} size="md" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    {business.sector}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {business.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {business.reviewCount.toLocaleString()} reviews
                  </span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{business.description}</p>
              </div>

              {/* Score */}
              <div className="text-center sm:text-right">
                <div className="text-5xl font-bold text-gray-900">{business.overallScore}</div>
                <div className="text-xs text-gray-400 mb-1">out of 5</div>
                <StarRating value={Math.round(business.overallScore)} readonly size="sm" />
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card mb-5"
          >
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Star className="w-4 h-4 text-warm-gold" />
              Category Breakdown
            </h2>
            <div className="space-y-4">
              {business.categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-base w-6 text-center">{cat.emoji}</span>
                  <div className="w-28 text-sm text-gray-600 font-medium flex-shrink-0">{cat.name}</div>
                  <div className="flex-1 bg-warm-gray-2 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.score / 5) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.08, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        cat.score >= 4.5
                          ? "bg-saudi-green"
                          : cat.score >= 3.5
                          ? "bg-warm-gold"
                          : cat.score >= 2.5
                          ? "bg-amber-400"
                          : "bg-red-400"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8 text-right">{cat.score.toFixed(1)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card mb-5"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-saudi-green" />
                Customer Reviews
              </h2>
              <span className="text-sm text-gray-400">{business.reviews.length} shown</span>
            </div>

            <div className="space-y-5">
              {business.reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="border-b border-gray-50 last:border-0 pb-5 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-saudi-green/10 flex items-center justify-center text-saudi-green text-xs font-bold flex-shrink-0">
                      {review.authorInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">{review.author}</span>
                        {review.verified && (
                          <span className="flex items-center gap-0.5 text-xs text-saudi-green bg-saudi-green/5 px-1.5 py-0.5 rounded-full">
                            <BadgeCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">{review.date}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <StarRating value={review.rating} readonly size="sm" />
                        <span className="text-xs font-semibold text-gray-700">{review.rating}.0</span>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-2">{review.comment}</p>

                      {review.commentAr && (
                        <p className="text-sm text-gray-500 leading-relaxed mb-2 text-right font-arabic" dir="rtl">
                          {review.commentAr}
                        </p>
                      )}

                      {/* Business Response */}
                      {review.businessResponse && (
                        <div className="bg-saudi-green/5 border border-saudi-green/15 rounded-xl p-3 mt-3">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Reply className="w-3.5 h-3.5 text-saudi-green" />
                            <span className="text-xs font-semibold text-saudi-green">Response from {business.name}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{review.businessResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Leave Review CTA */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="bg-gradient-to-r from-saudi-green to-saudi-green-light rounded-2xl p-6 text-white text-center shadow-green-glow"
          >
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="text-xl font-bold mb-2">Visited {business.name}?</h3>
            <p className="text-white/80 text-sm mb-4">Share your verified experience with the community</p>
            <Link
              href={`/review/${business.id}`}
              className="inline-flex items-center gap-2 bg-white text-saudi-green font-semibold px-6 py-2.5 rounded-xl hover:bg-warm-gray transition-colors"
            >
              Leave a Review
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
