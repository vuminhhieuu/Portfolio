import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, TrashIcon, EditIcon, SaveIcon, 
  ArrowUpIcon, ArrowDownIcon, ClockIcon
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { 
  getExperiences, saveExperience, deleteExperience, updateExperiencesOrder, 
  createEmptyExperience, Experience 
} from '../../../services/experienceService';
import { AdminHeader } from '../shared/AdminHeader';
import { AdminContent } from '../shared/AdminContent';

export function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch experiences on component mount
  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const experiencesList = await getExperiences();
      setExperiences(experiencesList);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setError('Failed to load experiences.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (!currentExperience) return;
    
    if (name === 'current' && type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentExperience({
        ...currentExperience,
        current: checked,
        endDate: checked ? '' : currentExperience.endDate
      });
    } else {
      setCurrentExperience({
        ...currentExperience,
        [name]: value
      });
    }
  };
  
  // Handle responsibilities and technologies input (comma separated)
  const handleArrayInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'responsibilities' | 'technologies') => {
    if (!currentExperience) return;
    
    const items = e.target.value
      .split('\n')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    setCurrentExperience({
      ...currentExperience,
      [field]: items
    });
  };
  
  // Reset form
  const resetForm = () => {
    setCurrentExperience(null);
    setIsEditing(false);
    setError(null);
  };
  
  // Create a new experience form
  const handleCreateNew = () => {
    setCurrentExperience(createEmptyExperience());
    setIsEditing(false);
    setError(null);
  };
  
  // Edit existing experience
  const handleEdit = (experience: Experience) => {
    setCurrentExperience({ ...experience });
    setIsEditing(true);
    setError(null);
  };
  
  // Delete experience
  const handleDelete = async (experienceId: string) => {
    if (!window.confirm('Are you sure you want to delete this experience? This action cannot be undone.')) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      await deleteExperience(experienceId);
      
      // Update local state
      setExperiences(prevExperiences => {
        const updatedExperiences = prevExperiences.filter(exp => exp.id !== experienceId);
        // Re-order experiences
        return updatedExperiences.map((exp, index) => ({ ...exp, order: index }));
      });
      
      setSuccess('Experience deleted successfully!');
      
      // Reset form if editing the deleted experience
      if (currentExperience && currentExperience.id === experienceId) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      setError('Failed to delete experience.');
    } finally {
      setSaving(false);
    }
  };
  
  // Save experience
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentExperience) return;
    
    // Validate required fields
    if (!currentExperience.company.trim()) {
      setError('Company name is required.');
      return;
    }
    
    if (!currentExperience.position.trim()) {
      setError('Position is required.');
      return;
    }
    
    if (!currentExperience.startDate.trim()) {
      setError('Start date is required.');
      return;
    }
    
    if (!currentExperience.current && !currentExperience.endDate?.trim()) {
      setError('End date is required if not currently working here.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Update order if it's a new experience
      if (!isEditing) {
        currentExperience.order = experiences.length;
      }
      
      const savedExperience = await saveExperience(currentExperience);
      
      if (isEditing) {
        // Update existing experience in state
        setExperiences(prevExperiences => 
          prevExperiences.map(exp => exp.id === savedExperience.id ? savedExperience : exp)
        );
        setSuccess('Experience updated successfully!');
      } else {
        // Add new experience to state
        setExperiences(prevExperiences => [...prevExperiences, savedExperience]);
        setSuccess('Experience created successfully!');
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving experience:', error);
      setError('Failed to save experience.');
    } finally {
      setSaving(false);
    }
  };
    // Handle experience order change
    const handleMoveExperience = (experienceId: string, direction: 'up' | 'down') => {
        const currentIndex = experiences.findIndex(exp => exp.id === experienceId);
        if (currentIndex === -1) return;
        
        const newExperiences = [...experiences];
        
        if (direction === 'up' && currentIndex > 0) {
          // Swap with previous experience
          [newExperiences[currentIndex], newExperiences[currentIndex - 1]] = 
          [newExperiences[currentIndex - 1], newExperiences[currentIndex]];
        } else if (direction === 'down' && currentIndex < experiences.length - 1) {
          // Swap with next experience
          [newExperiences[currentIndex], newExperiences[currentIndex + 1]] = 
          [newExperiences[currentIndex + 1], newExperiences[currentIndex]];
        } else {
          return; // No change needed
        }
        
        // Update order property for each experience
        const updatedExperiences = newExperiences.map((experience, index) => ({
          ...experience,
          order: index
        }));
        
        setExperiences(updatedExperiences);
        
        // Save new order to database
        updateExperiencesOrder(updatedExperiences).catch(error => {
          console.error('Error updating experiences order:', error);
          setError('Failed to update experiences order.');
        });
      };
      
      // Format date for display
      const formatDateForDisplay = (dateString: string) => {
        if (!dateString) return '';
        
        try {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'short' 
          }).format(date);
        } catch (error) {
          return dateString;
        }
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
            Add Experience
          </button>
        </>
      );
      
      return (
        <>
          <AdminHeader 
            title="Manage Work Experience" 
            error={error} 
            success={success} 
            actions={headerActions} 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Experiences List */}
            <AdminContent isLoading={loading}>
              <div className="lg:col-span-2 mb-6">
                <h2 className="text-xl font-semibold">Experiences List</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Drag to reorder your work experiences. The most recent ones will appear first.
                </p>
              </div>
              
              {experiences.length === 0 ? (
                <div className="bg-slate-50 p-6 rounded-lg text-center">
                  <p className="text-slate-600">
                    No work experiences found. Add your first work experience!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {experiences.map((experience) => (
                    <div 
                      key={experience.id}
                      className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {experience.position} 
                            {experience.current && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <ClockIcon size={12} className="mr-1" />
                                Current
                              </span>
                            )}
                          </h3>
                          <p className="text-slate-600">{experience.company}</p>
                          <p className="text-sm text-slate-500 mt-1">
                            {formatDateForDisplay(experience.startDate)} - {experience.current ? 'Present' : formatDateForDisplay(experience.endDate || '')}
                          </p>
                          
                          {/* Location */}
                          {experience.location && (
                            <p className="text-sm text-slate-500 mt-1">
                              {experience.location}
                            </p>
                          )}
                          
                          {/* Technologies Tags */}
                          {experience.technologies && experience.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {experience.technologies.map((tech, index) => (
                                <span 
                                  key={index}
                                  className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMoveExperience(experience.id, 'up')}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            title="Move Up"
                            disabled={experiences.indexOf(experience) === 0}
                          >
                            <ArrowUpIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleMoveExperience(experience.id, 'down')}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            title="Move Down"
                            disabled={experiences.indexOf(experience) === experiences.length - 1}
                          >
                            <ArrowDownIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(experience)}
                            className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Experience"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(experience.id)}
                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Experience"
                            disabled={saving}
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminContent>
            
            {/* Experience Form */}
            <AdminContent>
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              
              {currentExperience ? (
                <form onSubmit={handleSave} className="space-y-4">
                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Position/Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={currentExperience.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={currentExperience.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Company Website */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Company Website URL
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={currentExperience.url || ''}
                      onChange={handleInputChange}
                      placeholder="https://company-website.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={currentExperience.location || ''}
                      onChange={handleInputChange}
                      placeholder="City, Country or Remote"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                                            type="date"
                                            name="startDate"
                                            value={currentExperience.startDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-slate-700 mb-1">
                                            End Date
                                            {!currentExperience.current && <span className="text-red-500">*</span>}
                                          </label>
                                          <input
                                            type="date"
                                            name="endDate"
                                            value={currentExperience.endDate || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={currentExperience.current}
                                            required={!currentExperience.current}
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* Current Position */}
                                      <div className="flex items-center">
                                        <input
                                          type="checkbox"
                                          id="current"
                                          name="current"
                                          checked={currentExperience.current}
                                          onChange={handleInputChange}
                                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="current" className="ml-2 text-sm font-medium text-slate-700">
                                          I currently work here
                                        </label>
                                      </div>
                                      
                                      {/* Description */}
                                      <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                          Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                          name="description"
                                          value={currentExperience.description}
                                          onChange={handleInputChange}
                                          rows={3}
                                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          required
                                          placeholder="Describe your role and achievements"
                                        />
                                      </div>
                                      
                                      {/* Responsibilities */}
                                      <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                          Key Responsibilities (one per line)
                                        </label>
                                        <textarea
                                          value={(currentExperience.responsibilities || []).join('\n')}
                                          onChange={(e) => handleArrayInputChange(e, 'responsibilities')}
                                          rows={4}
                                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Lead a team of 5 developers\nImplemented CI/CD pipeline\nReduced loading time by 40%"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                          Enter each responsibility on a new line. These will be displayed as bullet points.
                                        </p>
                                      </div>
                                      
                                      {/* Technologies */}
                                      <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                          Technologies Used (one per line)
                                        </label>
                                        <textarea
                                          value={(currentExperience.technologies || []).join('\n')}
                                          onChange={(e) => handleArrayInputChange(e, 'technologies')}
                                          rows={3}
                                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="React\nNode.js\nTypeScript"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                          Enter each technology on a new line. These will be displayed as tags.
                                        </p>
                                      </div>
                                      
                                      {/* Company Logo URL */}
                                      <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                          Company Logo URL
                                        </label>
                                        <input
                                          type="url"
                                          name="logo"
                                          value={currentExperience.logo || ''}
                                          onChange={handleInputChange}
                                          placeholder="https://example.com/logo.png"
                                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                          Direct link to a company logo image. Recommended size: 120x120px.
                                        </p>
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
                                              {isEditing ? 'Update Experience' : 'Save Experience'}
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
                                        No Experience Selected
                                      </h3>
                                      <p className="text-slate-500 mb-4">
                                        Create a new work experience entry or select an existing one to edit.
                                      </p>
                                      <button
                                        onClick={handleCreateNew}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                                      >
                                        <PlusIcon size={16} />
                                        Add New Experience
                                      </button>
                                    </div>
                                  )}
                                </AdminContent>
                              </div>
                            </>
                          );
                        }