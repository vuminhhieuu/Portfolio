import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../../../firebase/config';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    title: '',
    description: '',
    demoLink: '',
    githubLink: '',
    technologies: '',
    imageUrl: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsList);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `projects/${file.name}-${Date.now()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;
      
      if (e.target.image.files[0]) {
        imageUrl = await handleImageUpload(e.target.image.files[0]);
      }

      if (currentProject) {
        // Update existing project
        await updateDoc(doc(db, 'projects', currentProject.id), {
          ...formData,
          imageUrl,
          updatedAt: new Date()
        });
      } else {
        // Add new project
        await addDoc(collection(db, 'projects'), {
          ...formData,
          imageUrl,
          createdAt: new Date()
        });
      }

      setFormData(initialFormState);
      setCurrentProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      // Delete image from storage if exists
      if (project.imageUrl) {
        const imageRef = ref(storage, project.imageUrl);
        await deleteObject(imageRef);
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, 'projects', project.id));
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Manage Projects</h2>
      
      <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded-lg space-y-4">
        <div>
          <label className="block text-zinc-400 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Demo Link</label>
          <input
            type="url"
            value={formData.demoLink}
            onChange={(e) => setFormData({...formData, demoLink: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">GitHub Link</label>
          <input
            type="url"
            value={formData.githubLink}
            onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Technologies (comma-separated)</label>
          <input
            type="text"
            value={formData.technologies}
            onChange={(e) => setFormData({...formData, technologies: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : (currentProject ? 'Update Project' : 'Add Project')}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(project => (
          <div key={project.id} className="bg-zinc-800 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-white">{project.title}</h3>
            <p className="text-zinc-400 mt-2">{project.description}</p>
            {project.imageUrl && (
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-48 object-cover rounded mt-2"
              />
            )}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => {
                  setCurrentProject(project);
                  setFormData(project);
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager; 