"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "./(public)/_components/Header";
import { Hero } from "./(public)/_components/Hero";
import { About } from "./(public)/_components/About";
import { PortfolioTabs } from "./(public)/_components/PortfolioTabs";
import { Experience } from "./(public)/_components/Experience";
import { Contact } from "./(public)/_components/Contact";
import { Footer } from "./(public)/_components/Footer";
import { LoadingAnimation } from "./(public)/_components/PrePortfolio";

export default function Home() {
  const { i18n } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 10);
  };

  useEffect(() => {
    if (!isLoading) window.scrollTo(0, 0);
  }, [isLoading]);

  if (isLoading) return <LoadingAnimation onComplete={handleLoadingComplete} />;

  return (
    <main className="min-h-screen" style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}>
      <Header />
      <div className="pt-16" />
      <section className="py-4">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-end gap-2">
          <button className="px-3 py-1 rounded border" onClick={() => i18n.changeLanguage("vi")}>VI</button>
          <button className="px-3 py-1 rounded border" onClick={() => i18n.changeLanguage("en")}>EN</button>
        </div>
      </section>
      <Hero />
      <About />
      <PortfolioTabs />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
