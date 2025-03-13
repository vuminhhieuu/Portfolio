import { useEffect, useState } from "react";
import { ArrowDownIcon, GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, MailIcon } from "lucide-react";
import { ParticlesBackground } from "./Particles";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getHeroData } from "../services/heroService";

interface HeroData {
  name: string;
  title: string;
  description: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    email?: string;
  };
}

export function Hero() {
  const [heroData, setHeroData] = useState<HeroData>({
    name: "Vũ Minh Hiếu",
    title: "Web Developer & UI/UX Designer",
    description: "I build exceptional digital experiences with modern technologies. Specializing in React, Node.js, and cloud architecture.",
    socialLinks: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      twitter: "https://twitter.com/",
      email: "mailto:example@example.com"
    }
  });
  
  const [loading, setLoading] = useState(true);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Fetch hero data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHeroData();
        if (data) {
          setHeroData(data);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-50 to-slate-100 overflow-hidden">
      <ParticlesBackground />
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 z-10 py-20">
        <motion.div 
          ref={ref}
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.p 
            variants={itemVariants} 
            className="text-primary-600 font-medium mb-2 tracking-wider"
          >
            Hello, I'm
          </motion.p>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-dark-900"
          >
            {heroData.name}
          </motion.h1>
          
          <motion.h2 
            variants={itemVariants}
            className="text-2xl md:text-3xl lg:text-4xl text-dark-600 font-light mb-6"
          >
            {heroData.title}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-dark-700 text-lg mb-8 max-w-xl"
          >
            {heroData.description}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-4 mb-12"
          >
            <a 
              href="#contact" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth"
                });
              }}
            >
              Contact Me
            </a>
              
            <a 
              href="#portfolio" 
              className="px-6 py-3 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("portfolio")?.scrollIntoView({
                  behavior: "smooth"
                });
              }}
            >
              View My Work
            </a>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            {heroData.socialLinks.github && (
              <a 
                href={heroData.socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark-600 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-primary-50"
                aria-label="GitHub"
              >
                <GithubIcon size={20} />
              </a>
            )}
            
            {heroData.socialLinks.linkedin && (
              <a 
                href={heroData.socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark-600 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-primary-50"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={20} />
              </a>
            )}
            
            {heroData.socialLinks.twitter && (
              <a 
                href={heroData.socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark-600 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-primary-50"
                aria-label="Twitter"
              >
                <TwitterIcon size={20} />
              </a>
            )}
            
            {heroData.socialLinks.instagram && (
              <a 
                href={heroData.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark-600 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-primary-50"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
            )}
            
            {heroData.socialLinks.email && (
              <a 
                href={heroData.socialLinks.email}
                className="text-dark-600 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-primary-50"
                aria-label="Email"
              >
                <MailIcon size={20} />
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
      
      <motion.button 
        onClick={scrollToAbout} 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary-600 hover:text-primary-700 transition-colors"
        aria-label="Scroll down"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowDownIcon size={28} className="animate-bounce" />
      </motion.button>
    </section>
  );
}