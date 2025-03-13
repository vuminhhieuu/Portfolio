import { useState } from "react";
import { Projects } from "./Projects";
import { Skills } from "./Skills";
import { Certificates } from "./Certificates";
import { motion } from "framer-motion";

export function PortfolioTabs() {
  const [activeTab, setActiveTab] = useState("projects");
  const tabs = [{
    id: "projects",
    label: "Projects"
  },{
    id: "certificates",
    label: "Certificates"
  },{
    id: "skills",
    label: "Tech stack"
  }, 
  ];
  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return <Projects />;
      case "skills":
        return <Skills />;
      case "certificates":
        return <Certificates />;
      default:
        return null;
    }
  };
  return <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">My Portfolio</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-700 max-w-2xl mx-auto">
            Explore my projects, technical skills, and professional
            certifications that showcase my expertise in full-stack development.
          </p>
        </div>
        {/* Tab Navigation */}
        <motion.div 
          className="w-full flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex bg-slate-100 rounded-xl p-1.5">
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200" 
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>
        {/* Tab Content */}
        <div className="min-h-[600px]">{renderContent()}</div>
      </div>
    </section>;
}