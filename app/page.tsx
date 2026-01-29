"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? parseInt(ttl) : undefined,
          max_views: maxViews ? parseInt(maxViews) : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        alert("Failed to create paste. Check constraints.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Pastebin-Lite</h1>

      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              required
              className="w-full h-40 p-3 border rounded-md bg-white text-black"
              placeholder="Paste your text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">TTL (seconds)</label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded-md bg-white text-black"
                placeholder="Optional"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Views</label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded-md bg-white text-black"
                placeholder="Optional"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Creating..." : "Create Paste"}
          </button>
        </form>
      ) : (
        <div className="p-6 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-medium mb-2">Paste created successfully!</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              className="flex-1 p-2 border rounded bg-white"
              value={result.url}
            />
            <button
              onClick={() => window.open(result.url, "_blank")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Open
            </button>
          </div>
          <button
            onClick={() => setResult(null)}
            className="mt-4 text-sm text-green-700 underline"
          >
            Create another
          </button>
        </div>
      )}
    </main>
  );
}