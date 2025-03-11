import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, TrashIcon, EditIcon, SaveIcon, ExternalLinkIcon, 
  GithubIcon, StarIcon, UploadIcon, XIcon, ArrowUpIcon, ArrowDownIcon, CheckIcon
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { 
  getProjects, saveProject, deleteProject, updateProjectsOrder, 
  createEmptyProject, Project 
} from '../../../services/projectsService';
import { AdminHeader } from '../shared/AdminHeader';
import { AdminContent } from '../shared/AdminContent';

// Main component
export function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Get all unique categories from projects
  const getCategories = useCallback(() => {
    const categories = new Set<string>();
    projects.forEach(project => {
      if (project.category) {
        categories.add(project.category);
      }
    });
    return ['all', ...Array.from(categories)];
  }, [projects]);
  
  // Fetch projects on component mount
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsList = await getProjects();
      setProjects(projectsList);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  // Filter projects based on search term and category
  const filteredProjects = useCallback(() => {
    return projects
      .filter(project => {
        // Filter by search term
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            project.title.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower) ||
            project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
          );
        }
        return true;
      })
      .filter(project => {
        // Filter by category
        if (selectedCategory !== 'all') {
          return project.category === selectedCategory;
        }
        return true;
      });
  }, [projects, searchTerm, selectedCategory]);
  
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
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (!currentProject) return;
    
    setCurrentProject({
      ...currentProject,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  
  // Handle technologies input
  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentProject) return;
    
    const techArray = e.target.value
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech);
      
    setCurrentProject({
      ...currentProject,
      technologies: techArray
    });
  };
  
  // Reset form
  const resetForm = () => {
    setCurrentProject(null);
    setSelectedFile(null);
    setPreviewImage(null);
    setIsEditing(false);
    setError(null);
  };
  
  // Create a new project form
  const handleCreateNew = () => {
    setCurrentProject(createEmptyProject());
    setIsEditing(false);
    setPreviewImage(null);
    setSelectedFile(null);
    setError(null);
  };
  
  // Edit existing project
  const handleEdit = (project: Project) => {
    setCurrentProject({ ...project });
    setIsEditing(true);
    setPreviewImage(null);
    setSelectedFile(null);
    setError(null);
  };
  
  // Delete project
  const handleDelete = async (projectId: string, imageUrl: string | null) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      await deleteProject(projectId, imageUrl || null);
      
      // Update local state
      setProjects(prevProjects => {
        const updatedProjects = prevProjects.filter(p => p.id !== projectId);
        // Re-order projects
        return updatedProjects.map((p, index) => ({ ...p, order: index }));
      });
      
      setSuccess('Project deleted successfully!');
      
      // Reset form if editing the deleted project
      if (currentProject && currentProject.id === projectId) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project.');
    } finally {
      setSaving(false);
    }
  };
    // Save project
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentProject) return;
        
        // Validate required fields
        if (!currentProject.title.trim()) {
          setError('Project title is required.');
          return;
        }
        
        if (!currentProject.description.trim()) {
          setError('Project description is required.');
          return;
        }
        
        try {
          setSaving(true);
          setError(null);
          
          // Update order if it's a new project
          if (!isEditing) {
            currentProject.order = projects.length;
          }
          
          const savedProject = await saveProject(currentProject, selectedFile);
          
          if (isEditing) {
            // Update existing project in state
            setProjects(prevProjects => 
              prevProjects.map(p => p.id === savedProject.id ? savedProject : p)
            );
            setSuccess('Project updated successfully!');
          } else {
            // Add new project to state
            setProjects(prevProjects => [...prevProjects, savedProject]);
            setSuccess('Project created successfully!');
          }
          
          // Reset form
          resetForm();
        } catch (error) {
          console.error('Error saving project:', error);
          setError('Failed to save project.');
        } finally {
          setSaving(false);
        }
      };
      
      // Handle project order change
      const handleMoveProject = (projectId: string, direction: 'up' | 'down') => {
        const currentIndex = projects.findIndex(p => p.id === projectId);
        if (currentIndex === -1) return;
        
        const newProjects = [...projects];
        
        if (direction === 'up' && currentIndex > 0) {
          // Swap with previous project
          [newProjects[currentIndex], newProjects[currentIndex - 1]] = 
          [newProjects[currentIndex - 1], newProjects[currentIndex]];
        } else if (direction === 'down' && currentIndex < projects.length - 1) {
          // Swap with next project
          [newProjects[currentIndex], newProjects[currentIndex + 1]] = 
          [newProjects[currentIndex + 1], newProjects[currentIndex]];
        } else {
          return; // No change needed
        }
        
        // Update order property for each project
        const updatedProjects = newProjects.map((project, index) => ({
          ...project,
          order: index
        }));
        
        setProjects(updatedProjects);
        
        // Save new order to database
        updateProjectsOrder(updatedProjects).catch(error => {
          console.error('Error updating projects order:', error);
          setError('Failed to update projects order.');
        });
      };
      
      // Toggle featured status
      const handleToggleFeatured = async (project: Project) => {
        try {
          const updatedProject = {
            ...project,
            featured: !project.featured
          };
          
          await saveProject(updatedProject);
          
          // Update local state
          setProjects(prevProjects => 
            prevProjects.map(p => p.id === project.id ? updatedProject : p)
          );
          
          setSuccess(`Project ${updatedProject.featured ? 'marked as featured' : 'removed from featured'}`);
        } catch (error) {
          console.error('Error toggling featured status:', error);
          setError('Failed to update featured status.');
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
            Add Project
          </button>
        </>
      );
      
      return (
        <>
          <AdminHeader 
            title="Manage Projects" 
            error={error} 
            success={success} 
            actions={headerActions} 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects List */}
            <div className={`lg:col-span-2 ${loading ? 'opacity-50' : ''}`}>
              <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
                <h2 className="text-xl font-semibold">Projects List</h2>
                
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  >
                    {getCategories().map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                  
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search projects..."
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
              </div>
              
              {filteredProjects().length === 0 ? (
                <div className="bg-slate-50 p-6 rounded-lg text-center">
                  <p className="text-slate-600">
                    {projects.length === 0 
                      ? "No projects found. Add your first project!" 
                      : "No projects match your search criteria."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProjects().map((project) => (
                    <div 
                      key={project.id}
                      className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        {/* Project Image */}
                        <div className="w-20 h-20 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                          {project.imageUrl ? (
                            <img 
                              src={project.imageUrl} 
                              alt={project.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs text-slate-400">No image</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Project Info */}
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-slate-800 flex items-center gap-2">
                              {project.title}
                              {project.featured && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <StarIcon size={12} className="mr-1" />
                                  Featured
                                </span>
                              )}
                              {project.category && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                  {project.category}
                                </span>
                              )}
                            </h3>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleFeatured(project)}
                                className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                                  project.featured ? 'text-yellow-500' : 'text-slate-400'
                                }`}
                                title={project.featured ? "Remove from featured" : "Mark as featured"}
                              >
                                <StarIcon size={16} />
                              </button>
                              <button
                                onClick={() => handleMoveProject(project.id, 'up')}
                                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                title="Move Up"
                                disabled={projects.indexOf(project) === 0}
                              >
                                <ArrowUpIcon size={16} />
                              </button>
                              <button
                                onClick={() => handleMoveProject(project.id, 'down')}
                                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                title="Move Down"
                                disabled={projects.indexOf(project) === projects.length - 1}
                              >
                                <ArrowDownIcon size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(project)}
                                className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit Project"
                              >
                                <EditIcon size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(project.id, project.imageUrl)}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete Project"
                                disabled={saving}
                              >
                                <TrashIcon size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                            {project.description}
                          </p>
                          
                          {/* Technologies Tags */}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.technologies.map((tech, index) => (
                                <span 
                                  key={index}
                                  className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Links */}
                          <div className="flex gap-4 mt-2">
                            {project.githubUrl && (
                              <a 
                                href={project.githubUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-slate-500 hover:text-slate-700"
                              >
                                <GithubIcon size={14} className="mr-1" />
                                GitHub
                              </a>
                            )}
                            {project.demoUrl && (
                              <a 
                                href={project.demoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-slate-500 hover:text-slate-700"
                              >
                                <ExternalLinkIcon size={14} className="mr-1" />
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Project Form */}
            <AdminContent>
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Project' : 'Add New Project'}
              </h2>
              
              {currentProject ? (
                <form onSubmit={handleSave} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={currentProject.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={currentProject.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
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
                      value={currentProject.category || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., Web App, Mobile App, etc."
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Technologies */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      name="technologies"
                      value={currentProject.technologies.join(', ')}
                      onChange={handleTechnologiesChange}
                      placeholder="e.g., React, Node.js, MongoDB"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* GitHub URL */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={currentProject.githubUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/project"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Demo URL */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Demo URL
                    </label>
                    <input
                      type="url"
                      name="demoUrl"
                      value={currentProject.demoUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://your-demo-site.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Featured */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={currentProject.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm font-medium text-slate-700">
                      Featured Project (shown prominently on portfolio)
                    </label>
                  </div>
                  
                  {/* Project Image */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Project Image
                    </label>
                    
                    {/* Image Preview */}
                    {(previewImage || currentProject.imageUrl) && (
                      <div className="mt-2 mb-4">
                        <div className="relative w-full max-w-xs">
                          <img 
                            src={previewImage || currentProject.imageUrl} 
                            alt="Project Preview" 
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
                          {isEditing ? 'Update Project' : 'Create Project'}
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
                    No Project Selected
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Create a new project or select an existing one to edit.
                  </p>
                  <button
                    onClick={handleCreateNew}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <PlusIcon size={16} />
                    Add New Project
                  </button>
                </div>
              )}
            </AdminContent>
          </div>
        </>
      );
    }

