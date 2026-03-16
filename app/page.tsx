"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Shield,
  Star,
  Trophy,
  Building,
  MessageCircle,
  QrCode,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import TierBadge from "@/components/TierBadge";
import BusinessCard from "@/components/BusinessCard";
import { getTopBusinesses, type Business as MockBusiness } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const DEFAULT_STATS = [
  { value: "0", label: "Reviews", labelAr: "تقييم", icon: "⭐" },
  { value: "0", label: "Businesses", labelAr: "نشاط تجاري", icon: "🏢" },
  { value: "0", label: "Verified", labelAr: "موثق", icon: "✅" },
  { value: "15", label: "Cities", labelAr: "مدينة", icon: "🏙️" },
];

const features = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Geofence Lock",
    titleAr: "قفل الموقع الجغرافي",
    desc: "Reviews only accepted when physically at the location",
    descAr: "التقييمات تُقبل فقط عند التواجد الفعلي في الموقع",
    color: "bg-green-50 text-saudi-green border-green-100",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Nafath Verified",
    titleAr: "موثق بنفاذ",
    desc: "All reviewers authenticated through Saudi's National SSO",
    descAr: "جميع المقيّمين موثقون عبر منصة نفاذ الوطنية",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "6-Category Rating",
    titleAr: "تقييم 6 فئات",
    desc: "Deep scoring across Service, Staff, Cleanliness & more",
    descAr: "تسجيل عميق للخدمة والموظفين والنظافة وغيرها",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "National Leaderboard",
    titleAr: "لوحة الترتيب الوطنية",
    desc: "Live rankings across 15 cities and all sectors",
    descAr: "ترتيب مباشر عبر 15 مدينة وجميع القطاعات",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    icon: <Building className="w-5 h-5" />,
    title: "MOCI Integration",
    titleAr: "تكامل وزارة التجارة",
    desc: "Verified business registration through Ministry of Commerce",
    descAr: "توثيق تسجيل الأعمال عبر وزارة التجارة",
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "Business Response",
    titleAr: "رد الأعمال",
    desc: "Businesses can officially respond to verified reviews",
    descAr: "يمكن للأعمال الرد رسمياً على التقييمات الموثقة",
    color: "bg-rose-50 text-rose-600 border-rose-100",
  },
];

const steps = [
  {
    step: "01",
    icon: <QrCode className="w-6 h-6" />,
    title: "Scan QR",
    titleAr: "امسح رمز QR",
    desc: "Scan the business QR code at the location",
    descAr: "امسح رمز QR للنشاط التجاري في الموقع",
  },
  {
    step: "02",
    icon: <Star className="w-6 h-6" />,
    title: "Rate 6 Categories",
    titleAr: "قيّم 6 فئات",
    desc: "Score service, staff, cleanliness, value & more",
    descAr: "تقييم الخدمة والموظفين والنظافة والقيمة وأكثر",
  },
  {
    step: "03",
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Verified Review Live",
    titleAr: "التقييم الموثق مباشر",
    desc: "Your Nafath-verified review goes live instantly",
    descAr: "تقييمك الموثق بنفاذ يظهر فوراً",
  },
];

const pricingPlans = [
  {
    name: "Free",
    nameAr: "مجاني",
    price: "0",
    period: "forever",
    periodAr: "للأبد",
    features: ["Basic profile listing", "Respond to reviews", "View your ratings", "Basic analytics"],
    featuresAr: ["قائمة الملف الأساسي", "الرد على التقييمات", "عرض تقييماتك", "تحليلات أساسية"],
    highlighted: false,
    cta: "Get Started",
    ctaAr: "ابدأ الآن",
  },
  {
    name: "Pro",
    nameAr: "احترافي",
    price: "499",
    period: "SAR/month",
    periodAr: "ر.س / شهر",
    features: ["Everything in Free", "Priority placement", "Advanced analytics", "Custom QR codes", "Monthly reports", "Response templates"],
    featuresAr: ["كل شيء في المجاني", "موضع مميز", "تحليلات متقدمة", "رموز QR مخصصة", "تقارير شهرية", "قوالب الردود"],
    highlighted: true,
    cta: "Start Pro",
    ctaAr: "ابدأ بروفيشنال",
  },
  {
    name: "Enterprise",
    nameAr: "مؤسسي",
    price: "1,999",
    period: "SAR/month",
    periodAr: "ر.س / شهر",
    features: ["Everything in Pro", "Multi-branch management", "API access", "Dedicated manager", "Custom integrations", "SLA guarantee"],
    featuresAr: ["كل شيء في الاحترافي", "إدارة متعددة الفروع", "وصول API", "مدير مخصص", "تكاملات مخصصة", "ضمان اتفاقية مستوى الخدمة"],
    highlighted: false,
    cta: "Contact Sales",
    ctaAr: "تواصل مع المبيعات",
  },
];

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * target));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return value;
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  const numStr = value.replace(/,/g, "").match(/\d+/)?.[0] ?? "0";
  const suffix = value.replace(/[\d,]/g, "");
  const count = useCountUp(parseInt(numStr));
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-card text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

