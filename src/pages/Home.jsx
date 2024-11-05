// src/pages/Home.jsx
import React from 'react';

const Home = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">Hi, I'm [Your Name]</h1>
        <p className="text-lg text-center max-w-xl">
          Aspiring Full Stack Engineer with a passion for building web applications and learning new technologies..
        </p>
      </main>
    </section>
  );
};

export default Home;
