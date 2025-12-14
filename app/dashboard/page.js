"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [capsules, setCapsules] = useState([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const res = await fetch("/api/capsules")
        const data = await res.json()

        if (res.ok) {
          setCapsules(data.capsules)
          setUserName(data.user?.name || data.userName || "Friend")
        } else if (res.status === 401) {
          router.push("/login")
        }
      } catch (err) {
        console.error("Failed to load capsules", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCapsules()
  }, [router])

  const now = new Date()
  const upcoming = capsules.filter((c) => new Date(c.unlockDate) > now)
  const unlocked = capsules.filter((c) => new Date(c.unlockDate) <= now)

  const getTimeRemaining = (unlockDate) => {
    const diff = new Date(unlockDate) - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) {
      const remainingMonths = months % 12
      return `${years} Year${years > 1 ? "s" : ""}, ${remainingMonths} Month${remainingMonths !== 1 ? "s" : ""}`
    } else if (months > 0) {
      return `${months} Month${months > 1 ? "s" : ""}`
    } else if (days > 0) {
      return `${days} Day${days > 1 ? "s" : ""}`
    }
    return "Today"
  }

  const getUnlockedTimeAgo = (unlockDate) => {
    const now = new Date()
    const unlock = new Date(unlockDate)
    const diffMs = now - unlock
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`
      }
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return months === 1 ? "1 month ago" : `${months} months ago`
    } else {
      const years = Math.floor(diffDays / 365)
      return years === 1 ? "1 year ago" : `${years} years ago`
    }
  }

  return (
    <div className="min-h-screen w-full bg-cream-bg text-[#3E3E3E] font-sans pb-20" style={{ fontFamily: "sans-serif" }}>
      {/* Header */}
      <header className=" border-b sticky top-0 z-50">
        <div className="flex items-center justify-center px-4 py-3 relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500">⏳</div>
            <h1 className="text-base font-semibold text-gray-900">MemoryLane</h1>
          </div>
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center absolute right-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Greeting */}
      <section className="px-4 pt-5 pb-4">
        <h2 className="text-2xl font-bold mb-1">Hello, {userName} </h2>
        <p className="text-sm text-gray-400">Preserving {capsules.length} moments for the future.</p>
      </section>

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-100 rounded-md p-5 flex flex-col items-center">
            <div className="w-8 h-8 bg-red-200 rounded-md flex items-center justify-center text-red-600 mb-2 ">💊</div>
            <p className="text-2xl font-bold text-gray-900">{capsules.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Capsules</p>
          </div>

          <div className="bg-red-100 rounded-md p-4 flex flex-col items-center">
            <div className="w-8 h-8 bg-red-200 rounded-md flex items-center justify-center text-red-600 mb-2">🔓</div>
            <p className="text-2xl font-bold text-gray-900">{unlocked.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Unlocked</p>
          </div>
        </div>
      </div>

      {/* Ready to View */}
      <section className="mb-6">
        <div className="flex justify-between items-center px-4 mb-3">
          <h3 className="text-base font-semibold text-gray-900">Ready to View</h3>
        </div>

        <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-thin">
          {unlocked.map((capsule) => (
            <div
              key={capsule.id}
              onClick={() => router.push(`/capsules/${capsule.id}`)}
              className="min-w-50  rounded-2xl bg-white border border-gray-200 overflow-hidden cursor-pointer shrink-0"
            >
              <div className="h-32 bg-linear-to-br from-pink-200 to-red-200 relative"></div>

              <div className="p-5">
                <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">{capsule.title}</h4>
                <p className="text-xs text-gray-400">Unlocked {getUnlockedTimeAgo(capsule.unlockDate)}</p>
              </div>
            </div>
          ))}

          {unlocked.length === 0 && <p className="text-sm text-gray-400 px-4">No unlocked capsules yet.</p>}
        </div>
      </section>

      {/* Sealed Memories */}
      <section className="px-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Sealed Memories</h3>

        <div className="space-y-3">
          {upcoming.map((capsule) => {
            const iconBg = ["bg-purple-100", "bg-pink-100", "bg-red-100"]
            const iconColor = ["text-purple-600", "text-pink-600", "text-red-600"]
            const randomIndex = Math.floor(Math.random() * 3)

            return (
              <div
                key={capsule.id}
                className="bg-gray-50 rounded-2xl p-4 cursor-pointer"
                onClick={() => router.push(`/capsules/${capsule.id}`)}
              >
                <div className="flex gap-3">
                  <div
                    className={`w-12 h-12 ${iconBg[randomIndex]} rounded-xl flex items-center justify-center ${iconColor[randomIndex]} text-xl shrink-0`}
                  >
                    🎓
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900 mb-0.5">{capsule.title}</h4>
                        <p className="text-xs text-gray-400">To: Future Self</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                        <span>🔒</span>
                        <span className="font-medium">LOCKED</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-gray-400 uppercase mb-0.5">Unlocks In</p>
                        <p className="font-semibold text-red-500">{getTimeRemaining(capsule.unlockDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 uppercase mb-0.5">Date</p>
                        <p className="font-medium text-gray-700">
                          {new Date(capsule.unlockDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {upcoming.length === 0 && <p className="text-sm text-gray-400">No upcoming capsules.</p>}
        </div>
      </section>

      {/* Floating Action Button */}
      <button
        onClick={() => router.push("/capsules/new")}
        className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-[#FF6F61] text-white text-3xl shadow-lg active:scale-95 transition-transform flex items-center justify-center"
        style={{ boxShadow: "0 4px 12px rgba(255, 111, 97, 0.4)" }}
      >
        +
      </button>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-100 h-16 flex justify-around items-center safe-area-bottom">
        <button className="flex flex-col items-center gap-1 text-[#FF6F61]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xs font-medium">Home</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-xs font-medium">Shared</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-medium">Settings</span>
        </button>
      </nav>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(239, 68, 68, 0.2);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(239, 68, 68, 0.3);
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  )
}