interface ApiStats {
  businesses: number;
  reviews: number;
  users: number;
  verified: number;
}

interface ApiBusinessItem {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  overallScore: string;
  reviewCount: number;
  tier: string;
  verified: boolean;
}

export default function HomePage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const isAr = lang === "ar";

  const [stats, setStats] = useState(DEFAULT_STATS);
  const [topBusinesses, setTopBusinesses] = useState<MockBusiness[]>(getTopBusinesses(5));

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json() as Promise<ApiStats>)
      .then((data) => {
        if (data.businesses || data.reviews) {
          setStats([
            { value: `${data.reviews}`, label: "Reviews", labelAr: "تقييم", icon: "⭐" },
            { value: `${data.businesses}`, label: "Businesses", labelAr: "نشاط تجاري", icon: "🏢" },
            { value: `${data.verified}`, label: "Verified", labelAr: "موثق", icon: "✅" },
            { value: "15", label: "Cities", labelAr: "مدينة", icon: "🏙️" },
          ]);
        }
      })
      .catch(() => {/* keep defaults */});

    fetch("/api/leaderboard")
      .then((r) => r.json() as Promise<{ businesses: ApiBusinessItem[] }>)
      .then((data) => {
        const bizes = data.businesses ?? [];
        if (bizes.length > 0) {
          const mapped: MockBusiness[] = bizes.slice(0, 5).map((b, i) => ({
            id: b.slug || b.id,
            name: b.name,
            nameAr: b.nameAr || b.name,
            sector: "general",
            sectorAr: "عام",
            city: "riyadh",
            cityAr: "الرياض",
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
          }));
          setTopBusinesses(mapped);
        }
      })
      .catch(() => {/* keep mock data */});
  }, []);

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-white">
      <Navbar lang={lang} onLangToggle={() => setLang(isAr ? "en" : "ar")} />

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-warm-gray overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-saudi-green/5 border border-saudi-green/20 text-saudi-green text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saudi-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-saudi-green"></span>
              </span>
              {isAr ? "مباشر الآن في 15 مدينة سعودية" : "Live across 15 Saudi cities"}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              {isAr ? (
                <>
                  أول منصة تقييم
                  <span className="gradient-text-green"> موثقة </span>
                  في المملكة
                </>
              ) : (
                <>
                  Saudi Arabia&apos;s First
                  <span className="gradient-text-green"> Verified </span>
                  Review Platform
                </>
              )}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              {isAr
                ? "تقييمات حقيقية من عملاء حقيقيين — موثقة بنفاذ، مقيّدة جغرافياً، مفيدة فعلاً."
                : "Real reviews from real customers — Nafath-verified, geofence-locked, and genuinely useful."}
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
            >
              <Link
                href="/explore"
                className="w-full sm:w-auto bg-saudi-green text-white font-semibold px-6 py-3 rounded-xl hover:bg-saudi-green-dark transition-all inline-flex items-center justify-center gap-2 shadow-green-glow"
              >
                {isAr ? "استعرض الأعمال" : "Explore Businesses"}
                <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </Link>
              <Link
                href="/leaderboard"
                className="w-full sm:w-auto bg-white text-gray-800 font-semibold px-6 py-3 rounded-xl hover:bg-warm-gray transition-all border border-gray-200 inline-flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4 text-warm-gold" />
                {isAr ? "الترتيب الوطني" : "National Leaderboard"}
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  label={isAr ? stat.labelAr : stat.label}
                  icon={stat.icon}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-saudi-green uppercase tracking-wider mb-3">
              {isAr ? "كيف يعمل" : "How It Works"}
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-gray-900">
              {isAr ? "ثلاث خطوات بسيطة" : "Three Simple Steps"}
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative bg-warm-gray rounded-2xl p-6 text-center"
              >
                <div className="text-5xl font-bold text-gray-100 absolute top-4 right-4">{step.step}</div>
                <div className="w-12 h-12 bg-saudi-green rounded-xl flex items-center justify-center text-white mb-4 mx-auto relative z-10">
                  {step.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {isAr ? step.titleAr : step.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {isAr ? step.descAr : step.desc}
                </p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-warm-gray">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-saudi-green uppercase tracking-wider mb-3">
              {isAr ? "المميزات" : "Features"}
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-gray-900">
              {isAr ? "مبني للثقة" : "Built for Trust"}
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.5}
                whileHover={{ y: -5, transition: { type: "spring" as const, stiffness: 400, damping: 20 } }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow cursor-default"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">
                  {isAr ? feature.titleAr : feature.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {isAr ? feature.descAr : feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-saudi-green uppercase tracking-wider mb-1">
                {isAr ? "لوحة الترتيب" : "Leaderboard"}
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-2xl font-bold text-gray-900">
                {isAr ? "الأعمال الأعلى تقييماً" : "Top Rated Businesses"}
              </motion.h2>
            </div>
            <Link
              href="/leaderboard"
              className="text-sm text-saudi-green font-medium flex items-center gap-1 hover:underline"
            >
              {isAr ? "عرض الكل" : "View all"}
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </motion.div>

          <div className="space-y-3">
            {topBusinesses.map((biz, i) => (
              <motion.div
                key={biz.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.5}
              >
                <Link href={`/business/${biz.id}`}>
                  <div className="flex items-center gap-4 bg-warm-gray hover:bg-warm-gray-2 rounded-xl p-4 transition-all group cursor-pointer">
                    <div className="w-8 text-center">
                      <span className={`text-lg font-bold ${i === 0 ? "text-warm-gold" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-300"}`}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center font-bold text-saudi-green text-sm shadow-sm">
                      {biz.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 group-hover:text-saudi-green transition-colors text-sm truncate">
                        {isAr ? biz.nameAr : biz.name}
                      </div>
                      <div className="text-xs text-gray-400">{biz.reviewCount.toLocaleString()} reviews</div>
                    </div>
                    <TierBadge tier={biz.tier} size="sm" />
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{biz.overallScore}</div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, s) => (
                          <svg key={s} className={`w-2.5 h-2.5 ${s < Math.round(biz.overallScore) ? "fill-warm-gold stroke-warm-gold" : "fill-none stroke-gray-300"}`} viewBox="0 0 20 20">
                            <path d="M10 1L12.39 6.26L18 7.27L14 11.14L14.76 17L10 14.27L5.24 17L6 11.14L2 7.27L7.61 6.26L10 1Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className={`flex items-center gap-0.5 text-xs font-medium ${biz.rankChange > 0 ? "text-green-500" : biz.rankChange < 0 ? "text-red-400" : "text-gray-400"}`}>
                      {biz.rankChange > 0 ? "▲" : biz.rankChange < 0 ? "▼" : "—"}
                      {biz.rankChange !== 0 && Math.abs(biz.rankChange)}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-warm-gray">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-saudi-green uppercase tracking-wider mb-3">
              {isAr ? "للأعمال" : "For Businesses"}
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {isAr ? "خطط بسيطة وشفافة" : "Simple, Transparent Pricing"}
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500">
              {isAr ? "ابدأ مجاناً. أضف المميزات عند الحاجة." : "Start free. Add features as you grow."}
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.5}
                className={`rounded-2xl p-6 ${plan.highlighted
                    ? "bg-saudi-green text-white shadow-[0_8px_40px_rgba(27,107,58,0.25)] ring-2 ring-saudi-green/30 scale-105"
                    : "bg-white border border-gray-100 shadow-card"
                  }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full inline-block mb-3">
                    {isAr ? "الأكثر شعبية" : "Most Popular"}
                  </div>
                )}
                <h3 className={`font-bold text-lg mb-1 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                  {isAr ? plan.nameAr : plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                    {plan.price === "0" ? "Free" : `SAR ${plan.price}`}
                  </span>
                </div>
                <p className={`text-sm mb-5 ${plan.highlighted ? "text-white/70" : "text-gray-400"}`}>
                  {plan.price !== "0" && (isAr ? plan.periodAr : plan.period)}
                </p>

                <ul className="space-y-2.5 mb-6">
                  {(isAr ? plan.featuresAr : plan.features).map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? "text-white/80" : "text-saudi-green"}`} />
                      <span className={plan.highlighted ? "text-white/90" : "text-gray-600"}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${plan.highlighted
                      ? "bg-white text-saudi-green hover:bg-warm-gray"
                      : "bg-saudi-green/5 text-saudi-green hover:bg-saudi-green/10 border border-saudi-green/20"
                    }`}
                >
                  {isAr ? plan.ctaAr : plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-saudi-green rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">ت</span>
              </div>
              <span className="font-bold text-white">تقييم | Taqyeem</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
              <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
              <span>© 2024 Taqyeem. All rights reserved.</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-xs">
            <p>Powered by Nafath Authentication · MOCI Verified · Vision 2030 Partner</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
