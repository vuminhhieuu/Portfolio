"use client";

import { useEffect, useState } from "react";
import { getHeroData, defaultHeroData, type HeroData } from "@/lib/services/heroService";

export function Hero() {
  const [heroData, setHeroData] = useState<HeroData>(defaultHeroData);
  useEffect(() => {
    getHeroData().then((data) => {
      if (data) setHeroData(data);
    }).catch(() => {});
  }, []);
  return (
    <section id="hero" className="relative min-h-[80vh] grid place-items-center overflow-hidden">
      <div className="text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {heroData.name}
        </h1>
        <p className="mt-4 text-lg opacity-80">{heroData.title}</p>
        <p className="mt-2 text-slate-600 max-w-xl mx-auto">{heroData.description}</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a href="#portfolio" className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90">
            View Work
          </a>
          <a href="#contact" className="px-5 py-2 rounded-full border border-current hover:bg-black/5">
            Contact
          </a>
        </div>
      </div>
    </section>
  );
} 