"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getProjects, type Project } from "@/lib/services/projectsService";

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
      const uniqueCategories = new Set<string>();
      fetchedProjects.forEach(p => { if (p.category) uniqueCategories.add(p.category); });
      setCategories(Array.from(uniqueCategories));
      setVisibleProjects(fetchedProjects);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  useEffect(() => {
    if (filter === "all") setVisibleProjects(projects);
    else if (filter === "featured") setVisibleProjects(projects.filter(p => p.featured));
    else setVisibleProjects(projects.filter(p => p.category === filter || p.technologies.includes(filter)));
  }, [filter, projects]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const cardVariants = { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } } };

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  return (
    <motion.div ref={ref} className="container mx-auto px-4 md:px-8" variants={containerVariants} initial="hidden" animate={inView ? "visible" : "hidden"}>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {["all", "featured", ...categories].map(opt => (
          <button key={opt} onClick={() => setFilter(opt)} className={`px-3 py-1 rounded-full text-sm border ${filter === opt ? "bg-black text-white dark:bg-white dark:text-black" : "opacity-70 hover:opacity-100"}`}>{opt}</button>
        ))}
      </div>
      {visibleProjects.length === 0 ? (
        <motion.div className="text-center py-10 bg-slate-50 rounded-lg" variants={cardVariants}><p className="text-slate-600">No projects found with the selected filter.</p></motion.div>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
          {visibleProjects.map(project => (
            <motion.div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300" variants={cardVariants} whileHover={{ y: -5 }} layout>
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-200"><span className="text-slate-400">No image</span></div>
                )}
                {project.featured && (<div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">Featured</div>)}
                {project.category && (<div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">{project.category}</div>)}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-slate-800">{project.title}</h3>
                <p className={`text-slate-600 mb-4 ${expandedId === project.id ? '' : 'line-clamp-3'}`}>{project.description}</p>
                {project.description.length > 150 && (
                  <button className="text-blue-600 text-sm font-medium hover:underline mb-4" onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}>
                    {expandedId === project.id ? 'Show less' : 'Read more'}
                  </button>
                )}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">{project.technologies.map((tech, i) => (<span key={i} className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">{tech}</span>))}</div>
                )}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                  <div className="flex gap-4">
                    {project.githubUrl && (<a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-600 transition-colors">Code</a>)}
                    {project.demoUrl && (<a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-600 transition-colors">Demo</a>)}
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