"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur border-b border-white/10 bg-white/60 dark:bg-black/30">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">VMH</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#hero" className="hover:opacity-80">Hero</a>
          <a href="#about" className="hover:opacity-80">About</a>
          <a href="#portfolio" className="hover:opacity-80">Portfolio</a>
          <a href="#experience" className="hover:opacity-80">Experience</a>
          <a href="#contact" className="hover:opacity-80">Contact</a>
        </nav>
      </div>
    </header>
  );
} 