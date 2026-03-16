"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Tier } from "@/lib/mock-data";

interface TierBadgeProps {
  tier: Tier;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

const tierConfig = {
  platinum: {
    label: "Platinum",
    labelAr: "بلاتينيوم",
    icon: "💎",
    gradient: "from-[#8B9DC3] via-[#C5D3E8] to-[#8B9DC3]",
    bg: "bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100",
    border: "border-blue-200",
    text: "text-slate-700",
    glow: "shadow-[0_0_20px_rgba(139,157,195,0.4)]",
    ring: "ring-2 ring-blue-200/50",
  },
  gold: {
    label: "Gold",
    labelAr: "ذهبي",
    icon: "🥇",
    gradient: "from-[#C8962E] via-[#E5B84A] to-[#C8962E]",
    bg: "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50",
    border: "border-amber-300",
    text: "text-amber-800",
    glow: "shadow-[0_0_20px_rgba(200,150,46,0.35)]",
    ring: "ring-2 ring-amber-200/60",
  },
  silver: {
    label: "Silver",
    labelAr: "فضي",
    icon: "🥈",
    gradient: "from-[#9E9E9E] via-[#E0E0E0] to-[#9E9E9E]",
    bg: "bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50",
    border: "border-gray-300",
    text: "text-gray-600",
    glow: "shadow-[0_0_15px_rgba(158,158,158,0.25)]",
    ring: "ring-1 ring-gray-200/80",
  },
  bronze: {
    label: "Bronze",
    labelAr: "برونزي",
    icon: "🥉",
    gradient: "from-[#CD7F32] via-[#E8A85C] to-[#CD7F32]",
    bg: "bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50",
    border: "border-orange-200",
    text: "text-orange-800",
    glow: "shadow-[0_0_15px_rgba(205,127,50,0.25)]",
    ring: "ring-1 ring-orange-200/60",
  },
  redflag: {
    label: "Red Flag",
    labelAr: "علم أحمر",
    icon: "🚩",
    gradient: "from-[#E53935] via-[#EF5350] to-[#E53935]",
    bg: "bg-gradient-to-r from-red-50 via-rose-50 to-red-50",
    border: "border-red-200",
    text: "text-red-700",
    glow: "shadow-[0_0_15px_rgba(229,57,53,0.25)]",
    ring: "ring-1 ring-red-200/60",
  },
};

const sizeConfig = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
  lg: "text-base px-4 py-1.5 gap-2",
};

export default function TierBadge({
  tier,
  size = "md",
  animated = true,
  className,
}: TierBadgeProps) {
  const config = tierConfig[tier];

  const badge = (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        config.bg,
        config.border,
        config.text,
        config.ring,
        animated && tier !== "redflag" && config.glow,
        sizeConfig[size],
        className
      )}
    >
      <span className={size === "sm" ? "text-xs" : "text-sm"}>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );

  if (!animated) return badge;

  return (
    <motion.div
      className="inline-flex"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {badge}
    </motion.div>
  );
}
