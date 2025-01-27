import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase/config';

const AboutManager = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    experience: '',
    education: '',
    profileImage: ''
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const docRef = doc(db, 'about', 'profile');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setFormData({
          ...docSnap.data(),
          skills: docSnap.data().skills.join(', ')
        });
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `profile/${file.name}-${Date.now()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.profileImage;
      
      if (e.target.profileImage.files[0]) {
        imageUrl = await handleImageUpload(e.target.profileImage.files[0]);
      }

      await setDoc(doc(db, 'about', 'profile'), {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        profileImage: imageUrl,
        updatedAt: new Date()
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Manage About Section</h2>
      
      <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded-lg space-y-4">
        <div>
          <label className="block text-zinc-400 mb-1">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2 h-32"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Skills (comma-separated)</label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Experience</label>
          <textarea
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2 h-32"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Education</label>
          <textarea
            value={formData.education}
            onChange={(e) => setFormData({...formData, education: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Profile Image</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
          />
          {formData.profileImage && (
            <img 
              src={formData.profileImage} 
              alt="Profile Preview" 
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default AboutManager; 