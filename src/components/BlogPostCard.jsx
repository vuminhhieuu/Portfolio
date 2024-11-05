// src/components/BlogPostCard.jsx
import React from 'react';

const BlogPostCard = ({ title, summary, link }) => (
  <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mt-2">{summary}</p>
    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-300 mt-4 block">
      Read More
    </a>
  </div>
);

export default BlogPostCard;
