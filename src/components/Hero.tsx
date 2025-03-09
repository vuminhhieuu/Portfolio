import React from "react";
import { ArrowDownIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import { ThreeScene } from "./ThreeScene";
import { ParticlesBackground } from "./Particles";
export function Hero() {
  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <section className="relative h-screen flex items-center bg-gradient-to-br from-blue-50 to-slate-100 overflow-hidden">
      <ParticlesBackground />
      <ThreeScene />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      <div className="container mx-auto px-4 md:px-8 z-10">
        <div className="max-w-3xl">
          <p className="text-blue-600 font-medium mb-2">Hello, I'm</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Alex Johnson
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-slate-600 font-light mb-6">
            Full-Stack Engineer
          </h2>
          <p className="text-slate-700 text-lg mb-8 max-w-xl">
            I build exceptional digital experiences with modern technologies.
            Specializing in React, Node.js, and cloud architecture.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <a href="#contact" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md" onClick={e => {
            e.preventDefault();
            document.getElementById("contact")?.scrollIntoView({
              behavior: "smooth"
            });
          }}>
              Contact Me
            </a>
            <a href="#projects" className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors" onClick={e => {
            e.preventDefault();
            document.getElementById("projects")?.scrollIntoView({
              behavior: "smooth"
            });
          }}>
              View My Work
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
              <GithubIcon size={20} />
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
              <LinkedinIcon size={20} />
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
              <TwitterIcon size={20} />
            </a>
          </div>
        </div>
      </div>
      <button onClick={scrollToAbout} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-blue-600 animate-bounce" aria-label="Scroll down">
        <ArrowDownIcon size={28} />
      </button>
    </section>;
}