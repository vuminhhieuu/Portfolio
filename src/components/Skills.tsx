import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getSkills, SkillCategory, Skill } from "../services/skillsService";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as AiIcons from "react-icons/ai";
import { CheckCircle2Icon } from "lucide-react";

export function Skills() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [otherSkills, setOtherSkills] = useState<Skill[]>([]);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSkills();
        setCategories(data);
        
        if (data.length > 0) {
          // Đặt category đầu tiên là active
          setActiveCategory(data[0].title);
          
          // Tìm các kỹ năng khác trong category có tên "Other"
          const otherCategory = data.find(cat => 
            cat.title.toLowerCase() === "other" || 
            cat.title.toLowerCase() === "others"
          );
          
          if (otherCategory) {
            setOtherSkills(otherCategory.skills);
          }
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-green-100 text-green-700";
      case "Advanced":
        return "bg-blue-100 text-blue-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Beginner":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getProgressWidth = (level: string) => {
    switch (level) {
      case "Expert":
        return "w-full";
      case "Advanced":
        return "w-4/5";
      case "Intermediate":
        return "w-3/5";
      case "Beginner":
        return "w-2/5";
      default:
        return "w-2/5";
    }
  };

  // Render icon từ string
  const renderIcon = (iconName: string, color: string) => {
    let Icon;
    
    if (iconName.startsWith("Fa") && FaIcons[iconName as keyof typeof FaIcons]) {
      Icon = FaIcons[iconName as keyof typeof FaIcons];
    } else if (iconName.startsWith("Si") && SiIcons[iconName as keyof typeof SiIcons]) {
      Icon = SiIcons[iconName as keyof typeof SiIcons];
    } else if (iconName.startsWith("Ai") && AiIcons[iconName as keyof typeof AiIcons]) {
      Icon = AiIcons[iconName as keyof typeof AiIcons];
    } else {
      return <CheckCircle2Icon className="w-8 h-8 text-blue-500" />;
    }
    
    return (
      <Icon 
        className="w-8 h-8 transition-transform duration-300 hover:rotate-12" 
        style={{ color: color || '#6366f1' }}
      />
    );
  };

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

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Lọc categories không phải "Other"
  const mainCategories = categories.filter(cat => 
    cat.title.toLowerCase() !== "other" && 
    cat.title.toLowerCase() !== "others"
  );

  return (
    <motion.div 
      ref={ref}
      className="animate-fadeIn"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold mb-2">My Skills</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-700 max-w-2xl mx-auto">
            I've worked with a variety of technologies and methodologies
            throughout my career. Here's an overview of my technical expertise
            and proficiency levels.
          </p>
        </motion.div>

        {mainCategories.length > 0 && (
          <>
            <motion.div 
              className="flex justify-center mb-12"
              variants={itemVariants}
            >
              <div className="inline-flex bg-slate-100 rounded-lg p-1 flex-wrap justify-center">
                {mainCategories.map(category => (
                  <button 
                    key={category.id} 
                    onClick={() => setActiveCategory(category.title)} 
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 m-1 ${
                      activeCategory === category.title 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 gap-8"
              variants={itemVariants}
            >
              {mainCategories
                .filter(category => category.title === activeCategory)
                .map(category => (
                  <div key={category.id} className="transition-all duration-500 ease-in-out">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {category.skills.map(skill => (
                        <motion.div 
                          key={skill.id} 
                          className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                          whileHover={{ y: -5 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {skill.icon 
                                ? renderIcon(skill.icon, skill.color || '#000000')
                                : <CheckCircle2Icon className="w-8 h-8 text-blue-500" />
                              }
                              <span className="font-medium text-slate-800">
                                {skill.name}
                              </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(skill.level)}`}>
                              {skill.level}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                              className={`${getProgressWidth(skill.level)} h-full rounded-full transition-all duration-1000 ease-out`}
                              style={{ backgroundColor: skill.color || '#6366f1' }}
                            ></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              }
            </motion.div>
          </>
        )}

        {otherSkills.length > 0 && (
          <motion.div 
            className="mt-16" 
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold mb-6 text-center">
              Other Skills & Technologies
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {otherSkills.map(skill => (
                <motion.div 
                  key={skill.id} 
                  className="px-4 py-3 bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                >
                  {skill.icon 
                    ? renderIcon(skill.icon, skill.color || '#000000')
                    : <CheckCircle2Icon className="w-5 h-5 text-blue-500" />
                  }
                  <span className="text-slate-700">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No skills data available. Add your skills from the admin panel.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}