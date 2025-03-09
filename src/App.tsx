import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { PortfolioTabs } from "./components/PortfolioTabs";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Login } from "./components/admin/Login";
import { Dashboard } from "./components/admin/Dashboard";
import { LoadingAnimation } from "./components/LoadingAnimation";
function Portfolio() {
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
  return <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main>
        <Hero />
        <About />
        <PortfolioTabs />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>;
}
export function App() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>;
} 