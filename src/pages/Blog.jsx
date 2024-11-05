// src/pages/Blog.jsx
import React from 'react';
import BlogPostCard from '../components/BlogPostCard';

const Blog = () => {
  const posts = [
    {
      title: 'Learning React',
      summary: 'A quick journey into learning React for web development.',
      link: 'https://yourblog.com/learning-react',
    },
    {
      title: 'CSS Tips and Tricks',
      summary: 'Useful tips for working with CSS effectively.',
      link: 'https://yourblog.com/css-tips',
    },
    // Add more blog posts as needed
  ];

  return (
    <section id="blog" className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="flex-grow p-8">
        <h2 className="text-3xl font-bold mb-6">Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogPostCard key={index} {...post} />
          ))}
        </div>
      </main>
    </section>
  );
};

export default Blog;
