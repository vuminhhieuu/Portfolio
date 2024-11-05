import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

const App = () => {
  return (
    <div className="min-h-screen font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Navbar />
      <main className="pt-16">
        <Home />
        <About />
        <Blog />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
