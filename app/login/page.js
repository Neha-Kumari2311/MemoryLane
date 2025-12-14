"use client";

import { useState } from "react";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link"

export default function LoginPage() {
     const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  setError("");
  setLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Login successful", data.user);
      alert("Login successful! Redirecting to dashboard...");
      router.push("/dashboard");
    } else {
      setError(data.error || "Login failed");
    }
  } catch (err) {
    setError("Something went wrong");
  }

  setLoading(false);
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen  text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-neutral-800 rounded-md shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-linear-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-semibold">MemoryLane</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">
            Unlock your past. Access your time capsules.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium mb-2.5 text-gray-300">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-neutral-700 
                  text-white text-sm placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 focus:bg-white/10
                  transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-xs font-medium text-gray-300">Password</label>
              <button
                type="button"
                className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/5 border border-neutral-700 
                  text-white text-sm placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 focus:bg-white/10
                  transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          
          <button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full py-3.5 rounded-xl bg-linear-to-r from-red-400 to-red-500 
    text-white font-semibold text-sm
    hover:from-red-500 hover:to-red-600 active:scale-[0.98]
    shadow-lg shadow-red-500/25
    transition-all disabled:opacity-50 disabled:cursor-not-allowed"
>
  <span className="flex items-center justify-center gap-2">
    {loading ? "Logging in..." : "Log in"}
    {!loading && (
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
          d="M9 5l7 7-7 7"
        />
      </svg>
    )}
  </span>
</button>

          
        </div>

  

        {/* Footer */}
        <p className=" mt-8 pt-6 text-center text-sm text-gray-500">
          New to MemoryLane?{" "}
          <Link href="/register" className="text-red-400 font-semibold hover:text-red-300 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}