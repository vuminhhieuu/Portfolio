import React, { useState, useEffect } from 'react';
import { getAboutData, updateAboutData, defaultAboutData } from '../../../services/aboutService';
import { CloudinaryUploadWidget } from '../../CloudinaryUploadWidget';

export function AboutAdmin() {
  const [formData, setFormData] = useState(defaultAboutData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  // Fetch About data
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePhotoSuccess = (url: string) => {
    console.log("Profile photo uploaded:", url);
    setProfilePhotoUrl(url);
    setFormData(prev => ({ ...prev, photoUrl: url }));
  };
  
  const handleResumeSuccess = (url: string) => {
    console.log("Resume uploaded:", url);
    setResumeUrl(url);
    setFormData(prev => ({ ...prev, resumeUrl: url }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
  
    try {
      // Đảm bảo cập nhật formData với giá trị mới nhất
      const updatedData = {
        ...formData,
        photoUrl: profilePhotoUrl || formData.photoUrl,
        resumeUrl: resumeUrl || formData.resumeUrl
      };

      console.log("Saving data to Firestore:", formData);
      console.log("Resume URL being saved:", formData.resumeUrl);
  
      await updateAboutData(updatedData);
      setFormData(updatedData); // Cập nhật state formData
      setSuccess('About information updated successfully!');
      
      // Reset state sau khi lưu thành công
      setProfilePhotoUrl(null);
      setResumeUrl(null);
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
          <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload Profile Photo</label>
                <CloudinaryUploadWidget 
                  onSuccess={handleProfilePhotoSuccess}
                  buttonText="Upload Profile Photo"
                  resourceType="image"
                  widgetId="profile" // ID duy nhất cho widget này
                />
                {(profilePhotoUrl || formData.photoUrl) && (
                  <div className="mt-4">
                    <img 
                      src={profilePhotoUrl || formData.photoUrl} 
                      alt="Profile Preview" 
                      className="w-40 h-40 rounded-full object-cover border-2 border-slate-200"
                    />
                  </div>
                )}
                {profilePhotoUrl && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-700 flex items-center">
                        <span className="mr-2">✓</span>
                        Profile photo uploaded successfully!
                      </p>
                    </div>
                )}
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
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload Resume (PDF)
          </label>
          <CloudinaryUploadWidget 
            onSuccess={handleResumeSuccess}
            buttonText="Upload Resume"
            resourceType="raw" // Quan trọng: sử dụng 'raw' cho PDF
            widgetId="resume"
          />
          {(resumeUrl || formData.resumeUrl) && (
            <div className="mt-2">
              <p className="text-sm text-slate-600">
                {resumeUrl ? "New resume selected: " : "Current resume: "}
                <a 
                  href={(resumeUrl || formData.resumeUrl || '').replace('fl_attachment/', '')}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline"
                >
                  View Resume
                </a>
              </p>
            </div>
          )}
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
