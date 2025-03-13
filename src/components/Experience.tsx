import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { getExperiences, Experience as ExperienceType, formatDate, calculateDuration } from "../services/experienceService";
import { BriefcaseIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from "lucide-react";

export function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Fetch experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await getExperiences();
        setExperiences(data);
      } catch (err) {
        console.error("Error fetching experiences:", err);
        setError("Failed to load experiences");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Toggle expanded state
  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Check if an experience is expanded
  const isExpanded = (id: string) => expandedIds.has(id);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

    // Content animation variants
    const contentVariants = {
      hidden: { 
        height: 0,
        opacity: 0,
        transition: {
          height: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.2 }
        }
      },
      visible: { 
        height: "auto", 
        opacity: 1,
        transition: {
          height: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.3, delay: 0.1 }
        }
      }
    };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading experiences</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center text-slate-500">
          <p>No work experience to display yet.</p>
        </div>
      </div>
    );
  }

  return (
    <section id="experience" className="py-20 bg-slate-50">
      <motion.div 
        ref={ref}
        className="container mx-auto px-4 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold mb-2">Work Experience</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-700 max-w-2xl mx-auto">
            My professional journey as a developer, showcasing my growth and the
            impactful work I've done.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-blue-200"></div>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div 
                  key={exp.id} 
                  className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  variants={itemVariants}
                >
                  <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-100 z-10"></div>
                  <div className="ml-8 md:ml-0 md:w-1/2 md:px-8">
                    <div className="bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden">
                      <button 
                        onClick={() => toggleExpanded(exp.id)} 
                        className="w-full p-6 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                              <BriefcaseIcon size={18} />
                              <h3 className="font-semibold">{exp.position}</h3>
                            </div>
                            <div className="font-medium text-lg flex items-center">
                              {exp.company}
                              {exp.url && (
                                <a
                                  href={exp.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                  aria-label={`Visit ${exp.company} website`}
                                >
                                  <ExternalLinkIcon className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 text-sm">
                              <CalendarIcon size={14} />
                              <span>
                                {formatDate(exp.startDate)} - {exp.current
                                  ? "Present"
                                  : formatDate(exp.endDate || "")}
                                {/* Duration */}
                                <span className="ml-2 text-slate-400">
                                  ({calculateDuration(
                                    exp.startDate,
                                    exp.endDate,
                                    exp.current
                                  )})
                                </span>
                              </span>
                            </div>
                          </div>
                          {isExpanded(exp.id) ? 
                            <ChevronUpIcon size={20} className="text-slate-400" /> : 
                            <ChevronDownIcon size={20} className="text-slate-400" />
                          }
                        </div>
                      </button>
                      <AnimatePresence>
                        <motion.div
                          key={`content-${exp.id}`}
                          initial="hidden"
                          animate={isExpanded(exp.id) ? "visible" : "hidden"}
                          exit="hidden"
                          variants={contentVariants}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <p className="text-slate-700 mb-4">
                              {exp.description}
                            </p>
                          
                          {/* Responsibilities */}
                          {exp.responsibilities && exp.responsibilities.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-slate-700 mb-2">Key Responsibilities:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {exp.responsibilities.map((responsibility, idx) => (
                                    <li key={idx} className="text-slate-600 text-sm">{responsibility}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          
                          {/* Technologies */}
                          {exp.technologies && exp.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {exp.technologies.map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}