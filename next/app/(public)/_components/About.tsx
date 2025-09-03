"use client";

import { useEffect, useState } from "react";
import { getAboutData, defaultAboutData, type AboutData } from "@/lib/services/aboutService";

export function About() {
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData);
  useEffect(() => {
    getAboutData().then((data) => setAboutData(data)).catch(() => {});
  }, []);
  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl font-semibold">About Me</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="w-56 h-56 rounded-full overflow-hidden border mx-auto md:mx-0">
              <img src={aboutData.photoUrl || 
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=774&q=80"} alt={aboutData.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-slate-700 mb-4">{aboutData.bio}</p>
            <p className="text-slate-700 mb-6">{aboutData.additionalInfo}</p>
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <div className="font-semibold">Name</div>
                <div>{aboutData.name}</div>
              </div>
              <div>
                <div className="font-semibold">Email</div>
                <div>{aboutData.email}</div>
              </div>
              <div>
                <div className="font-semibold">Location</div>
                <div>{aboutData.location}</div>
              </div>
              <div>
                <div className="font-semibold">Availability</div>
                <div>{aboutData.availability}</div>
              </div>
            </div>
            {aboutData.resumeUrl && (
              <a href={aboutData.resumeUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black inline-block">
                Download CV
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 