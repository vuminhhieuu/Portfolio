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
    
    // Hiệu ứng typing
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
        
        // Bắt đầu hiệu ứng slide up sau khi typing xong
        setTimeout(() => {
          setShowContent(false);
          
          // Đợi hiệu ứng slide up hoàn thành rồi gọi onComplete
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 1000); // Thời gian chờ phải khớp với thời gian transition
        }, 1200); // Đợi thêm chút thời gian sau khi hiển thị xong
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [fullText, onComplete]);
  
  // Tạo hiệu ứng particles đơn giản
  useEffect(() => {
    if (!animationRef.current) return;
    
    // Tạo các particles
    const particles: HTMLDivElement[] = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Style cho particle
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 5 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = 'rgba(99, 102, 241, 0.4)'; // Indigo color with opacity
      
      // Vị trí ngẫu nhiên
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      
      // Animation
      particle.style.animation = `float ${Math.random() * 8 + 4}s linear infinite`;
      particle.style.opacity = '0';
      
      // Thêm vào container
      animationRef.current.appendChild(particle);
      particles.push(particle);
    }
    
    // Định nghĩa keyframes animation cho particles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translate(0, 0); opacity: 0; }
        25% { opacity: 0.8; }
        75% { opacity: 0.8; }
        100% { transform: translate(${window.innerWidth / 10}px, -${window.innerHeight / 10}px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup
    return () => {
      particles.forEach(p => p.remove());
      style.remove();
    };
  }, []);
  
  return (
    <div 
      ref={animationRef}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', // Theme sáng
        zIndex: 9999,
        transform: showContent ? 'translateY(0)' : 'translateY(-100%)', // Hiệu ứng slide up
        transition: 'transform 1s cubic-bezier(0.86, 0, 0.07, 1)', // Easing curve mượt mà
        overflow: 'hidden'
      }}
    >
      {/* Overlay gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, rgba(248, 250, 252, 0.3) 0%, rgba(226, 232, 240, 0.95) 100%)',
      }}></div>
      
      {/* Content container */}
      <div style={{ 
        position: 'relative',
        textAlign: 'center', 
        maxWidth: '90%',
        zIndex: 10
      }}>
        <h1 style={{ 
          fontSize: 'clamp(1.5rem, 5vw, 3rem)',
          fontWeight: 'bold',
          color: '#1e293b', // Text dark cho theme sáng
          letterSpacing: '0.5px',
          margin: 0,
          padding: '20px'
        }}>
          {text}
          <span style={{ 
            display: 'inline-block', 
            width: '3px', 
            height: '1em', 
            backgroundColor: '#6366f1', // Indigo color
            marginLeft: '4px',
            verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite' 
          }}></span>
        </h1>
      </div>
      
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}