"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, QrCode, Download, MessageSquare, Building, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Business {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  overallScore: string;
  reviewCount: number;
  tier: string;
  verified: boolean;
}

interface Review {
  id: string;
  overallRating: number;
  text?: string | null;
  createdAt: string;
  userName?: string | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});

  const loadData = useCallback(async (biz: Business) => {
    const res = await fetch(`/api/businesses/${biz.id}/reviews`);
    const data = await res.json() as { reviews?: Review[] };
    setReviews(data.reviews ?? []);

    // Generate QR code
    try {
      const QRCode = (await import("qrcode")).default;
      const url = `${window.location.origin}/business/${biz.slug}`;
      const dataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2 });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard");
      return;
    }
    if (status !== "authenticated") return;

    async function fetchBusiness() {
      try {
        const res = await fetch("/api/admin/businesses");
        const data = await res.json() as { businesses?: Business[] };
        const userId = (session?.user as { id?: string })?.id;
        const myBusiness = (data.businesses ?? []).find(
          (b: Business & { ownerId?: string }) => b.ownerId === userId
        );
        if (myBusiness) {
          setBusiness(myBusiness);
          await loadData(myBusiness);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, [status, session, router, loadData]);

  async function handleReply(reviewId: string) {
    if (!business) return;
    const text = replyText[reviewId]?.trim();
    if (!text) return;

    setReplyLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await fetch(`/api/businesses/${business.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, text }),
      });
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
    } catch (err) {
      console.error(err);
    } finally {
      setReplyLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  }

  function downloadQr() {
    if (!qrDataUrl || !business) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${business.slug}-qr.png`;
    a.click();
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-saudi-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Business Found</h2>
          <p className="text-gray-500 mb-6">You don&apos;t have a business registered yet.</p>
          <Link
            href="/business/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-saudi-green text-white rounded-xl font-semibold hover:bg-saudi-green-dark transition-colors"
          >
            Register Your Business
          </Link>
        </div>
      </div>
    );
  }

  const score = parseFloat(business.overallScore) || 0;

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
          {business.nameAr && <p className="text-xl text-gray-500 mt-1 font-arabic">{business.nameAr}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-saudi-green" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Overall Score</span>
            </div>
            <p className="text-4xl font-bold text-saudi-green">{score.toFixed(1)}</p>
            <p className="text-sm text-gray-400 mt-1">out of 5.0</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-saudi-green" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Total Reviews</span>
            </div>
            <p className="text-4xl font-bold text-gray-900">{business.reviewCount}</p>
            <p className="text-sm text-gray-400 mt-1">verified reviews</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-saudi-green" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Tier</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 capitalize">{business.tier}</p>
            <p className="text-sm text-gray-400 mt-1">{business.verified ? "Verified" : "Unverified"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-5 h-5 text-saudi-green" />
              <h3 className="font-bold text-gray-900">Review QR Code</h3>
            </div>
            {qrDataUrl ? (
              <div className="flex flex-col items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR code" className="w-48 h-48" />
                <button
                  onClick={downloadQr}
                  className="flex items-center gap-2 px-4 py-2 bg-saudi-green text-white rounded-lg text-sm font-medium hover:bg-saudi-green-dark transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download QR
                </button>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                Generating QR code...
              </div>
            )}
          </div>

          {/* Stats placeholder */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link
                href={`/business/${business.slug}`}
                className="flex items-center gap-3 p-3 bg-warm-gray rounded-xl hover:bg-warm-gray-2 transition-colors"
              >
                <Building className="w-4 h-4 text-saudi-green" />
                <span className="text-sm font-medium">View Public Profile</span>
              </Link>
              <Link
                href="/business/register"
                className="flex items-center gap-3 p-3 bg-warm-gray rounded-xl hover:bg-warm-gray-2 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-saudi-green" />
                <span className="text-sm font-medium">Register Another Business</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-card">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Recent Reviews</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {reviews.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No reviews yet</div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">
                        {review.userName ?? "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.overallRating ? "text-warm-gold fill-warm-gold" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.text && <p className="text-gray-600 text-sm mb-3">{review.text}</p>}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Reply to this review..."
                      value={replyText[review.id] ?? ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({ ...prev, [review.id]: e.target.value }))
                      }
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saudi-green/20 focus:border-saudi-green"
                    />
                    <button
                      onClick={() => handleReply(review.id)}
                      disabled={replyLoading[review.id]}
                      className="px-4 py-2 bg-saudi-green text-white rounded-lg text-sm font-medium hover:bg-saudi-green-dark transition-colors disabled:opacity-60"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
