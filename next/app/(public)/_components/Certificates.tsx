"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getCertificates, type Certificate } from "@/lib/services/certificatesService";

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const data = await getCertificates();
        setCertificates(data);
        const unique = new Set<string>();
        data.forEach(c => { if (c.category) unique.add(c.category); });
        setCategories(Array.from(unique));
      } finally { setLoading(false); }
    };
    fetchCertificates();
  }, []);

  const filtered = activeCategory === 'all' ? certificates : certificates.filter(c => c.category === activeCategory);
  const formatDate = (d: string) => { try { const date = new Date(d); return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(date); } catch { return d; } };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const cardVariants = { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } } };

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  return (
    <motion.div ref={ref} className="container mx-auto px-4 md:px-8" variants={containerVariants} initial="hidden" animate={inView ? "visible" : "hidden"}>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {['all', ...categories].map(c => (<button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1 rounded-full text-sm border ${activeCategory === c ? "bg-black text-white dark:bg-white dark:text-black" : "opacity-70 hover:opacity-100"}`}>{c}</button>))}
      </div>
      {filtered.length === 0 ? (
        <motion.div className="text-center py-10 bg-slate-50 rounded-lg" variants={cardVariants}><p className="text-slate-600">No certificates found in this category.</p></motion.div>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
          {filtered.map(certificate => (
            <motion.div key={certificate.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" variants={cardVariants} whileHover={{ y: -5 }} onClick={() => setSelectedCertificate(certificate)}>
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                {certificate.imageUrl ? (<img src={certificate.imageUrl} alt={certificate.title} className="w-full h-full object-cover" />) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-200">🎖️</div>
                )}
                {certificate.category && (<div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">{certificate.category}</div>)}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-slate-800">{certificate.title}</h3>
                <p className="text-slate-600 mb-4 font-medium">{certificate.issuer}</p>
                <div className="flex items-center text-slate-500 text-sm mb-4">{formatDate(certificate.issueDate)}{certificate.expiryDate && ` - ${formatDate(certificate.expiryDate)}`}</div>
                <div className="flex justify-end"><button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setSelectedCertificate(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800">✖</button>
            <div className="h-60 bg-slate-200 overflow-hidden">
              {selectedCertificate.imageUrl ? (<img src={selectedCertificate.imageUrl} alt={selectedCertificate.title} className="w-full h-full object-contain" />) : (<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-200">🎖️</div>)}
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedCertificate.title}</h2>
              <p className="text-slate-600 text-lg mb-4">{selectedCertificate.issuer}</p>
              <div className="text-slate-500 mb-4">{formatDate(selectedCertificate.issueDate)}{selectedCertificate.expiryDate && ` - ${formatDate(selectedCertificate.expiryDate)}`}</div>
              {selectedCertificate.description && (<div className="mb-6"><h3 className="text-lg font-semibold mb-2">About</h3><p className="text-slate-600">{selectedCertificate.description}</p></div>)}
              {selectedCertificate.credentialId && (<div className="mb-4"><h3 className="text-sm font-semibold text-slate-700">Credential ID</h3><p className="text-slate-600">{selectedCertificate.credentialId}</p></div>)}
              {selectedCertificate.credentialUrl && (<div className="mt-6"><a href={selectedCertificate.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Verify Certificate</a></div>)}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
} 