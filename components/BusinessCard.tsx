"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, MessageSquare, ArrowUpRight, BadgeCheck } from "lucide-react";
import TierBadge from "./TierBadge";
import StarRating from "./StarRating";
import type { Business } from "@/lib/mock-data";

interface BusinessCardProps {
  business: Business;
  rank?: number;
  compact?: boolean;
}

export default function BusinessCard({ business, rank, compact }: BusinessCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 400 } }}
      className="group relative"
    >
      <Link href={`/business/${business.id}`}>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group-hover:border-l-4 group-hover:border-l-saudi-green relative">
          {/* Left accent bar on hover */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-saudi-green rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {rank && (
                <div className="w-7 h-7 rounded-full bg-warm-gray flex items-center justify-center text-xs font-bold text-gray-500">
                  {rank}
                </div>
              )}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-saudi-green/10 to-saudi-green/5 flex items-center justify-center border border-saudi-green/10 font-bold text-saudi-green text-sm">
                {business.logo}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-saudi-green transition-colors">
                    {business.name}
                  </h3>
                  {business.verified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-saudi-green flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{business.cityAr} / {business.city}</span>
                </div>
              </div>
            </div>
            <TierBadge tier={business.tier} size="sm" />
          </div>

          {/* Score */}
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full border-2 border-warm-gold/30 bg-warm-gold/5 w-10 h-10 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">
                {business.overallScore.toFixed(1)}
              </span>
            </div>
            <div>
              <StarRating value={Math.round(business.overallScore)} readonly size="sm" />
              <div className="flex items-center gap-1 mt-0.5">
                <MessageSquare className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {business.reviewCount.toLocaleString()} reviews
                </span>
              </div>
            </div>
          </div>

          {!compact && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 bg-warm-gray px-2 py-1 rounded-lg">
                {business.sectorAr} / {business.sector}
              </span>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-saudi-green transition-colors" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
