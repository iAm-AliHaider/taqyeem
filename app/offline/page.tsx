"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-warm-gray flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-saudi-green rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-4xl font-bold">ت</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">You are offline</h1>
        <p className="text-gray-500 mb-6">
          Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-saudi-green text-white rounded-xl font-semibold hover:bg-saudi-green-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
