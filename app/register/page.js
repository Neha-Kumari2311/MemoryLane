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
