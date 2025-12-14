"use client"
import { useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link"

export default function RegisterPage() {
     const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  })

const handleSubmit = async (e) => {
  e.preventDefault();

  const { fullname, email, password } = formData;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: fullname, email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registration successful!");
    router.push("/login");
  } else {
    alert(data.error || "Something went wrong.");
  }
};



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-bg">
      <div className="relative flex h-full w-full max-w-[480px] flex-col overflow-hidden sm:my-4 sm:rounded-md sm:shadow-2xl sm:border sm:border-border-warm bg-cream-bg">

        {/* Hero Section */}
        <div className="px-6 pt-4 pb-6 flex flex-col items-center text-center relative z-10">
          <div className="mb-6 size-16 rounded-2xl bg-gradient-to-br from-warm-pink to-coral-red flex items-center justify-center shadow-lg shadow-coral-red/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-charcoal mb-2">
            Create your Time Capsule
          </h1>
          <p className="text-charcoal/70 text-sm leading-normal max-w-[280px]">
            Join MemoryLane to preserve your most precious moments for the future.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex-1 w-full px-4 pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullname" className="text-sm font-medium text-charcoal/100">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-border-warm bg-surface-card px-4 py-3.5 text-base text-charcoal placeholder:text-charcoal/40 focus:border-coral-red focus:outline-none focus:ring-1 focus:ring-coral-red transition-all"
                />
                <svg
                  className="w-5 h-5 text-charcoal/40 absolute right-4 top-3.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-charcoal/100">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className="w-full rounded-lg border border-border-warm bg-surface-card px-4 py-3.5 text-base text-charcoal placeholder:text-charcoal/40 focus:border-coral-red focus:outline-none focus:ring-1 focus:ring-coral-red transition-all"
                />
                <svg
                  className="w-5 h-5 text-charcoal/40 absolute right-4 top-3.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-charcoal/100">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border-warm bg-surface-card px-4 py-3.5 text-base text-charcoal placeholder:text-charcoal/40 focus:border-coral-red focus:outline-none focus:ring-1 focus:ring-coral-red transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-charcoal/40 hover:text-charcoal/60 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {/* Password Strength Indicator */}
              <div className="flex gap-1.5 mt-1">
                <div className="h-1 flex-1 rounded-full bg-warm-pink"></div>
                <div className="h-1 flex-1 rounded-full bg-warm-pink"></div>
                <div className="h-1 flex-1 rounded-full bg-border-warm"></div>
                <div className="h-1 flex-1 rounded-full bg-border-warm"></div>
              </div>
              <p className="text-xs text-charcoal/100 mt-0.5">Medium strength</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-coral-red py-3.5 text-base font-bold text-white shadow-lg shadow-coral-red/25 hover:bg-red-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Create Account</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Divider */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-warm"></div>
              </div>
              <div className="relative bg-cream-bg px-4 text-xs uppercase text-charcoal/50">Or continue with</div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-border-warm bg-surface-card py-2.5 hover:bg-orange-50 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="text-sm font-medium text-charcoal/80">Apple</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-border-warm bg-surface-card py-2.5 hover:bg-orange-50 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-charcoal/80">Google</span>
              </button>
            </div>

            {/* Sign In Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-charcoal/60">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-coral-red hover:text-red-400 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Background Blur Elements */}
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] bg-warm-pink/20 rounded-full blur-[80px] pointer-events-none opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[30%] bg-coral-red/10 rounded-full blur-[60px] pointer-events-none opacity-50"></div>
      </div>
    </div>
  )
}
