// src/pages/Projects.jsx
import React from 'react';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const projects = [
    {
      title: 'Project 1',
      description: 'Description of project 1',
      demoLink: 'https://project1.demo',
      githubLink: 'https://github.com/your-username/project1',
    },
    {
      title: 'Project 2',
      description: 'Description of project 2',
      demoLink: 'https://project2.demo',
      githubLink: 'https://github.com/your-username/project2',
    },
    // Add more projects as needed
  ];

  return (
    <section id="projects" className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="flex-grow p-8">
        <h2 className="text-3xl font-bold mb-6">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </main>
    </section>
  );
};

export default Projects;
