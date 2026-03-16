"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CheckCircle, ChevronRight, Building, MapPin, Star } from "lucide-react";

const sectors = [
  { value: "telecom", label: "Telecom" },
  { value: "banking", label: "Banking" },
  { value: "food", label: "Food & Dining" },
  { value: "retail", label: "Retail" },
  { value: "automotive", label: "Automotive" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "hospitality", label: "Hospitality" },
  { value: "other", label: "Other" },
];

const cities = [
  { value: "riyadh", label: "Riyadh" },
  { value: "jeddah", label: "Jeddah" },
  { value: "dammam", label: "Dammam" },
  { value: "mecca", label: "Mecca" },
  { value: "medina", label: "Medina" },
  { value: "khobar", label: "Al Khobar" },
  { value: "taif", label: "Taif" },
  { value: "abha", label: "Abha" },
];

const tiers = [
  {
    value: "free",
    label: "Free",
    price: "SAR 0/mo",
    features: ["Basic profile", "Unlimited reviews", "QR code"],
  },
  {
    value: "pro",
    label: "Pro",
    price: "SAR 299/mo",
    features: ["Everything in Free", "Analytics dashboard", "Priority listing", "Response tools"],
  },
  {
    value: "enterprise",
    label: "Enterprise",
    price: "Custom",
    features: ["Everything in Pro", "Dedicated support", "API access", "White-label options"],
  },
];

const steps = [
  { id: 1, label: "Business Info", icon: Building },
  { id: 2, label: "Location", icon: MapPin },
  { id: 3, label: "Choose Plan", icon: Star },
];

export default function BusinessRegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    businessNameAr: "",
    ownerName: "",
    contactEmail: session?.user?.email ?? "",
    contactPhone: "",
    sector: "",
    city: "",
    tier: "free",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!session?.user) {
      router.push("/auth/login?callbackUrl=/business/register");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Submission failed");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-saudi-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-card p-10">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-saudi-green" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-500 mb-6">
              We&apos;ve received your registration request for <strong>{form.businessName}</strong>.
              Our team will review and get back to you within 2-3 business days.
            </p>
            <div className="bg-warm-gray rounded-xl p-4 text-sm text-gray-600 text-left space-y-2 mb-6">
              <p><strong>Next steps:</strong></p>
              <p>1. Our team reviews your application</p>
              <p>2. We verify your business details</p>
              <p>3. Your profile goes live on Taqyeem</p>
              <p>4. You can start managing reviews</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-saudi-green text-white rounded-xl font-semibold hover:bg-saudi-green-dark transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Register Your Business</h1>
          <p className="text-gray-500 mt-2">Join Saudi Arabia&apos;s trusted review platform</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  step === s.id
                    ? "bg-saudi-green text-white"
                    : step > s.id
                    ? "bg-green-100 text-saudi-green"
                    : "bg-white text-gray-400 border border-gray-200"
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-300" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saudi-green/20 focus:border-saudi-green transition-colors"
                  placeholder="e.g. Al Rajhi Bank"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name (Arabic)
                </label>
                <input
                  type="text"
                  value={form.businessNameAr}
                  onChange={(e) => update("businessNameAr", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saudi-green/20 focus:border-saudi-green transition-colors font-arabic"
                  placeholder="مصرف الراجحي"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.ownerName}
                  onChange={(e) => update("ownerName", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saudi-green/20 focus:border-saudi-green transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.contactEmail}
                  onChange={(e) => update("contactEmail", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saudi-green/20 focus:border-saudi-green transition-colors"
                  placeholder="business@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => update("contactPhone", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saudi-green/20 focus:border-saudi-green transition-colors"
                  placeholder="+966 50 000 0000"
                />
              </div>

              <button
                onClick={() => {
                  if (!form.businessName || !form.ownerName || !form.contactEmail) {
                    setError("Business Name, Your Name, and Contact Email are required");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                className="w-full py-3 bg-saudi-green text-white rounded-xl font-semibold hover:bg-saudi-green-dark transition-colors flex items-center justify-center gap-2"
              >
                Next: Location
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                <select
                  value={form.sector}
                  onChange={(e) => update("sector", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saudi-green/20 focus:border-saudi-green transition-colors"
                >
                  <option value="">Select sector...</option>
                  {sectors.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saudi-green/20 focus:border-saudi-green transition-colors"
                >
                  <option value="">Select city...</option>
                  {cities.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-sm text-gray-500 bg-warm-gray rounded-lg p-3">
                Precise geofence coordinates can be configured after approval.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-warm-gray transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-saudi-green text-white rounded-xl font-semibold hover:bg-saudi-green-dark transition-colors flex items-center justify-center gap-2"
                >
                  Next: Plan
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Plan */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>

              <div className="grid grid-cols-1 gap-3">
                {tiers.map((tier) => (
                  <button
                    key={tier.value}
                    onClick={() => update("tier", tier.value)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      form.tier === tier.value
                        ? "border-saudi-green bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">{tier.label}</span>
                      <span className="font-semibold text-saudi-green">{tier.price}</span>
                    </div>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-saudi-green shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              {!session?.user && (
                <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
                  You must be signed in to submit.{" "}
                  <Link href="/auth/login?callbackUrl=/business/register" className="underline font-medium">
                    Sign in here
                  </Link>
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-warm-gray transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-saudi-green text-white rounded-xl font-semibold hover:bg-saudi-green-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
