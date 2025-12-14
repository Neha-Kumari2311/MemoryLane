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
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
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
  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-400 to-red-500 
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

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-neutral-900 px-4 text-xs text-gray-400">
              Or continue with
            </span>

          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button className="flex items-center justify-center gap-2.5 py-3 rounded-xl 
            bg-white/5 border border-neutral-700
            hover:bg-white/10 hover:border-neutral-600 transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <span className="font-medium text-sm">Apple</span>
          </button>
          <button className="flex items-center justify-center gap-2.5 py-3 rounded-xl 
            bg-white/5 border border-neutral-700
            hover:bg-white/10 hover:border-neutral-600 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-medium text-sm">Google</span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          New to MemoryLane?{" "}
          <Link href="/register" className="text-red-400 font-semibold hover:text-red-300 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}