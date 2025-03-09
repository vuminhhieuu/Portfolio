import React from "react";
import { GithubIcon, LinkedinIcon, TwitterIcon, HeartIcon } from "lucide-react";
export function Footer() {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold mb-2">
              <span className="text-white">Dev</span>
              <span className="text-blue-400">Portfolio</span>
            </div>
            <p className="text-slate-400 max-w-md">
              Full-stack engineer specializing in building exceptional digital
              experiences.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <GithubIcon size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <LinkedinIcon size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <TwitterIcon size={20} />
              </a>
            </div>
            <div className="text-slate-400 text-sm flex items-center gap-1">
              <span>Made with</span>
              <HeartIcon size={14} className="text-red-500" />
              <span>&copy; {currentYear} Alex Johnson</span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}