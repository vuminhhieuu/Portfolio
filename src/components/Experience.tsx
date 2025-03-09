import React, { useState } from "react";
import { BriefcaseIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
export function Experience() {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const experiences = [{
    id: 1,
    role: "Senior Full-Stack Engineer",
    company: "TechNova Solutions",
    duration: "2021 - Present",
    description: "Lead developer for the company's flagship SaaS platform. Architected and implemented microservices, optimized database performance, and mentored junior developers. Reduced page load times by 40% and increased test coverage to 90%.",
    technologies: ["React", "Node.js", "AWS", "MongoDB", "Docker"]
  }, {
    id: 2,
    role: "Full-Stack Developer",
    company: "DataViz Systems",
    duration: "2018 - 2021",
    description: "Developed and maintained data visualization applications for enterprise clients. Implemented real-time dashboards, interactive charts, and data processing pipelines. Collaborated with UX designers to enhance user experience.",
    technologies: ["React", "TypeScript", "Express", "PostgreSQL", "D3.js"]
  }, {
    id: 3,
    role: "Frontend Developer",
    company: "WebCraft Studios",
    duration: "2016 - 2018",
    description: "Built responsive web applications for clients across various industries. Focused on accessibility, performance optimization, and cross-browser compatibility. Participated in agile development processes and sprint planning.",
    technologies: ["JavaScript", "HTML/CSS", "React", "Redux", "SCSS"]
  }, {
    id: 4,
    role: "Junior Web Developer",
    company: "Digital Innovations",
    duration: "2015 - 2016",
    description: "Assisted in the development and maintenance of client websites. Created custom WordPress themes and plugins. Collaborated with designers to implement UI components and responsive layouts.",
    technologies: ["JavaScript", "PHP", "WordPress", "jQuery", "CSS"]
  }];
  const toggleExperience = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };
  return <section id="experience" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">Work Experience</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-700 max-w-2xl mx-auto">
            My professional journey as a developer, showcasing my growth and the
            impactful work I've done.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-blue-200"></div>
            <div className="space-y-8">
              {experiences.map((exp, index) => <div key={exp.id} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-100 z-10"></div>
                  <div className="ml-8 md:ml-0 md:w-1/2 md:px-8">
                    <div className="bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden">
                      <button onClick={() => toggleExperience(exp.id)} className="w-full p-6 text-left hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                              <BriefcaseIcon size={18} />
                              <h3 className="font-semibold">{exp.role}</h3>
                            </div>
                            <div className="font-medium text-lg">
                              {exp.company}
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 text-sm">
                              <CalendarIcon size={14} />
                              <span>{exp.duration}</span>
                            </div>
                          </div>
                          {expandedId === exp.id ? <ChevronUpIcon size={20} className="text-slate-400" /> : <ChevronDownIcon size={20} className="text-slate-400" />}
                        </div>
                      </button>
                      <div className={`transition-all duration-300 ease-in-out ${expandedId === exp.id ? "max-h-96" : "max-h-0"} overflow-hidden`}>
                        <div className="px-6 pb-6">
                          <p className="text-slate-700 mb-4">
                            {exp.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map(tech => <span key={tech} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                                {tech}
                              </span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
}