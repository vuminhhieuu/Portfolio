// src/components/ProjectCard.jsx
import React from 'react';

const ProjectCard = ({ title, description, demoLink, githubLink }) => (
  <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
    <p className="text-gray-600 dark:text-gray-300 mt-2">{description}</p>
    <div className="flex space-x-4 mt-4">
      <a href={demoLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-300">
        Demo
      </a>
      <a href={githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-300">
        GitHub
      </a>
    </div>
  </div>
);

export default ProjectCard;
