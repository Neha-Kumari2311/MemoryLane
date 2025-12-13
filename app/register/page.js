"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    // <div className="bg-cream-bg text-charcoal font-display antialiased overflow-x-hidden min-h-screen flex flex-col items-center justify-center">
    //   <div className="relative flex h-full w-full max-w-[480px] flex-col overflow-hidden sm:my-4 sm:rounded-xl sm:shadow-2xl sm:border sm:border-border-warm bg-cream-bg">

    //     {/* Header */}
    //     <div className="flex items-center p-4 justify-between bg-transparent z-10">
    //       <button className="flex size-10 items-center justify-center rounded-full hover:bg-charcoal/5 transition-colors">
    //         <span className="material-symbols-outlined text-charcoal text-[24px]">
    //           arrow_back
    //         </span>
    //       </button>
    //       <div className="flex-1" />
    //       <button className="text-sm font-medium text-charcoal/60 hover:text-coral-red transition-colors">
    //         Help
    //       </button>
    //     </div>

    //     {/* Intro */}
    //     <div className="px-6 pt-2 pb-6 flex flex-col items-center text-center relative z-10">
    //       <div className="mb-6 size-16 rounded-2xl bg-gradient-to-br from-warm-pink to-coral-red flex items-center justify-center shadow-lg shadow-coral-red/20">
    //         <span className="material-symbols-outlined text-white text-[32px]">
    //           schedule
    //         </span>
    //       </div>

    //       <h1 className="text-2xl font-bold tracking-tight mb-2">
    //         Create your Time Capsule
    //       </h1>

    //       <p className="text-charcoal/70 text-sm max-w-[280px]">
    //         Join MemoryLane to preserve your most precious moments for the future.
    //       </p>
    //     </div>

    //     {/* Form */}
    //     <div className="flex-1 w-full px-4 pb-8">
    //       <form
    //         className="flex flex-col gap-5"
    //         onSubmit={(e) => e.preventDefault()}
    //       >
    //         {/* Full Name */}
    //         <div className="flex flex-col gap-1.5">
    //           <label className="text-sm font-medium text-charcoal/80">
    //             Full Name
    //           </label>
    //           <div className="relative">
    //             <input
    //               type="text"
    //               placeholder="Jane Doe"
    //               className="w-full rounded-lg border border-border-warm bg-surface-card px-4 py-3.5 pr-10 text-base placeholder:text-charcoal/40 focus:border-coral-red focus:ring-1 focus:ring-coral-red outline-none transition-all"
    //             />
    //             <span className="material-symbols-outlined absolute right-4 top-3.5 text-charcoal/40">
    //               person
    //             </span>
    //           </div>
    //         </div>

    //         {/* Email */}
    //         <div className="flex flex-col gap-1.5">
    //           <label className="text-sm font-medium text-charcoal/80">
    //             Email Address
    //           </label>
    //           <div className="relative">
    //             <input
    //               type="email"
    //               placeholder="jane@example.com"
    //               className="w-full rounded-lg border border-border-warm bg-surface-card px-4 py-3.5 pr-10 text-base placeholder:text-charcoal/40 focus:border-coral-red focus:ring-1 focus:ring-coral-red outline-none transition-all"
    //             />
    //             <span className="material-symbols-outlined absolute right-4 top-3.5 text-charcoal/40">
    //               mail
    //             </span>
    //           </div>
    //         </div>

    //         {/* Password */}
    //         <div className="flex flex-col gap-1.5">
    //           <label className="text-sm font-medium text-charcoal/80">
    //             Password
    //           </label>

    //           <div className="relative">
    //             <input
    //               type="password"
    //               placeholder="••••••••"
    //               className="w-full rounded-lg border border-border-warm bg-surface-card px-4 py-3.5 pr-12 text-base placeholder:text-charcoal/40 focus:border-coral-red focus:ring-1 focus:ring-coral-red outline-none transition-all"
    //             />
    //             <button
    //               type="button"
    //               className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-charcoal/40 hover:text-charcoal/60"
    //             >
    //               <span className="material-symbols-outlined text-[20px]">
    //                 visibility_off
    //               </span>
    //             </button>
    //           </div>

    //           {/* Password strength */}
    //           <div className="flex gap-1.5 mt-1">
    //             <div className="h-1 flex-1 rounded-full bg-warm-pink" />
    //             <div className="h-1 flex-1 rounded-full bg-warm-pink" />
    //             <div className="h-1 flex-1 rounded-full bg-border-warm" />
    //             <div className="h-1 flex-1 rounded-full bg-border-warm" />
    //           </div>

    //           <p className="text-xs text-charcoal/60">Medium strength</p>
    //         </div>

    //         {/* Submit */}
    //         <button
    //           type="submit"
    //           className="mt-2 w-full rounded-lg bg-coral-red py-3.5 text-base font-bold text-white shadow-lg shadow-coral-red/25 hover:bg-red-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
    //         >
    //           <span>Create Account</span>
    //           <span className="material-symbols-outlined text-[20px]">
    //             arrow_forward
    //           </span>
    //         </button>

    //         {/* Divider */}
    //         <div className="relative py-2 flex items-center justify-center">
    //           <div className="absolute inset-0 flex items-center">
    //             <div className="w-full border-t border-border-warm" />
    //           </div>
    //           <div className="relative bg-cream-bg px-4 text-xs uppercase text-charcoal/50">
    //             Or continue with
    //           </div>
    //         </div>

    //         {/* OAuth Buttons */}
    //         <div className="grid grid-cols-2 gap-3">
    //           <button
    //             type="button"
    //             className="flex items-center justify-center gap-2 rounded-lg border border-border-warm bg-surface-card py-2.5 hover:bg-orange-50 transition-colors"
    //           >
    //             <img src="/apple.svg" alt="Apple" className="h-5 w-5 opacity-80" />
    //             <span className="text-sm font-medium">Apple</span>
    //           </button>

    //           <button
    //             type="button"
    //             className="flex items-center justify-center gap-2 rounded-lg border border-border-warm bg-surface-card py-2.5 hover:bg-orange-50 transition-colors"
    //           >
    //             <img src="/google.svg" alt="Google" className="h-5 w-5 opacity-80" />
    //             <span className="text-sm font-medium">Google</span>
    //           </button>
    //         </div>

    //         {/* Footer */}
    //         <p className="mt-4 text-center text-sm text-charcoal/60">
    //           Already have an account?{" "}
    //           <Link
    //             href="/login"
    //             className="font-bold text-coral-red hover:underline"
    //           >
    //             Sign In
    //           </Link>
    //         </p>
    //       </form>
    //     </div>

    //     {/* Background blobs */}
    //     <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] bg-warm-pink/20 rounded-full blur-[80px] opacity-50 pointer-events-none" />
    //     <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[30%] bg-coral-red/10 rounded-full blur-[60px] opacity-50 pointer-events-none" />
    //   </div>
    // </div>
    <div className="bg-red-500 text-white p-10 text-3xl">
  Tailwind is working
</div>

  );
}
