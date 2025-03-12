import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { PortfolioTabs } from "../components/PortfolioTabs";
import { Experience } from "../components/Experience";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { LoadingAnimation } from "../components/PrePortfolio";

export function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  
  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Hiệu ứng cuộn lên sẽ bắt đầu ngay sau khi loading hoàn tất
    setTimeout(() => {
      setShowContent(true);
    }, 10);
  };
  
  // Đảm bảo trang được cuộn lên đầu khi vào portfolio
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);
  
  // Lấy chiều cao của header để tạo padding-top cho main
  useEffect(() => {
    if (!isLoading && showContent) {
      const headerElement = document.querySelector('header');
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
      
      // Cập nhật lại khi resize cửa sổ
      const handleResize = () => {
        const headerElement = document.querySelector('header');
        if (headerElement) {
          setHeaderHeight(headerElement.offsetHeight);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isLoading, showContent]);
  
  if (isLoading) {
    return <LoadingAnimation onComplete={handleLoadingComplete} />;
  }
  
  return (
    <div 
      className="min-h-screen bg-slate-50 text-slate-800"
      style={{
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)', // Hiệu ứng cuộn lên
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      <Header />
      <main style={{ paddingTop: headerHeight ? `${headerHeight}px` : '4rem' }}>
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