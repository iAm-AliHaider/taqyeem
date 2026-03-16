"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Building, Star, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";

interface RegRequest {
  id: string;
  businessName: string;
  businessNameAr?: string | null;
  sector?: string | null;
  city?: string | null;
  contactEmail: string;
  contactPhone?: string | null;
  ownerName?: string | null;
  tier: string;
  status: string;
  createdAt: string;
}

interface Business {
  id: string;
  name: string;
  sector?: string | null;
  city?: string | null;
  overallScore: string;
  reviewCount: number;
  tier: string;
  status: string;
  verified: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [requests, setRequests] = useState<RegRequest[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/admin");
      return;
    }
    const role = (session?.user as { role?: string })?.role;
    if (status === "authenticated" && role !== "admin") {
      router.push("/");
      return;
    }
    if (status !== "authenticated") return;

    async function loadData() {
      try {
        const [reqRes, bizRes] = await Promise.all([
          fetch("/api/admin/registrations"),
          fetch("/api/admin/businesses"),
        ]);
        const reqData = await reqRes.json() as { requests?: RegRequest[] };
        const bizData = await bizRes.json() as { businesses?: Business[] };
        setRequests(reqData.requests ?? []);
        setBusinesses(bizData.businesses ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [status, session, router]);

  async function handleAction(id: string, action: "approved" | "rejected") {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
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

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-card text-center">
            <p className="text-3xl font-bold text-saudi-green">{requests.length}</p>
            <p className="text-sm text-gray-500 mt-1">Pending Registrations</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-card text-center">
            <p className="text-3xl font-bold text-gray-900">{businesses.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Businesses</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-card text-center">
            <p className="text-3xl font-bold text-gray-900">
              {businesses.filter((b) => b.status === "active").length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Active</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-card text-center">
            <p className="text-3xl font-bold text-gray-900">
              {businesses.filter((b) => b.verified).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Verified</p>
          </div>
        </div>

        {/* Pending Registration Requests */}
        <div className="bg-white rounded-2xl shadow-card mb-8">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-warm-gold" />
            <h2 className="font-bold text-gray-900">Pending Registration Requests</h2>
            <span className="ml-auto bg-warm-gold/10 text-warm-gold text-xs font-bold px-2 py-1 rounded-full">
              {requests.length}
            </span>
          </div>
          {requests.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No pending requests</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.map((req) => (
                <div key={req.id} className="p-6 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{req.businessName}</h3>
                      {req.businessNameAr && (
                        <span className="text-gray-500 font-arabic text-sm">
                          {req.businessNameAr}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 space-y-0.5">
                      {req.ownerName && <p>Owner: {req.ownerName}</p>}
                      <p>Email: {req.contactEmail}</p>
                      {req.contactPhone && <p>Phone: {req.contactPhone}</p>}
                      {req.sector && <p>Sector: {req.sector}</p>}
                      {req.city && <p>City: {req.city}</p>}
                      <p>Tier: <span className="capitalize font-medium">{req.tier}</span></p>
                      <p>Submitted: {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(req.id, "approved")}
                      disabled={actionLoading[req.id]}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-saudi-green border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-60"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "rejected")}
                      disabled={actionLoading[req.id]}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-60"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Business List */}
        <div className="bg-white rounded-2xl shadow-card">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <Building className="w-5 h-5 text-saudi-green" />
            <h2 className="font-bold text-gray-900">All Businesses</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Sector</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">City</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Score</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Reviews</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {businesses.map((biz) => (
                  <tr key={biz.id} className="hover:bg-warm-gray transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{biz.name}</td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{biz.sector ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{biz.city ?? "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-warm-gold" />
                        <span>{parseFloat(biz.overallScore).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{biz.reviewCount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          biz.status === "active"
                            ? "bg-green-100 text-green-700"
                            : biz.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {biz.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{biz.tier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {businesses.length === 0 && (
              <div className="p-12 text-center text-gray-400">No businesses yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
