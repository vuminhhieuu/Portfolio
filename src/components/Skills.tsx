import React, { useState } from "react";
import { CheckCircle2Icon } from "lucide-react";
import { FaReact, FaNodeJs, FaDocker, FaGitAlt } from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiExpress, SiMongodb, SiPostgresql, SiGraphql, SiAmazon, SiJest, SiCypress, SiRedux, SiSwagger } from "react-icons/si";
export function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("Frontend Development");
  const skillCategories = [{
    title: "Frontend Development",
    skills: [{
      name: "React",
      level: "Expert",
      icon: FaReact,
      color: "#61DAFB"
    }, {
      name: "TypeScript",
      level: "Expert",
      icon: SiTypescript,
      color: "#3178C6"
    }, {
      name: "Next.js",
      level: "Advanced",
      icon: SiNextdotjs,
      color: "#000000"
    }, {
      name: "Tailwind CSS",
      level: "Expert",
      icon: SiTailwindcss,
      color: "#06B6D4"
    }]
  }, {
    title: "Backend Development",
    skills: [{
      name: "Node.js",
      level: "Expert",
      icon: FaNodeJs,
      color: "#339933"
    }, {
      name: "Express",
      level: "Advanced",
      icon: SiExpress,
      color: "#000000"
    }, {
      name: "MongoDB",
      level: "Advanced",
      icon: SiMongodb,
      color: "#47A248"
    }, {
      name: "PostgreSQL",
      level: "Advanced",
      icon: SiPostgresql,
      color: "#4169E1"
    }, {
      name: "GraphQL",
      level: "Intermediate",
      icon: SiGraphql,
      color: "#E10098"
    }]
  }];
  const otherSkills = [{
    name: "AWS",
    icon: SiAmazon,
    color: "#232F3E"
  }, {
    name: "Docker",
    icon: FaDocker,
    color: "#2496ED"
  }, {
    name: "Git",
    icon: FaGitAlt,
    color: "#F05032"
  }, {
    name: "Jest",
    icon: SiJest,
    color: "#C21325"
  }, {
    name: "Cypress",
    icon: SiCypress,
    color: "#17202C"
  }, {
    name: "Redux",
    icon: SiRedux,
    color: "#764ABC"
  }, {
    name: "REST API",
    icon: SiSwagger,
    color: "#85EA2D"
  }];
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-green-100 text-green-700";
      case "Advanced":
        return "bg-blue-100 text-blue-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
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
      default:
        return "w-2/5";
    }
  };
  return <div className="animate-fadeIn">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">My Skills</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-700 max-w-2xl mx-auto">
            I've worked with a variety of technologies and methodologies
            throughout my career. Here's an overview of my technical expertise
            and proficiency levels.
          </p>
        </div>
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-100 rounded-lg p-1">
            {skillCategories.map(category => <button key={category.title} onClick={() => setActiveCategory(category.title)} className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeCategory === category.title ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-blue-600"}`}>
                {category.title}
              </button>)}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {skillCategories.filter(category => category.title === activeCategory).map(category => <div key={category.title} className="transition-all duration-500 ease-in-out">
                <div className="space-y-6">
                  {category.skills.map(skill => <div key={skill.name} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <skill.icon className="w-8 h-8 transition-transform duration-300 hover:rotate-12" style={{
                    color: skill.color
                  }} />
                          <span className="font-medium text-slate-800">
                            {skill.name}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className={`${getProgressWidth(skill.level)} h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out`}></div>
                      </div>
                    </div>)}
                </div>
              </div>)}
        </div>
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Other Skills & Technologies
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {otherSkills.map(skill => <div key={skill.name} className="px-4 py-3 bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
                <skill.icon className="w-5 h-5 transition-transform duration-300 hover:rotate-12" style={{
              color: skill.color
            }} />
                <span className="text-slate-700">{skill.name}</span>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}