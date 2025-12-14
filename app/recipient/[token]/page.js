"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function RecipientPage() {
  const { token } = useParams();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const res = await fetch(`/api/recipient/${token}`);
        const data = await res.json();
        if (res.ok) {
          setCapsule(data.capsule);
        } else {
          setError(data.error || "Failed to load capsule");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCapsule();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-bg text-charcoal font-display p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="min-h-screen bg-cream-bg text-charcoal font-display p-8 flex items-center justify-center">
        <p className="text-red-500">{error || "Capsule not found"}</p>
      </div>
    );
  }

  const isUnlocked = new Date(capsule.unlockDate) <= new Date();

  return (
    <div className="min-h-screen bg-cream-bg text-charcoal font-display p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{capsule.title}</h1>
        <p className="text-gray-600 mb-6">
          Unlocks on {new Date(capsule.unlockDate).toLocaleDateString()}
        </p>

        {isUnlocked ? (
          <div className="space-y-6">
            {/* Letter */}
            {capsule.letter && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Letter</h2>
                <div className="rounded-lg border border-border-warm bg-surface-card p-6 shadow-sm">
                  <p className="text-charcoal whitespace-pre-wrap">{capsule.letter}</p>
                </div>
              </div>
            )}

            {/* Memories */}
            {capsule.memories && capsule.memories.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Memories</h2>
                <ul className="space-y-3">
                  {capsule.memories.map((m) => (
                    <li key={m.id} className="rounded-lg border border-border-warm bg-surface-card p-4 shadow-sm">
                      <p className="font-medium text-sm text-gray-500 uppercase mb-1">{m.type}</p>
                      {m.caption && <p className="text-charcoal mb-2">{m.caption}</p>}
                      <a 
                        href={m.contentUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-coral-red underline text-sm hover:text-red-400"
                      >
                        View Content
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(!capsule.letter || !capsule.memories || capsule.memories.length === 0) && (
              <p className="text-gray-500">This capsule is unlocked but has no content yet.</p>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-border-warm bg-surface-card p-8 shadow-sm text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-lg font-semibold text-charcoal mb-2">This capsule is locked</p>
            <p className="text-gray-600">
              It will unlock on {new Date(capsule.unlockDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
