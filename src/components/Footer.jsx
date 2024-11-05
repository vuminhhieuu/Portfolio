// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="p-4 bg-gray-100 dark:bg-gray-800 text-center text-gray-700 dark:text-gray-200">
      <p>&copy; {new Date().getFullYear()} My Portfolio. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://linkedin.com/in/your-username" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
    </footer>
  );
};

export default Footer;
