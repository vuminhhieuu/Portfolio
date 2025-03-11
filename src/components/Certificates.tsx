import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getCertificates, Certificate } from "../services/certificatesService";
import { ExternalLinkIcon, CalendarIcon, AwardIcon } from "lucide-react";

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const data = await getCertificates();
        setCertificates(data);
        
        // Extract unique categories
        const uniqueCategories = new Set<string>();
        data.forEach(cert => {
          if (cert.category) {
            uniqueCategories.add(cert.category);
          }
        });
        setCategories(Array.from(uniqueCategories));
        
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError("Failed to load certificates");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Filter certificates by category
  const filteredCertificates = () => {
    if (activeCategory === "all") {
      return certificates;
    } else {
      return certificates.filter(cert => cert.category === activeCategory);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }).format(date);
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  // Open certificate modal
  const openCertificateModal = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    document.body.style.overflow = 'hidden'; // Disable scrolling when modal is open
  };

  // Close certificate modal
  const closeCertificateModal = () => {
    setSelectedCertificate(null);
    document.body.style.overflow = ''; // Re-enable scrolling
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="container mx-auto px-4 py-16"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.div
        className="text-center mb-16"
        variants={cardVariants}
      >
        <h2 className="text-3xl font-bold mb-2">Certifications</h2>
        <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-slate-700 max-w-2xl mx-auto">
          Professional certifications and achievements that validate my skills and knowledge.
        </p>
      </motion.div>

      {/* Categories filter - only show if there are categories */}
      {categories.length > 0 && (
        <motion.div
          className="flex justify-center mb-12"
          variants={cardVariants}
        >
          <div className="inline-flex bg-slate-100 rounded-lg p-1 flex-wrap justify-center">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 m-1 ${
                activeCategory === "all"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 m-1 ${
                  activeCategory === category
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Certificates Grid */}
      {filteredCertificates().length === 0 ? (
        <motion.div
          className="text-center py-10 bg-slate-50 rounded-lg"
          variants={cardVariants}
        >
          <p className="text-slate-600">No certificates found in this category.</p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {filteredCertificates().map(certificate => (
            <motion.div
              key={certificate.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => openCertificateModal(certificate)}
            >
              {/* Certificate Image */}
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                {certificate.imageUrl ? (
                  <img
                    src={certificate.imageUrl}
                    alt={certificate.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-200">
                    <AwardIcon size={48} className="text-blue-300" />
                  </div>
                )}
                {certificate.category && (
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {certificate.category}
                  </div>
                )}
              </div>

              {/* Certificate Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-slate-800">
                  {certificate.title}
                </h3>
                <p className="text-slate-600 mb-4 font-medium">
                  {certificate.issuer}
                </p>
                <div className="flex items-center text-slate-500 text-sm mb-4">
                  <CalendarIcon size={16} className="mr-2" />
                  <span>
                    {formatDate(certificate.issueDate)}
                    {certificate.expiryDate && ` - ${formatDate(certificate.expiryDate)}`}
                  </span>
                </div>

                {/* View Details Button */}
                <div className="flex justify-end">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    View Details
                    <ExternalLinkIcon size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close button */}
              <button 
                onClick={closeCertificateModal}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Certificate Image */}
              <div className="h-60 bg-slate-200 overflow-hidden">
                {selectedCertificate.imageUrl ? (
                  <img
                    src={selectedCertificate.imageUrl}
                    alt={selectedCertificate.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-200">
                    <AwardIcon size={64} className="text-blue-300" />
                  </div>
                )}
              </div>
              
              {/* Certificate Details */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {selectedCertificate.title}
                </h2>
                <p className="text-slate-600 text-lg mb-4">
                  {selectedCertificate.issuer}
                </p>
                
                <div className="flex items-center text-slate-500 mb-4">
                  <CalendarIcon size={18} className="mr-2" />
                  <span>
                    {formatDate(selectedCertificate.issueDate)}
                    {selectedCertificate.expiryDate && ` - ${formatDate(selectedCertificate.expiryDate)}`}
                  </span>
                </div>
                
                {selectedCertificate.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-slate-600">{selectedCertificate.description}</p>
                  </div>
                )}
                
                {/* Credential ID */}
                {selectedCertificate.credentialId && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-700">Credential ID</h3>
                    <p className="text-slate-600">{selectedCertificate.credentialId}</p>
                  </div>
                )}
                
                {/* Verify button */}
                {selectedCertificate.credentialUrl && (
                  <div className="mt-6">
                    <a
                      href={selectedCertificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLinkIcon size={16} className="mr-2" />
                      Verify Certificate
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}