import { GithubIcon, LinkedinIcon, TwitterIcon, HeartIcon } from "lucide-react";
import { Link } from "react-router-dom";
export function Footer() {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold mb-2">
              <span className="text-white">Minh</span>
              <span className="text-blue-400">Hieu</span>
            </div>
            <p className="text-slate-400 max-w-md">
              Full-stack engineer specializing in building exceptional digital
              experiences.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-4 mb-4">
              <a href="https://github.com/vuminhhieuu" className="text-slate-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <GithubIcon size={20} />
              </a>
              <a href="https://linkedin.com/in/vuminhhieuu" className="text-slate-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <LinkedinIcon size={20} />
              </a>
              <a href="https://x.com/vuminhhieu26" className="text-slate-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <TwitterIcon size={20} />
              </a>
            </div>
            <div className="text-slate-400 text-sm flex items-center gap-1">
              <span>Made with</span>
              <HeartIcon size={14} className="text-red-500" />
              <span>&copy; {currentYear} <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
                Minh Hieu
              </Link></span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}