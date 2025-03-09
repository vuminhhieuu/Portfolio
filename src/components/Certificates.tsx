import React from "react";
import { AwardIcon, ExternalLinkIcon } from "lucide-react";
export function Certificates() {
  const certificates = [{
    id: 1,
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    verificationUrl: "#"
  }, {
    id: 2,
    name: "Professional Cloud Developer",
    issuer: "Google Cloud",
    date: "2023",
    image: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80",
    verificationUrl: "#"
  }, {
    id: 3,
    name: "Advanced React & GraphQL",
    issuer: "Frontend Masters",
    date: "2022",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    verificationUrl: "#"
  }, {
    id: 4,
    name: "MongoDB Developer Certification",
    issuer: "MongoDB University",
    date: "2022",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    verificationUrl: "#"
  }];
  return <div className="animate-fadeIn">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">Certificates</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-700 max-w-2xl mx-auto">
            Professional certifications and achievements that validate my
            expertise and commitment to continuous learning.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificates.map(cert => <div key={cert.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100 group">
              <div className="h-48 overflow-hidden relative">
                <img src={cert.image} alt={cert.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <p className="font-medium text-sm">{cert.issuer}</p>
                    <p className="text-slate-300 text-sm">{cert.date}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <AwardIcon size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      {cert.name}
                    </h3>
                    <a href={cert.verificationUrl} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                      <span>Verify Certificate</span>
                      <ExternalLinkIcon size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
}