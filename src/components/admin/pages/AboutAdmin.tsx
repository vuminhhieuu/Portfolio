// src/components/admin/pages/AboutAdmin.tsx
import React, { useState, useEffect } from 'react';
import { getAboutData, updateAboutData, uploadProfilePhoto, uploadResume, AboutData } from '../../../services/aboutService';
import { ImageUploader } from '../shared/ImageUploader';

export function AboutAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<AboutData>({
    name: '',
    email: '',
    location: '',
    availability: '',
    bio: '',
    additionalInfo: '',
    photoUrl: '',
    resumeUrl: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Load about data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAboutData();
        setFormData(data);
      } catch (err) {
        setError('Failed to load about data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile photo upload
  const handleProfilePhotoChange = (files: File[]) => {
    if (files.length > 0) {
      setProfilePhotoFile(files[0]);
    }
  };

  // Handle resume upload
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      let updatedData = { ...formData };

      // Upload profile photo if selected
      if (profilePhotoFile) {
        const photoUrl = await uploadProfilePhoto(profilePhotoFile);
        updatedData.photoUrl = photoUrl;
      }

      // Upload resume if selected
      if (resumeFile) {
        const resumeUrl = await uploadResume(resumeFile);
        updatedData.resumeUrl = resumeUrl;
      }

      // Update about data
      await updateAboutData(updatedData);
      setFormData(updatedData);
      setSuccess('About information updated successfully!');
      
      // Reset file inputs
      setProfilePhotoFile(null);
      setResumeFile(null);
    } catch (err) {
      setError('Failed to update about information');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit About Information</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Personal Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select availability</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
                <option value="Not available">Not available</option>
              </select>
            </div>
          </div>
          
          {/* Profile Photo */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Profile Photo</h2>
            
            <div className="flex flex-col items-center">
              {formData.photoUrl && (
                <div className="mb-4">
                  <img 
                    src={formData.photoUrl} 
                    alt="Profile" 
                    className="w-40 h-40 rounded-full object-cover border-4 border-slate-200"
                  />
                </div>
              )}
            <ImageUploader 
                value={formData.photoUrl}
                onChange={(dataUrl) => {
                    setFormData(prev => ({
                    ...prev,
                    photoUrl: dataUrl
                    }));
                }}
                onRemove={() => {
                    setFormData(prev => ({
                    ...prev,
                    photoUrl: ''
                    }));
                    setProfilePhotoFile(null);
                }}
            />


              
              {profilePhotoFile && (
                <p className="text-sm text-green-600 mt-2">
                  New photo selected: {profilePhotoFile.name}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Bio Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Bio Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bio (First Paragraph)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Additional Information (Second Paragraph)
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
        </div>
        
        {/* Resume Upload */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Resume</h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload Resume (PDF)
            </label>
            <input
              type="file"
              onChange={handleResumeChange}
              accept=".pdf"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {formData.resumeUrl && !resumeFile && (
              <div className="mt-2">
                <p className="text-sm text-slate-600">
                  Current resume: 
                  <a 
                    href={formData.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    View Resume
                  </a>
                </p>
              </div>
            )}
            
            {resumeFile && (
              <p className="text-sm text-green-600 mt-2">
                New resume selected: {resumeFile.name}
              </p>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}