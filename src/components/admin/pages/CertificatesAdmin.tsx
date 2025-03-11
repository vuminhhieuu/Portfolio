import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, TrashIcon, EditIcon, SaveIcon, ExternalLinkIcon, 
  UploadIcon, XIcon, ArrowUpIcon, ArrowDownIcon
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { 
  getCertificates, saveCertificate, deleteCertificate, updateCertificatesOrder, 
  createEmptyCertificate, Certificate 
} from '../../../services/certificatesService';
import { AdminHeader } from '../shared/AdminHeader';
import { AdminContent } from '../shared/AdminContent';

export function CertificatesAdmin() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentCertificate, setCurrentCertificate] = useState<Certificate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch certificates on component mount
  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const certificatesList = await getCertificates();
      setCertificates(certificatesList);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError('Failed to load certificates.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);
  
  // Filter certificates based on search term
  const filteredCertificates = useCallback(() => {
    if (!searchTerm) return certificates;
    
    const searchLower = searchTerm.toLowerCase();
    return certificates.filter(cert => 
      cert.title.toLowerCase().includes(searchLower) ||
      cert.issuer.toLowerCase().includes(searchLower) ||
      (cert.description && cert.description.toLowerCase().includes(searchLower))
    );
  }, [certificates, searchTerm]);
  
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle file remove
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (!currentCertificate) return;
    
    setCurrentCertificate({
      ...currentCertificate,
      [name]: value
    });
  };
  
  // Reset form
  const resetForm = () => {
    setCurrentCertificate(null);
    setSelectedFile(null);
    setPreviewImage(null);
    setIsEditing(false);
    setError(null);
  };
  
  // Create a new certificate form
  const handleCreateNew = () => {
    setCurrentCertificate(createEmptyCertificate());
    setIsEditing(false);
    setPreviewImage(null);
    setSelectedFile(null);
    setError(null);
  };
  
  // Edit existing certificate
  const handleEdit = (certificate: Certificate) => {
    setCurrentCertificate({ ...certificate });
    setIsEditing(true);
    setPreviewImage(null);
    setSelectedFile(null);
    setError(null);
  };
  
  // Delete certificate
  const handleDelete = async (certificateId: string, imageUrl: string | null) => {
    if (!window.confirm('Are you sure you want to delete this certificate? This action cannot be undone.')) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      await deleteCertificate(certificateId, imageUrl || null);
      
      // Update local state
      setCertificates(prevCertificates => {
        const updatedCertificates = prevCertificates.filter(c => c.id !== certificateId);
        // Re-order certificates
        return updatedCertificates.map((c, index) => ({ ...c, order: index }));
      });
      
      setSuccess('Certificate deleted successfully!');
      
      // Reset form if editing the deleted certificate
      if (currentCertificate && currentCertificate.id === certificateId) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
      setError('Failed to delete certificate.');
    } finally {
      setSaving(false);
    }
  };
  
  // Save certificate
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCertificate) return;
    
    // Validate required fields
    if (!currentCertificate.title.trim()) {
      setError('Certificate title is required.');
      return;
    }
    
    if (!currentCertificate.issuer.trim()) {
      setError('Issuer name is required.');
      return;
    }
    
    if (!currentCertificate.issueDate.trim()) {
      setError('Issue date is required.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Update order if it's a new certificate
      if (!isEditing) {
        currentCertificate.order = certificates.length;
      }
      
      const savedCertificate = await saveCertificate(currentCertificate, selectedFile);
      
      if (isEditing) {
        // Update existing certificate in state
        setCertificates(prevCertificates => 
          prevCertificates.map(c => c.id === savedCertificate.id ? savedCertificate : c)
        );
        setSuccess('Certificate updated successfully!');
      } else {
        // Add new certificate to state
        setCertificates(prevCertificates => [...prevCertificates, savedCertificate]);
        setSuccess('Certificate created successfully!');
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving certificate:', error);
      setError('Failed to save certificate.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle certificate order change
  const handleMoveCertificate = (certificateId: string, direction: 'up' | 'down') => {
    const currentIndex = certificates.findIndex(c => c.id === certificateId);
    if (currentIndex === -1) return;
    
    const newCertificates = [...certificates];
    
    if (direction === 'up' && currentIndex > 0) {
      // Swap with previous certificate
      [newCertificates[currentIndex], newCertificates[currentIndex - 1]] = 
      [newCertificates[currentIndex - 1], newCertificates[currentIndex]];
    } else if (direction === 'down' && currentIndex < certificates.length - 1) {
      // Swap with next certificate
      [newCertificates[currentIndex], newCertificates[currentIndex + 1]] = 
      [newCertificates[currentIndex + 1], newCertificates[currentIndex]];
    } else {
      return; // No change needed
    }
    
    // Update order property for each certificate
    const updatedCertificates = newCertificates.map((certificate, index) => ({
      ...certificate,
      order: index
    }));
    
    setCertificates(updatedCertificates);
    
    // Save new order to database
    updateCertificatesOrder(updatedCertificates).catch(error => {
      console.error('Error updating certificates order:', error);
      setError('Failed to update certificates order.');
    });
  };
  
  // Render header actions
  const headerActions = (
    <>
      <button
        onClick={handleCreateNew}
        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
        disabled={saving}
      >
        <PlusIcon size={16} />
        Add Certificate
      </button>
    </>
  );
  
  return (
    <>
      <AdminHeader 
        title="Manage Certificates" 
        error={error} 
        success={success} 
        actions={headerActions} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certificates List */}
        <AdminContent isLoading={loading}>
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between lg:col-span-2">
            <h2 className="text-xl font-semibold">Certificates List</h2>
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          {filteredCertificates().length === 0 ? (
            <div className="bg-slate-50 p-6 rounded-lg text-center">
              <p className="text-slate-600">
                {certificates.length === 0 
                  ? "No certificates found. Add your first certificate!" 
                  : "No certificates match your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCertificates().map((certificate) => (
                <div 
                  key={certificate.id}
                  className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Certificate Image */}
                    <div className="w-20 h-20 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                      {certificate.imageUrl ? (
                        <img 
                          src={certificate.imageUrl} 
                          alt={certificate.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-slate-400">No image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Certificate Info */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-slate-800">
                            {certificate.title}
                          </h3>
                          <p className="text-sm text-slate-600">{certificate.issuer}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {certificate.issueDate}
                            {certificate.expiryDate && ` - ${certificate.expiryDate}`}
                          </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMoveCertificate(certificate.id, 'up')}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            title="Move Up"
                            disabled={certificates.indexOf(certificate) === 0}
                          >
                            <ArrowUpIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleMoveCertificate(certificate.id, 'down')}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            title="Move Down"
                            disabled={certificates.indexOf(certificate) === certificates.length - 1}
                          >
                            <ArrowDownIcon size={16} />
                          </button>
                          <button
                                                            onClick={() => handleEdit(certificate)}
                                                            className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                            title="Edit Certificate"
                                                          >
                                                            <EditIcon size={16} />
                                                          </button>
                                                          <button
                                                            onClick={() => handleDelete(certificate.id, certificate.imageUrl || null)}
                                                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Delete Certificate"
                                                            disabled={saving}
                                                          >
                                                            <TrashIcon size={16} />
                                                          </button>
                                                        </div>
                                                      </div>
                                                      
                                                      {/* Category Tag */}
                                                      {certificate.category && (
                                                        <div className="mt-2">
                                                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                                                            {certificate.category}
                                                          </span>
                                                        </div>
                                                      )}
                                                      
                                                      {/* Credential Link */}
                                                      {certificate.credentialUrl && (
                                                        <div className="mt-2">
                                                          <a 
                                                            href={certificate.credentialUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center text-xs text-blue-500 hover:text-blue-700"
                                                          >
                                                            <ExternalLinkIcon size={14} className="mr-1" />
                                                            View Credential
                                                          </a>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </AdminContent>
                                        
                                        {/* Certificate Form */}
                                        <AdminContent>
                                          <h2 className="text-xl font-semibold mb-4">
                                            {isEditing ? 'Edit Certificate' : 'Add New Certificate'}
                                          </h2>
                                          
                                          {currentCertificate ? (
                                            <form onSubmit={handleSave} className="space-y-4">
                                              {/* Title */}
                                              <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                  Certificate Title <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                  type="text"
                                                  name="title"
                                                  value={currentCertificate.title}
                                                  onChange={handleInputChange}
                                                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  required
                                                />
                                              </div>
                                              
                                              {/* Issuer */}
                                              <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                  Issuer <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                  type="text"
                                                  name="issuer"
                                                  value={currentCertificate.issuer}
                                                  onChange={handleInputChange}
                                                  placeholder="e.g., Microsoft, Google, Udemy"
                                                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  required
                                                />
                                              </div>
                                              
                                              {/* Issue Date */}
                                              <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                  Issue Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                  type="date"
                                                  name="issueDate"
                                                  value={currentCertificate.issueDate}
                                                  onChange={handleInputChange}
                                                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  required
                                                />
                                              </div>
                                              
                                              {/* Expiry Date */}
                                              <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                  Expiry Date (if applicable)
                                                </label>
                                                <input
                                                  type="date"
                                                  name="expiryDate"
                                                  value={currentCertificate.expiryDate || ''}
                                                  onChange={handleInputChange}
                                                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                              </div>
                                              
                                              {/* Category */}
                                              <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                  Category
                                                </label>
                                                <input
                                                  type="text"
                                                  name="category"
                                                  value={currentCertificate.category || ''}
                                                  onChange={handleInputChange}
                                                  placeholder="e.g., Cloud Computing, Web Development"
                                                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                              </div>
                                              
                                              {/* Credential ID */}
                                              <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                  Credential ID
                                                </label>
                                                <input
                                                  type="text"
                                                  name="credentialId"
                                                  value={currentCertificate.credentialId || ''}
                                                  onChange={handleInputChange}
                                                  placeholder="e.g., ABC123XYZ"
                                                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                              </div>
                                              
                                              {/* Credential URL */}
                                              <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                  Credential URL
                                                </label>
                                                <input
                                                  type="url"
                                                  name="credentialUrl"
                                                  value={currentCertificate.credentialUrl || ''}
                                                  onChange={handleInputChange}
                                                  placeholder="https://example.com/verify/credential"
                                                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                              </div>
                                              
                                              {/* Description */}
                                              <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                  Description
                                                </label>
                                                <textarea
                                                  name="description"
                                                  value={currentCertificate.description || ''}
                                                  onChange={handleInputChange}
                                                  rows={3}
                                                  placeholder="Brief description of what the certificate covers"
                                                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                              </div>
                                              
                                              {/* Certificate Image */}
                                              <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                  Certificate Image
                                                </label>
                                                
                                                {/* Image Preview */}
                                                {(previewImage || currentCertificate.imageUrl) && (
                                                  <div className="mt-2 mb-4">
                                                    <div className="relative w-full max-w-xs">
                                                      <img 
                                                        src={previewImage || currentCertificate.imageUrl} 
                                                        alt="Certificate Preview" 
                                                        className="w-full h-40 object-cover rounded-md border border-slate-200"
                                                      />
                                                      <button
                                                        type="button"
                                                        onClick={handleRemoveFile}
                                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-slate-100 transition-colors"
                                                        title="Remove image"
                                                      >
                                                        <XIcon size={16} className="text-slate-600" />
                                                      </button>
                                                    </div>
                                                  </div>
                                                )}
                                                
                                                {/* File Input */}
                                                <label className="flex flex-col items-center px-4 py-6 bg-white text-slate-600 rounded-md border-2 border-dashed border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer">
                                                  <UploadIcon size={20} className="mb-2 text-slate-500" />
                                                  <span className="text-sm font-medium text-slate-700">Click to upload image</span>
                                                  <span className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (max. 2MB)</span>
                                                  <input 
                                                    type="file" 
                                                    className="hidden"
                                                    accept="image/png, image/jpeg, image/webp"
                                                    onChange={handleFileChange}
                                                  />
                                                </label>
                                              </div>
                                              
                                              {/* Form Buttons */}
                                              <div className="flex justify-end gap-3 pt-4">
                                                <button
                                                  type="button"
                                                  onClick={resetForm}
                                                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                                                  disabled={saving}
                                                >
                                                  Cancel
                                                </button>
                                                <button
                                                  type="submit"
                                                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                                                  disabled={saving}
                                                >
                                                  {saving ? (
                                                    <>
                                                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                                        <circle
                                                          className="opacity-25"
                                                          cx="12"
                                                          cy="12"
                                                          r="10"
                                                          stroke="currentColor"
                                                          strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                          className="opacity-75"
                                                          fill="currentColor"
                                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                      </svg>
                                                      Saving...
                                                    </>
                                                  ) : (
                                                    <>
                                                      <SaveIcon size={16} />
                                                      {isEditing ? 'Update Certificate' : 'Create Certificate'}
                                                    </>
                                                  )}
                                                </button>
                                              </div>
                                            </form>
                                          ) : (
                                            <div className="bg-slate-50 p-8 rounded-lg text-center">
                                              <div className="mb-4">
                                                <PlusIcon size={24} className="mx-auto text-slate-400" />
                                              </div>
                                              <h3 className="text-lg font-medium text-slate-700 mb-2">
                                                No Certificate Selected
                                              </h3>
                                              <p className="text-slate-500 mb-4">
                                                Create a new certificate or select an existing one to edit.
                                              </p>
                                              <button
                                                onClick={handleCreateNew}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                                              >
                                                <PlusIcon size={16} />
                                                Add New Certificate
                                              </button>
                                            </div>
                                          )}
                                        </AdminContent>
                                      </div>
                                    </>
                                  );
                                }