import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getAboutData, AboutData, defaultAboutData } from "../services/aboutService";
import { DownloadIcon } from "lucide-react";

export function About() {
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData);
  const [loading, setLoading] = useState(true);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAboutData();
        setAboutData(data);
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-2/5">
              <div className="animate-pulse relative">
                <div className="bg-slate-200 w-64 h-64 md:w-80 md:h-80 rounded-full mx-auto"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-100 rounded-full z-0"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-slate-100 rounded-full z-0"></div>
              </div>
            </div>
            <div className="w-full md:w-3/5 animate-pulse">
              <div className="h-8 bg-slate-200 w-1/3 mb-2 rounded"></div>
              <div className="w-20 h-1.5 bg-slate-300 mb-6"></div>
              <div className="h-4 bg-slate-200 w-full mb-4 rounded"></div>
              <div className="h-4 bg-slate-200 w-full mb-4 rounded"></div>
              <div className="h-4 bg-slate-200 w-3/4 mb-6 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-slate-200 w-1/3 mb-2 rounded"></div>
                    <div className="h-4 bg-slate-200 w-2/3 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          ref={ref}
          className="flex flex-col md:flex-row gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div 
            className="w-full md:w-2/5"
            variants={itemVariants}
          >
            <div className="relative">
              <div className="bg-primary-500 w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden mx-auto shadow-lg">
                <img 
                  src={aboutData.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"} 
                  alt={aboutData.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-100 rounded-full z-0"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-200 rounded-full z-0"></div>
            </div>
          </motion.div>
          
          <div className="w-full md:w-3/5">
            <motion.h2 
              className="text-3xl font-bold mb-2 text-dark-900"
              variants={itemVariants}
            >
              About Me
            </motion.h2>
            
            <motion.div 
              className="w-20 h-1.5 bg-primary-600 mb-6"
              variants={itemVariants}
            ></motion.div>
            
            <motion.p 
              className="text-dark-700 mb-4"
              variants={itemVariants}
            >
              {aboutData.bio}
            </motion.p>
            
            <motion.p 
              className="text-dark-700 mb-6"
              variants={itemVariants}
            >
              {aboutData.additionalInfo}
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-2 gap-4 mb-8"
              variants={itemVariants}
            >
              <div>
                <h3 className="font-semibold text-dark-900">Name:</h3>
                <p className="text-dark-700">{aboutData.name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-dark-900">Email:</h3>
                <p className="text-dark-700">{aboutData.email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-dark-900">Location:</h3>
                <p className="text-dark-700">{aboutData.location}</p>
              </div>
              <div>
                <h3 className="font-semibold text-dark-900">Availability:</h3>
                <p className="text-dark-700">{aboutData.availability}</p>
              </div>
            </motion.div>
            
            {aboutData.resumeUrl && (
              <motion.div variants={itemVariants}>
                <a 
                  href={aboutData.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md inline-flex items-center gap-2"
                >
                  <DownloadIcon size={18} />
                  Download CV
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}