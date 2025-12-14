"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CapsuleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMemory, setNewMemory] = useState({ type: 'text', contentUrl: '', caption: '' });
  const [newRecipient, setNewRecipient] = useState('');

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const res = await fetch(`/api/capsules/${id}`);
        const data = await res.json();
        if (res.ok) {
          setCapsule(data.capsule);
        }
      } catch (err) {
        console.error("Failed to load capsule", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsule();
  }, [id]);

  const handleAddMemory = async () => {
    const res = await fetch(`/api/capsules/${id}/memories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMemory),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Memory added!");
      location.reload();
    } else {
      alert(data.error || "Failed to add memory");
    }
  };

  const handleAddRecipient = async () => {
    const res = await fetch(`/api/capsules/${id}/recipients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newRecipient }),
    });

    if (res.ok) {
      alert("Recipient added!");
      location.reload();
    } else {
      alert("Failed to add recipient");
    }
  };

  const handleDeleteCapsule = async () => {
    if (!confirm(`Are you sure you want to delete "${capsule.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/capsules/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Capsule deleted successfully");
        router.push("/dashboard");
      } else {
        alert(data.error || "Failed to delete capsule");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  );
  
  if (!capsule) return (
    <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center">
      <p className="text-white">Capsule not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1f3a] text-white font-sans pb-20">
      {/* Header */}
      <header >
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => router.push('/dashboard')} className="w-9 h-9 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-4xl font-bold">{capsule.title}</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDeleteCapsule}
              className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-500 transition-colors"
              title="Delete capsule"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Recipients */}
      {capsule.recipients && capsule.recipients.length > 0 && (
        <section className="px-6 py-4 bg-[#1a1f3a]">
          <div className="flex justify-center gap-2">
            {capsule.recipients.slice(0, 3).map((recipient, idx) => (
              <div key={recipient.id} className="w-12 h-12 rounded-full bg-linear-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm border-2 border-[#1a1f3a]">
                {recipient.email.charAt(0).toUpperCase()}
              </div>
            ))}
            {capsule.recipients.length > 3 && (
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs border-2 border-[#1a1f3a]">
                +{capsule.recipients.length - 3}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="px-4 py-4 space-y-6 max-w-2xl mx-auto">
        {/* Letter Section */}
        {capsule.letter && (
          <section>
            <h3 className="text-sm font-semibold mb-3 text-gray-300 uppercase tracking-wide">Letter</h3>
            <div className="bg-[#252b47] rounded-xl p-4 inline-block min-w-full">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {capsule.letter}
              </p>
            </div>
          </section>
        )}

        {/* Memories Section */}
        <section>
          <h2 className="text-base font-bold mb-4">Memories</h2>
          
          {capsule.memories && capsule.memories.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No memories yet. Add one below!
            </div>
          ) : (
            <div className="space-y-4">
              {capsule.memories && capsule.memories.map((memory) => (
                <div key={memory.id} className="bg-[#252b47] rounded-xl overflow-hidden">
                  {/* Memory Image/Content */}
                  {memory.type === 'image' && (
                    <div className="relative h-56 bg-linear-to-br from-orange-300 to-pink-400">
                      <img 
                        src={memory.contentUrl} 
                        alt={memory.caption || 'Memory'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {memory.type === 'video' && (
                    <div className="relative h-56 bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  )}
                  {memory.type === 'audio' && (
                    <div className="relative h-40 bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                      <svg className="w-14 h-14 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Caption and Link */}
                  <div className="p-4 space-y-2">
                    {memory.caption && (
                      <p className="text-sm text-gray-300 leading-relaxed">{memory.caption}</p>
                    )}
                    <a
                      href={memory.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF6F61] text-xs font-medium inline-flex items-center gap-1"
                    >
                      View Content
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add Memory */}
        <section>
          <h3 className="text-base font-bold mb-4">Add a Memory</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Type</label>
              <select 
                value={newMemory.type}
                onChange={(e) => setNewMemory({...newMemory, type: e.target.value})}
                className="w-full rounded-xl border border-gray-600 bg-[#252b47] px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6F61]"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Content URL (optional)</label>
              <input
                type="text"
                value={newMemory.contentUrl}
                onChange={(e) => setNewMemory({...newMemory, contentUrl: e.target.value})}
                className="w-full rounded-xl border border-gray-600 bg-[#252b47] px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6F61]"
                placeholder="https://example.com/file.jpg"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Caption (optional)</label>
              <input
                type="text"
                value={newMemory.caption}
                onChange={(e) => setNewMemory({...newMemory, caption: e.target.value})}
                className="w-full rounded-xl border border-gray-600 bg-[#252b47] px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6F61]"
                placeholder="Graduation day photo"
              />
            </div>
            
            <button
              onClick={handleAddMemory}
              className="w-full rounded-xl bg-[#FF6F61] px-4 py-3.5 text-white text-sm font-semibold shadow-lg hover:bg-[#ff5a4d] transition-all active:scale-98"
            >
              Save Memory
            </button>
          </div>
        </section>

        {/* Recipients Management */}
        <section>
          <h2 className="text-base font-bold mb-4">Recipients</h2>
          
          {capsule.recipients && capsule.recipients.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm mb-4">
              No recipients yet. Add one below!
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {capsule.recipients && capsule.recipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="bg-[#252b47] rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-white text-sm">{recipient.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Token: {recipient.token}</p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                      recipient.notified 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {recipient.notified ? "Notified" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Add Recipient */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Add a Recipient</h3>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                className="w-full rounded-xl border border-gray-600 bg-[#252b47] px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF6F61]"
                placeholder="friend@example.com"
              />
            </div>
            
            <button
              onClick={handleAddRecipient}
              className="w-full rounded-xl bg-[#FF6F61] px-4 py-3.5 text-white text-sm font-semibold shadow-lg hover:bg-[#ff5a4d] transition-all active:scale-98"
            >
              Add Recipient
            </button>
          </div>
        </section>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#252b47] border-t border-gray-700/30 h-16 flex justify-around items-center">
        <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center gap-0.5 text-gray-400 transition-colors hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs font-medium">Home</span>
        </button>
        
        <button className="flex flex-col items-center gap-0.5 text-[#FF6F61] transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Detail</span>
        </button>
        
        <button className="flex flex-col items-center gap-0.5 text-gray-400 transition-colors hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-medium">Settings</span>
        </button>
      </nav>
    </div>
  );
}