import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  HiCollection, 
  HiDocumentText, 
  HiClock, 
  HiEye 
} from 'react-icons/hi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalPosts: 0,
    recentProjects: [],
    recentPosts: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch projects count and recent projects
      const projectsQuery = query(
        collection(db, 'projects'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const projectsSnapshot = await getDocs(projectsQuery);
      
      // Fetch posts count and recent posts
      const postsQuery = query(
        collection(db, 'blog'),
        orderBy('publishDate', 'desc'),
        limit(5)
      );
      const postsSnapshot = await getDocs(postsQuery);

      setStats({
        totalProjects: projectsSnapshot.size,
        totalPosts: postsSnapshot.size,
        recentProjects: projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })),
        recentPosts: postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, className }) => (
    <div className={`bg-zinc-800 p-6 rounded-lg ${className}`}>
      <div className="flex items-center space-x-4">
        <Icon className="w-8 h-8 text-zinc-400" />
        <div>
          <h3 className="text-zinc-400 text-sm">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={HiCollection}
          title="Total Projects"
          value={stats.totalProjects}
        />
        <StatCard
          icon={HiDocumentText}
          title="Total Blog Posts"
          value={stats.totalPosts}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-zinc-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {stats.recentProjects.map(project => (
              <div key={project.id} className="flex items-center space-x-3">
                <HiClock className="w-5 h-5 text-zinc-400" />
                <div>
                  <h3 className="text-white font-medium">{project.title}</h3>
                  <p className="text-zinc-400 text-sm">
                    {new Date(project.createdAt?.toDate()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-zinc-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Recent Blog Posts</h2>
          <div className="space-y-4">
            {stats.recentPosts.map(post => (
              <div key={post.id} className="flex items-center space-x-3">
                <HiEye className="w-5 h-5 text-zinc-400" />
                <div>
                  <h3 className="text-white font-medium">{post.title}</h3>
                  <p className="text-zinc-400 text-sm">
                    {new Date(post.publishDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 