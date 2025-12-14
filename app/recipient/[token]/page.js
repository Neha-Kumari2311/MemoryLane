"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Share2, ArrowLeft, Heart, Send, Play, MapPin, Lock, Unlock } from 'lucide-react';

export default function RecipientPage() {
  const { token } = useParams();
  const router = useRouter();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  const handleDownload = () => {
    if (!capsule) return;

    let text = `Memory Capsule: ${capsule.title}\n`;
    text += `Unlocked on: ${new Date(capsule.unlockDate).toDateString()}\n\n`;

    if (capsule.letter) {
      text += `--- LETTER ---\n${capsule.letter}\n\n`;
    }

    if (capsule.memories?.length) {
      text += `--- MEMORIES ---\n`;
      capsule.memories.forEach((m, i) => {
        text += `${i + 1}. ${m.type.toUpperCase()}\n`;
        if (m.caption) text += `Caption: ${m.caption}\n`;
        text += `Link: ${m.contentUrl}\n\n`;
      });
    }

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${capsule.title.replace(/\s+/g, "_")}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleSaveNote = () => {
    localStorage.setItem(`note-${token}`, noteText);
    setNoteSaved(true);
    setTimeout(() => {
      setShowNoteModal(false);
      setNoteSaved(false);
      setNoteText("");
    }, 1200);
  };

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
      <div className="min-h-screen bg-[#FFF8F0] dark:bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF6F61] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your memories...</p>
        </div>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] dark:bg-stone-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">✕</span>
          </div>
          <p className="text-gray-800 dark:text-white font-bold text-lg mb-2">Oops!</p>
          <p className="text-gray-600 dark:text-gray-400">{error || "Capsule not found"}</p>
        </div>
      </div>
    );
  }

  const isUnlocked = new Date(capsule.unlockDate) <= new Date();
  const photos = capsule.memories?.filter(m => m.type === 'photo') || [];
  const videos = capsule.memories?.filter(m => m.type === 'video') || [];
  const voiceNotes = capsule.memories?.filter(m => m.type === 'voice') || [];

  return (
    <div className="min-h-screen dark:bg-stone-900 text-gray-800 dark:text-white font-sans transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center bg-white/90 dark:bg-stone-900/90 p-4 pb-2 justify-between border-b border-rose-200/40 dark:border-gray-800/50 backdrop-blur-md">
        <button 
          onClick={() => router.back()}
          className="text-gray-800 dark:text-white flex w-12 h-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>   <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500">⏳</div>
            <h1 className="text-base font-semibold text-gray-900">MemoryLane</h1>
          </div>
        <div className="flex w-12 items-center justify-end">
          {/* Placeholder for symmetry */}
        </div>
      </div>

      {!isUnlocked ? (
        /* Locked State */
        <div className="p-4 sm:p-6 max-w-2xl mx-auto">
          <div 
            className="relative flex min-h-90 flex-col gap-6 overflow-hidden rounded-2xl bg-cover bg-center items-center justify-center p-8 text-center shadow-xl"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255, 111, 97, 0.9) 0%, rgba(255, 111, 97, 0.7) 50%, rgba(255, 184, 178, 0.8) 100%), url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200)`,
              backgroundBlendMode: 'overlay'
            }}
          >
            <div className="flex flex-col gap-4 z-10 w-full max-w-md">
              <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm">
                <Lock className="text-black" size={40} />
              </div>
              <h1 className="text-black text-3xl sm:text-4xl font-black tracking-tight drop-shadow-lg">
                {capsule.title}
              </h1>
              <p className="text-black text-lg font-semibold mb-2 drop-shadow">This capsule is locked</p>
              <p className="text-black text-base drop-shadow">
                It will unlock on {new Date(capsule.unlockDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section - Unlocked */}
          <div className="p-4 sm:p-6 max-w-2xl mx-auto">
            <div 
              className="relative flex min-h-70 flex-col gap-4 overflow-hidden rounded-2xl bg-cover bg-center items-center justify-end p-6 text-center shadow-xl"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(255, 111, 97, 0.85) 0%, rgba(255, 111, 97, 0.6) 50%, rgba(255, 184, 178, 0.7) 100%), url(${photos.length > 0 ? photos[0].contentUrl : 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200'})`,
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="flex flex-col gap-2 z-10 w-full">
                <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm">
                  <Unlock className="text-black" size={24} />
                </div>
                <h1 className="text-black text-2xl sm:text-4xl font-black tracking-tight drop-shadow-lg">
                  {capsule.title}
                </h1>
                <p className="text-black text-sm font-medium drop-shadow">
                  Unlocked on {new Date(capsule.unlockDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <button className="mt-2 flex w-full max-w-65 items-center justify-center rounded-xl h-11 bg-white/95 hover:bg-white transition-colors text-[#FF6F61] text-sm font-bold shadow-lg">
                Save Memories
              </button>
            </div>
          </div>

          {/* Letter Section */}
          {capsule.letter && (
            <div className="flex flex-col mt-4 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold tracking-tight px-4 pb-3">A Letter for You</h2>
              <div className="px-4">
                <div className="bg-white dark:bg-stone-800 p-5 rounded-xl shadow-sm border border-stone-200 dark:border-gray-800">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6F61] dark:text-gray-400">Personal Note</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
                    {capsule.letter}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Photos Section */}
          {photos.length > 0 && (
            <div className="flex flex-col mt-6">
              <div className="flex items-center justify-between px-4 pb-3">
                <h2 className="text-xl font-bold tracking-tight">Photos</h2>
                {photos.length > 3 && (
                  <button className="text-[#FF6F61] text-sm font-semibold active:opacity-70">See All</button>
                )}
              </div>
              <div className="flex overflow-x-auto gap-3 px-4 pb-4 snap-x" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                {photos.map((photo) => (
                  <a 
                    key={photo.id}
                    href={photo.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 snap-center w-60 h-75 rounded-xl bg-gray-800 overflow-hidden relative group"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${photo.contentUrl})` }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                    {photo.caption && (
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="font-semibold text-base mb-1 line-clamp-2">{photo.caption}</p>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Video Section */}
          {videos.length > 0 && (
            <div className="flex flex-col mt-6 px-4 gap-4 max-w-2xl mx-auto">
              {videos.map((video) => (
                <div key={video.id}>
                  <h2 className="text-xl font-bold tracking-tight pb-3">Video Message</h2>
                  <a
                    href={video.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full aspect-video rounded-xl bg-gray-800 overflow-hidden shadow-sm group cursor-pointer block"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${video.contentUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="flex w-14 h-14 items-center justify-center rounded-full bg-[#FF6F61]/90 text-white backdrop-blur-sm shadow-xl group-hover:scale-105 transition-transform">
                        <Play className="ml-0.5" size={28} fill="white" />
                      </button>
                    </div>
                    {video.caption && (
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded text-white text-sm font-medium">
                        {video.caption}
                      </div>
                    )}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Voice Note */}
          {voiceNotes.length > 0 && (
            <div className="mt-6 px-4 gap-4 max-w-2xl mx-auto">
              {voiceNotes.map((voice) => (
                <div key={voice.id}>
                  <h2 className="text-xl font-bold tracking-tight pb-3">Voice Note</h2>
                  <div className="bg-white dark:bg-stone-800 p-4 rounded-xl flex items-center gap-3 shadow-sm border border-stone-200 dark:border-gray-800">
                    <a
                      href={voice.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-[#FF6F61] text-white shadow-lg hover:bg-[#FF6F61]/90 transition-colors"
                    >
                      <Play size={22} fill="white" />
                    </a>
                    <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold truncate">{voice.caption || 'Voice Note'}</span>
                      </div>
                      <div className="flex items-end gap-0.5 h-5 w-full opacity-80">
                        {[40, 70, 100, 60, 30, 80, 50, 40, 70, 30, 60, 50, 40, 20, 40, 60, 40, 20].map((height, i) => (
                          <div 
                            key={i}
                            className={`w-1 rounded-full ${i < 4 ? 'bg-[#FF6F61] animate-pulse' : 'bg-rose-200 dark:bg-gray-600'}`}
                            style={{ 
                              height: `${height}%`,
                              animationDelay: i < 4 ? `${i * 50}ms` : '0ms'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {(!capsule.letter && photos.length === 0 && videos.length === 0 && voiceNotes.length === 0) && (
            <div className="px-4 py-12 max-w-2xl mx-auto">
              <div className="bg-white dark:bg-stone-800 rounded-xl p-8 text-center border border-stone-200 dark:border-gray-800">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📦</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400">This capsule is unlocked but has no content yet.</p>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="fixed bottom-0 left-0 w-full p-4 bg-linear-to-t from-[#FFF8F0] via-[#FFF8F0]/95 to-transparent dark:from-stone-900 dark:via-stone-900/95 dark:to-transparent z-40 pointer-events-none pb-6">
            <div className="pointer-events-auto flex gap-2.5 max-w-2xl mx-auto">
              {/* Download Memories */}
              <button
                onClick={handleDownload}
                className="flex-1 h-11 rounded-xl bg-white dark:bg-stone-800 text-[#FF6F61] font-semibold text-sm shadow-md border border-rose-200 dark:border-gray-700 flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:bg-stone-50 dark:hover:bg-gray-700"
              >
                <span>📥</span>
                <span>Download</span>
              </button>

              {/* Write a Memory Note */}
              <button
                onClick={() => setShowNoteModal(true)}
                className="flex-1 h-11 rounded-xl bg-[#FF6F61]/90 hover:bg-[#FF6F61] text-white font-semibold text-sm shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>📝</span>
                <span>Write Note</span>
              </button>

              {/* Loved indicator */}
              <div className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-stone-800 shadow-md border border-stone-200 dark:border-gray-800 flex items-center justify-center">
                <Heart className="text-[#FF6F61]" size={22} fill="#FF6F61" />
              </div>
            </div>
          </div>

          <div className="h-20" />
        </>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-3">Write a Memory Note</h3>

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="What did this capsule make you feel?"
              className="w-full h-32 rounded-xl border border-stone-300 dark:border-gray-700 bg-stone-50 dark:bg-stone-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F61]"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-stone-200 dark:bg-gray-700 hover:bg-stone-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 text-sm rounded-lg bg-[#FF6F61] text-white font-semibold hover:bg-[#FF6F61]/90 transition-colors"
              >
                {noteSaved ? "Saved ✓" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}