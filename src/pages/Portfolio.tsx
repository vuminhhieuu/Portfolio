// src/pages/Portfolio.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { PortfolioTabs } from '../components/PortfolioTabs';
import { Experience } from '../components/Experience';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { LoadingAnimation } from '../components/LoadingAnimation';

export function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <LoadingAnimation />;
  }
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main>
        <Hero />
        <About />
        <PortfolioTabs />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}