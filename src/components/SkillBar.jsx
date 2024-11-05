// src/components/SkillBar.jsx

import React from 'react';

const SkillBar = ({ skill, level }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{skill}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{level}%</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${level}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SkillBar;
