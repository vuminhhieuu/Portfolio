"use client";

import { useEffect, useState, useRef } from "react";

interface LoadingAnimationProps {
  onComplete?: () => void;
}

export function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [text, setText] = useState("");
  const [showContent, setShowContent] = useState(true);
  const animationRef = useRef<HTMLDivElement>(null);
  const fullText = "Welcome to my portfolio";
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowContent(false);
          setTimeout(() => {
            onComplete?.();
          }, 1000);
        }, 1200);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [fullText, onComplete]);
  useEffect(() => {
    if (!animationRef.current) return;
    const particles: HTMLDivElement[] = [];
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 5 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = 'rgba(99, 102, 241, 0.4)';
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animation = `float ${Math.random() * 8 + 4}s linear infinite`;
      particle.style.opacity = '0';
      animationRef.current.appendChild(particle);
      particles.push(particle);
    }
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float { 0% { transform: translate(0, 0); opacity: 0; } 25% { opacity: 0.8; } 75% { opacity: 0.8; } 100% { transform: translate(${window.innerWidth / 10}px, -${window.innerHeight / 10}px); opacity: 0; } }
    `;
    document.head.appendChild(style);
    return () => { particles.forEach(p => p.remove()); style.remove(); };
  }, []);
  return (
    <div 
      ref={animationRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', zIndex: 9999, transform: showContent ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 1s cubic-bezier(0.86, 0, 0.07, 1)', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(248, 250, 252, 0.3) 0%, rgba(226, 232, 240, 0.95) 100%)' }}></div>
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: '90%', zIndex: 10 }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', fontWeight: 'bold', color: '#1e293b', letterSpacing: '0.5px', margin: 0, padding: '20px' }}>
          {text}
          <span style={{ display: 'inline-block', width: '3px', height: '1em', backgroundColor: '#6366f1', marginLeft: '4px', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }}></span>
        </h1>
      </div>
      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
} 