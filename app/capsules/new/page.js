"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCapsulePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [letter, setLetter] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [unlockTime, setUnlockTime] = useState("00:00");
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const addRecipient = () => {
    if (newRecipient.trim() && newRecipient.includes("@")) {
      setRecipients([...recipients, newRecipient.trim()]);
      setNewRecipient("");
    }
  };

  const removeRecipient = (index) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine date and time into a single datetime string
      const unlockDateTime = unlockDate && unlockTime 
        ? `${unlockDate}T${unlockTime}:00` 
        : unlockDate;

      const res = await fetch("/api/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          unlockDate: unlockDateTime, 
          letter: letter || null,
          recipients,
          memories: memories.length > 0 ? memories : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert(data.error || "Failed to create capsule");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = async (type) => {
    if (type === "image" || type === "audio") {
      // Create a file input for image/audio upload
      const input = document.createElement("input");
      input.type = "file";
      input.accept = type === "image" ? "image/*" : "audio/*";
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
          // Upload to Cloudinary
          const formData = new FormData();
          formData.append("file", file);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const uploadData = await uploadRes.json();

          if (uploadRes.ok) {
            const caption = prompt(`Enter caption (optional) for ${type}:`);
            setMemories([
              ...memories,
              {
                type: type,
                contentUrl: uploadData.url,
                caption: caption || null,
              },
            ]);
          } else {
            alert(uploadData.error || `Failed to upload ${type}`);
          }
        } catch (error) {
          console.error("Upload error:", error);
          alert(`Failed to upload ${type}. Please try again.`);
        } finally {
          setUploading(false);
        }
      };
      input.click();
    } else {
      // For other types (video), use URL prompt
      const url = prompt(`Enter ${type} URL:`);
      if (url && url.trim()) {
        const caption = prompt("Enter caption (optional):");
        setMemories([
          ...memories,
          {
            type,
            contentUrl: url.trim(),
            caption: caption || null,
          },
        ]);
      }
    }
  };

  const removeMemory = (index) => {
    setMemories(memories.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-cream-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/dashboard">
            <button className="text-coral-red text-sm font-medium hover:text-red-400">
              Cancel
            </button>
          </Link>
          <h1 className="text-base font-semibold text-charcoal">New Capsule</h1>
          <div className="w-12"></div> {/* Spacer for alignment */}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* The Basics Section */}
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-charcoal">The Basics</h2>

            {/* Capsule Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                Capsule Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-gray-400 focus:border-coral-red focus:outline-none focus:ring-1 focus:ring-coral-red bg-gray-50"
                placeholder="e.g., Trip to Paris 2024"
                required
              />
            </div>
            {/* Write a Letter */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                Write a Letter
              </label>
              <textarea
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-gray-400 focus:border-coral-red focus:outline-none focus:ring-1 focus:ring-coral-red bg-gray-50 resize-none"
                placeholder="Dear ..."
              />
              <p className="text-xs text-gray-500 mt-2">
                This letter will be revealed when the capsule unlocks.
              </p>
            </div>

            {/* Unlock Date & Time */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                Unlock Date & Time
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="date"
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal focus:border-coral-red focus:outline-none focus:ring-1 focus:ring-coral-red bg-gray-50 pr-10"
                    placeholder="mm/dd/yyyy"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-coral-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="time"
                    value={unlockTime}
                    onChange={(e) => setUnlockTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal focus:border-coral-red focus:outline-none focus:ring-1 focus:ring-coral-red bg-gray-50 pr-10"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-coral-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This capsule will unlock at the specified date and time.
              </p>
            </div>
          </div>

          {/* Recipients Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal">Recipients</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                Who is this for?
              </label>

              {/* Add Recipient Input */}
              <div className="relative mb-3">
                <input
                  type="email"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addRecipient())
                  }
                  className="w-full rounded-lg border border-gray-200 p-3 pr-12 text-sm text-charcoal placeholder:text-gray-400 focus:border-coral-red focus:outline-none focus:ring-1 focus:ring-coral-red bg-gray-50"
                  placeholder="Add email address"
                />
                <button
                  type="button"
                  onClick={addRecipient}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-coral-red rounded-full flex items-center justify-center text-white hover:bg-red-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              {/* Recipients List */}
              {recipients.length > 0 && (
                <div className="space-y-2">
                  {recipients.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                    >
                      <span className="text-sm text-charcoal">{email}</span>
                      <button
                        type="button"
                        onClick={() => removeRecipient(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Memories Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-charcoal">Add Memories</h2>
              <span className="text-xs text-gray-500">
                {memories.length} added
              </span>
            </div>

            {/* Memories List */}
            {memories.length > 0 && (
              <div className="space-y-2">
                {memories.map((memory, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {memory.type === "image" && memory.contentUrl && (
                        <img
                          src={memory.contentUrl}
                          alt={memory.caption || "Memory"}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      {memory.type === "audio" && (
                        <div className="w-12 h-12 bg-coral-red/10 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-coral-red"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal">
                          {memory.type.toUpperCase()}
                        </p>
                        {memory.caption && (
                          <p className="text-xs text-gray-500">{memory.caption}</p>
                        )}
                        <p className="text-xs text-gray-400 truncate max-w-xs">
                          {memory.contentUrl}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMemory(index)}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Media Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleAddMemory("audio")}
                disabled={uploading}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-full bg-coral-red/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-coral-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-charcoal">
                  {uploading ? "Uploading..." : "Audio"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleAddMemory("image")}
                disabled={uploading}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-full bg-coral-red/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-coral-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 11a2 2 0 100-4 2 2 0 000 4z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 15l-5-5L5 21"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-charcoal">
                  {uploading ? "Uploading..." : "Image"}
                </span>
              </button>
            </div>

            {/* Seal Capsule Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-coral-red py-3.5 text-base font-bold text-white shadow-lg shadow-coral-red/25 hover:bg-red-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
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
              <span>{loading ? "Creating..." : "Seal Capsule"}</span>
            </button>

            <p className="text-xs text-center text-gray-500 pt-2">
              Optional: Add memories to make your capsule even more special.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
