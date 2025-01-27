import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  orderBy,
  query 
} from 'firebase/firestore';
import { db } from '../../../firebase/config';

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    title: '',
    summary: '',
    content: '',
    tags: '',
    publishDate: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'blog'), orderBy('publishDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishDate: doc.data().publishDate.split('T')[0]
      }));
      setPosts(postsList);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        updatedAt: new Date()
      };

      if (currentPost) {
        await updateDoc(doc(db, 'blog', currentPost.id), postData);
      } else {
        await addDoc(collection(db, 'blog'), {
          ...postData,
          createdAt: new Date()
        });
      }

      setFormData(initialFormState);
      setCurrentPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deleteDoc(doc(db, 'blog', postId));
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Manage Blog Posts</h2>
      
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
          <label className="block text-zinc-400 mb-1">Summary</label>
          <input
            type="text"
            value={formData.summary}
            onChange={(e) => setFormData({...formData, summary: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2 h-32"
            required
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Publish Date</label>
          <input
            type="date"
            value={formData.publishDate}
            onChange={(e) => setFormData({...formData, publishDate: e.target.value})}
            className="w-full bg-zinc-700 text-white rounded px-4 py-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : (currentPost ? 'Update Post' : 'Add Post')}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {posts.map(post => (
          <div key={post.id} className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">{post.title}</h3>
                <p className="text-zinc-400 mt-2">{post.summary}</p>
                <div className="flex gap-2 mt-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-zinc-500 text-sm">{post.publishDate}</div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => {
                  setCurrentPost(post);
                  setFormData({
                    ...post,
                    tags: post.tags.join(', ')
                  });
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
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

export default BlogManager; 