// src/pages/About.jsx
import React from 'react';
import SkillBar from '../components/SkillBar';

const About = () => {
  return (
    <section id="about" className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="flex-grow p-8">
        <h2 className="text-3xl font-bold mb-6">About Me</h2>
        <p className="mb-4">
          I'm a dedicated Full Stack Engineer with a strong interest in web development. I enjoy solving complex problems and creating efficient, scalable applications.
        </p>
        <h3 className="text-2xl font-semibold mt-6 mb-4">Skills</h3>
        {/* Replace with a list of SkillBars for each skill */}
        <SkillBar skill="JavaScript" level="80" />
        <SkillBar skill="React" level="75" />
        <SkillBar skill="Node.js" level="70" />
        <SkillBar skill="CSS" level="85" />
      </main>
    </section>
  );
};

export default About;
