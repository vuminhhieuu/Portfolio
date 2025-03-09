import React, { useState } from "react";
import { ExternalLinkIcon, GithubIcon } from "lucide-react";
export function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const projects = [{
    id: 1,
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with product management, cart functionality, payment processing, and order tracking.",
    image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    category: "fullstack",
    technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
    liveLink: "#",
    githubLink: "#"
  }, {
    id: 2,
    title: "Task Management App",
    description: "A Kanban-style task management application with drag-and-drop functionality, team collaboration features, and real-time updates.",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
    category: "frontend",
    technologies: ["React", "TypeScript", "Redux", "Socket.io"],
    liveLink: "#",
    githubLink: "#"
  }, {
    id: 3,
    title: "Financial Dashboard",
    description: "An analytics dashboard for financial data visualization with interactive charts, filters, and customizable widgets.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "frontend",
    technologies: ["React", "D3.js", "Tailwind CSS", "RESTful API"],
    liveLink: "#",
    githubLink: "#"
  }, {
    id: 4,
    title: "API Gateway Service",
    description: "A microservice-based API gateway that handles authentication, request routing, and rate limiting for a distributed system.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1034&q=80",
    category: "backend",
    technologies: ["Node.js", "Express", "Redis", "JWT", "Docker"],
    liveLink: "#",
    githubLink: "#"
  }, {
    id: 5,
    title: "Real-time Chat Application",
    description: "A real-time messaging platform with private chats, group conversations, file sharing, and read receipts.",
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    category: "fullstack",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
    liveLink: "#",
    githubLink: "#"
  }, {
    id: 6,
    title: "Content Management System",
    description: "A headless CMS with a powerful admin panel, content modeling, and API-first approach for multi-platform publishing.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    category: "backend",
    technologies: ["Node.js", "GraphQL", "PostgreSQL", "AWS S3"],
    liveLink: "#",
    githubLink: "#"
  }];
  const filteredProjects = activeFilter === "all" ? projects : projects.filter(project => project.category === activeFilter);
  const filters = [{
    id: "all",
    label: "All Projects"
  }, {
    id: "frontend",
    label: "Frontend"
  }, {
    id: "backend",
    label: "Backend"
  }, {
    id: "fullstack",
    label: "Full-Stack"
  }];
  return <div className="animate-fadeIn">
      <div className="flex justify-center mb-10">
        <div className="inline-flex flex-wrap justify-center gap-2">
          {filters.map(filter => <button key={filter.id} onClick={() => setActiveFilter(filter.id)} className={`px-4 py-2 rounded-full transition-colors ${activeFilter === filter.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
              {filter.label}
            </button>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-100">
            <div className="h-48 overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-slate-600 mb-4">{project.description}</p>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => <span key={tech} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      {tech}
                    </span>)}
                </div>
              </div>
              <div className="flex gap-3">
                <a href={project.liveLink} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                  <ExternalLinkIcon size={16} />
                  <span>Live Demo</span>
                </a>
                <a href={project.githubLink} className="flex items-center gap-1 text-sm text-slate-700 hover:text-slate-900">
                  <GithubIcon size={16} />
                  <span>Source Code</span>
                </a>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}