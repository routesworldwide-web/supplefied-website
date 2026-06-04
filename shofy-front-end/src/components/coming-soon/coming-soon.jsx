"use client";

import Link from "next/link";

export default function ComingSoon() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07120d] text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45"
        style={{
          backgroundImage: "url('/assets/img/coming-soon-bg.jpg')",
        }}
      />

      {/* Premium dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#07120d]/95 via-[#07120d]/75 to-[#1f3b2d]/85" />

      {/* Soft glow */}
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-[120px]" />

      {/* Content */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-100 backdrop-blur">
            Launching Soon
          </p>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Premium Wellness,
            <span className="block text-emerald-200">Coming Soon.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            Supplefied is getting ready to bring you a clean, trusted and modern
            supplement shopping experience.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="mailto:info@routesworldwideexpress.com"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#07120d] transition hover:bg-emerald-100"
            >
              Contact Us
            </Link>

            <span className="text-sm text-white/60">
              Stay tuned for the official launch
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
