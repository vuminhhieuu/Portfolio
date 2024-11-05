import React, { useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="fixed w-full bg-white dark:bg-gray-900 shadow p-4 flex justify-between items-center z-10">
      <h1 className="text-2xl font-bold">My Portfolio</h1>
      <div className="flex space-x-4 items-center">
        <button onClick={() => scrollToSection('home')} className="text-gray-700 dark:text-gray-200">Home</button>
        <button onClick={() => scrollToSection('about')} className="text-gray-700 dark:text-gray-200">About</button>
        <button onClick={() => scrollToSection('projects')} className="text-gray-700 dark:text-gray-200">Projects</button>
        <button onClick={() => scrollToSection('contact')} className="text-gray-700 dark:text-gray-200">Contact</button>
        
        {/* Nút theme toggle với icon */}
        <button onClick={toggleTheme} className="text-gray-700 dark:text-gray-200 p-2 rounded-full focus:outline-none">
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
