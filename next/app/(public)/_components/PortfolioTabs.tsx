"use client";

import { useState } from "react";
import { Projects } from "./Projects";
import { Certificates } from "./Certificates";

const tabs = ["Projects", "Certificates", "Skills"] as const;

export function PortfolioTabs() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Projects");
  return (
    <section id="portfolio" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold">My Portfolio</h2>
          <p className="text-slate-700 max-w-2xl mx-auto mt-2">Explore my projects, technical skills, and certifications.</p>
        </div>
        <div className="flex items-center gap-2 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-4 py-2 rounded-full text-sm border ${active === tab ? "bg-black text-white dark:bg-white dark:text-black" : "opacity-70 hover:opacity-100"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-8 min-h-40">
          {active === 'Projects' && <Projects />}
          {active === 'Certificates' && <Certificates />}
          {active === 'Skills' && <div className="text-center text-slate-500 py-10">Skills will be upgraded in the next step.</div>}
        </div>
      </div>
    </section>
  );
} 