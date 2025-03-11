import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getProjects, Project } from "../services/projectsService";
import { GithubIcon, ExternalLinkIcon, ArrowRightIcon } from "lucide-react";

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
      
      // Extract unique categories
      const uniqueCategories = new Set<string>();
      fetchedProjects.forEach(project => {
        if (project.category) {
          uniqueCategories.add(project.category);
        }
      });
      setCategories(Array.from(uniqueCategories));
      
      setVisibleProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  // Filter projects based on selected category
  useEffect(() => {
    if (filter === "all") {
      setVisibleProjects(projects);
    } else if (filter === "featured") {
      setVisibleProjects(projects.filter(project => project.featured));
    } else {
      setVisibleProjects(
        projects.filter(project => 
          project.category === filter || 
          project.technologies.includes(filter)
        )
      );
    }
  }, [filter, projects]);
  
  // Get filter options
  const getFilterOptions = () => {
    const options = ["all", "featured"];
    return [...options, ...categories];
  };
  
  // Toggle project details
  const toggleProjectDetails = (projectId: string) => {
    setExpandedId(expandedId === projectId ? null : projectId);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.7,
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
  
  return (
    <motion.div 
      ref={ref}
      className="container mx-auto px-4 py-16"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.div 
        className="text-center mb-16"
        variants={cardVariants}
      >
        <h2 className="text-3xl font-bold mb-2">My Projects</h2>
        <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-slate-700 max-w-2xl mx-auto">
          Explore my latest projects and applications that showcase my skills and experience.
          From web applications to mobile apps, these projects represent my journey as a developer.
        </p>
      </motion.div>
      
      {/* Filter Buttons */}
      {getFilterOptions().length > 2 && (
        <motion.div 
          className="flex justify-center mb-12"
          variants={cardVariants}
        >
          <div className="inline-flex bg-slate-100 rounded-lg p-1 flex-wrap justify-center">
            {getFilterOptions().map(category => (
              <button 
                key={category} 
                onClick={() => setFilter(category)} 
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 m-1 capitalize ${
                  filter === category 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Projects Grid */}
      {visibleProjects.length === 0 ? (
        <motion.div 
          className="text-center py-10 bg-slate-50 rounded-lg"
          variants={cardVariants}
        >
          <p className="text-slate-600">No projects found with the selected filter.</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {visibleProjects.map(project => (
            <motion.div 
              key={project.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              layout
            >
              {/* Project Image */}
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                {project.imageUrl ? (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-200">
                    <span className="text-slate-400">No image</span>
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
                {project.category && (
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {project.category}
                  </div>
                )}
              </div>
              
              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-slate-800">
                  {project.title}
                </h3>
                
                <p className={`text-slate-600 mb-4 ${expandedId === project.id ? '' : 'line-clamp-3'}`}>
                  {project.description}
                </p>
                
                {project.description.length > 150 && (
                  <button 
                    className="text-blue-600 text-sm font-medium flex items-center hover:underline mb-4"
                    onClick={() => toggleProjectDetails(project.id)}
                  >
                    {expandedId === project.id ? 'Show less' : 'Read more'}
                    <ArrowRightIcon size={14} className={`ml-1 transition-transform ${expandedId === project.id ? 'rotate-90' : ''}`} />
                  </button>
                )}
                
                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Links */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                  <div className="flex gap-4">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-slate-600 hover:text-blue-600 transition-colors"
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        <GithubIcon size={18} className="mr-1" />
                        <span className="text-sm">Code</span>
                      </a>
                    )}
                    
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-slate-600 hover:text-blue-600 transition-colors"
                        aria-label={`View live demo of ${project.title}`}
                      >
                        <ExternalLinkIcon size={18} className="mr-1" />
                        <span className="text-sm">Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}