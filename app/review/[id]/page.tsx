"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { use } from "react";
import { MapPin, CheckCircle, ArrowLeft, ArrowRight, Shield, BadgeCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import { getBusiness, categoryLabels } from "@/lib/mock-data";

const STEP_NAMES = ["Verify Location", "Rate Experience", "Confirmation"];

const stepTransition = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -50, opacity: 0 },
  transition: { duration: 0.25 },
};

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.25 },
};

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const business = getBusiness(id) || getBusiness("stc")!;

  const [step, setStep] = useState(0);
  const [geoVerified, setGeoVerified] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [catRatings, setCatRatings] = useState<Record<string, number>>({});
  const [reviewText, setReviewText] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleGeoVerify = () => {
    setGeoLoading(true);
    setTimeout(() => {
      setGeoLoading(false);
      setGeoVerified(true);
    }, 2200);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setStep(2);
  };

  const canProceedStep1 = geoVerified;
  const canProceedStep2 = overallRating > 0 && Object.keys(catRatings).length >= 3;

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navbar />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          {/* Business header */}
          <div className="flex items-center gap-3 mb-6 pt-4">
            <Link href={`/business/${business.id}`} className="text-gray-400 hover:text-saudi-green transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-saudi-green/10 flex items-center justify-center font-bold text-saudi-green">
              {business.logo}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">{business.name}</h2>
              <p className="text-xs text-gray-400">{business.city} · {business.sector}</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center mb-8">
            {STEP_NAMES.map((name, i) => (
              <div key={name} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                  i < step
                    ? "bg-saudi-green text-white"
                    : i === step
                    ? "bg-saudi-green text-white shadow-green-glow"
                    : "bg-white text-gray-400 border border-gray-200"
                }`}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <div className="flex-1 mx-2">
                  <div className="h-0.5 bg-gray-200 overflow-hidden">
                    <motion.div
                      className="h-full bg-saudi-green"
                      animate={{ width: step > i ? "100%" : "0%" }}
                      transition={{ type: "spring", stiffness: 100 }}
                    />
                  </div>
                </div>
                {i === STEP_NAMES.length - 1 && (
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    step >= STEP_NAMES.length - 1 ? "bg-saudi-green text-white" : "bg-white text-gray-400 border border-gray-200"
                  }`}>
                    {step >= STEP_NAMES.length - 1 ? <CheckCircle className="w-4 h-4" /> : STEP_NAMES.length}
                  </div>
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Geofence */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={stepTransition.initial}
                animate={stepTransition.animate}
                exit={stepTransition.exit}
                transition={stepTransition.transition}
                className="bg-white rounded-2xl border border-gray-100 shadow-card p-6"
              >
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Location</h2>
                  <p className="text-sm text-gray-500 mb-8">We need to confirm you&apos;re physically at {business.name} before accepting your review.</p>

                  {/* Animation */}
                  <div className="relative w-40 h-40 mx-auto mb-8">
                    {/* Pulsing rings - 3 concentric rings */}
                    {!geoVerified && (
                      <>
                        {Array(3).fill(0).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 rounded-full border-2 border-saudi-green/40"
                            style={{ width: 80 + i * 60, height: 80 + i * 60, left: '50%', top: '50%', marginLeft: -((80 + i * 60) / 2), marginTop: -((80 + i * 60) / 2) }}
                            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                          />
                        ))}
                      </>
                    )}

                    <div className={`absolute inset-6 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                      geoVerified
                        ? "border-saudi-green bg-saudi-green/10"
                        : geoLoading
                        ? "border-saudi-green/50 bg-saudi-green/5 animate-pulse"
                        : "border-gray-200 bg-warm-gray"
                    }`}>
                      {geoVerified ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle className="w-10 h-10 text-saudi-green" />
                        </motion.div>
                      ) : (
                        <MapPin className={`w-10 h-10 ${geoLoading ? "text-saudi-green animate-bounce" : "text-gray-400"}`} />
                      )}
                    </div>
                  </div>

                  {geoVerified ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-center gap-2 text-saudi-green font-semibold">
                        <BadgeCheck className="w-5 h-5" />
                        Location Verified!
                      </div>
                      <p className="text-xs text-gray-400">You are confirmed at {business.name}, {business.city}</p>
                      <button
                        onClick={() => setStep(1)}
                        className="w-full bg-saudi-green text-white font-semibold py-3 rounded-xl hover:bg-saudi-green-dark transition-colors flex items-center justify-center gap-2"
                      >
                        Continue to Rating
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleGeoVerify}
                        disabled={geoLoading}
                        className="w-full bg-saudi-green text-white font-semibold py-3 rounded-xl hover:bg-saudi-green-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {geoLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Verifying Location...
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            Enable Location
                          </>
                        )}
                      </button>
                      <div className="flex items-center gap-1.5 justify-center text-xs text-gray-400">
                        <Shield className="w-3.5 h-3.5" />
                        Your location is only used once for verification
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Rating */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={stepTransition.initial}
                animate={stepTransition.animate}
                exit={stepTransition.exit}
                transition={stepTransition.transition}
                className="space-y-4"
              >
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Rate Your Experience</h2>
                  <p className="text-sm text-gray-500 mb-5">How was your visit to {business.name}?</p>

                  {/* Overall rating */}
                  <div className="text-center mb-6 p-4 bg-warm-gray rounded-xl">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Overall Rating</p>
                    <StarRating
                      value={overallRating}
                      onChange={setOverallRating}
                      size="lg"
                      className="justify-center"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      {overallRating === 0 ? "Tap to rate" : overallRating === 5 ? "Exceptional!" : overallRating === 4 ? "Great!" : overallRating === 3 ? "Good" : overallRating === 2 ? "Fair" : "Poor"}
                    </p>
                  </div>

                  {/* Category ratings */}
                  <div className="space-y-4">
                    {categoryLabels.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{cat.emoji}</span>
                          <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                        </div>
                        <StarRating
                          value={catRatings[cat.name] || 0}
                          onChange={(v) => setCatRatings((prev) => ({ ...prev, [cat.name]: v }))}
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Write a Review (optional)</p>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell others about your experience..."
                    rows={4}
                    className="w-full text-sm text-gray-700 placeholder:text-gray-400 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-saudi-green/30 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{reviewText.length}/500</p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!canProceedStep2}
                  className="w-full bg-saudi-green text-white font-semibold py-3.5 rounded-xl hover:bg-saudi-green-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <BadgeCheck className="w-4 h-4" />
                  Submit Verified Review
                </button>

                {!canProceedStep2 && (
                  <p className="text-xs text-center text-gray-400">
                    Please set an overall rating and at least 3 category ratings
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={stepTransition.initial}
                animate={stepTransition.animate}
                exit={stepTransition.exit}
                transition={stepTransition.transition}
                className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 bg-saudi-green/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-saudi-green" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Published!</h2>
                  <p className="text-gray-500 text-sm mb-2">
                    Your Nafath-verified review for <span className="font-semibold text-gray-700">{business.name}</span> is now live.
                  </p>
                  <div className="flex items-center justify-center gap-1.5 text-saudi-green text-sm font-medium mb-6">
                    <BadgeCheck className="w-4 h-4" />
                    Nafath Verified · Geofence Confirmed
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/business/${business.id}`}
                      className="flex-1 bg-saudi-green text-white font-semibold py-3 rounded-xl hover:bg-saudi-green-dark transition-colors text-sm"
                    >
                      View Business Profile
                    </Link>
                    <Link
                      href="/explore"
                      className="flex-1 bg-warm-gray text-gray-700 font-semibold py-3 rounded-xl hover:bg-warm-gray-2 transition-colors text-sm border border-gray-200"
                    >
                      Explore More
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
