import React, { useState, useEffect } from "react";
import { UsersIcon, FolderIcon, AwardIcon, MessageSquareIcon, TrendingUpIcon } from "lucide-react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../services/firebase";
import { getProjects } from "../../services/projectsService";
import { getCertificates } from "../../services/certificatesService";

export function Dashboard() {
  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0,
    messages: 0,
    profileViews: 0
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  // Fetch data from Firebase
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Use existing service functions for projects and certificates
        const projectsData = await getProjects();
        const certificatesData = await getCertificates();
        
        // For messages - check if collection exists
        let messagesData: any[] = [];
        let messagesCount = 0;
        
        try {
          const messagesQuery = query(
            collection(db, "messages"),
            orderBy("createdAt", "desc"),
            limit(5)
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          messagesCount = messagesSnapshot.size;
          
          messagesData = messagesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || "Anonymous",
              email: data.email || "No email provided",
              message: data.message || "No message content",
              date: formatDate(data.createdAt)
            };
          });
        } catch (err) {
          console.log("Messages collection might not exist yet");
          // Don't throw error - just use empty messages
        }
        
        // For profile views - check if collection/document exists
        let profileViews = 0;
        try {
          const viewsQuery = query(collection(db, "analytics"));
          const viewsSnapshot = await getDocs(viewsQuery);
          viewsSnapshot.forEach(doc => {
            if (doc.id === "profileViews") {
              profileViews = doc.data().count || 0;
            }
          });
        } catch (err) {
          console.log("Analytics collection might not exist yet");
          // Don't throw error - just use zero for profile views
        }
        
        // Update stats state
        setStats({
          projects: projectsData.length,
          certificates: certificatesData.length,
          messages: messagesCount,
          profileViews
        });
        
        setRecentMessages(messagesData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Helper function to format Firebase timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return "Unknown date";
    
    try {
      const now = new Date();
      const messageDate = timestamp.toDate();
      const diffInMs = now.getTime() - messageDate.getTime();
      
      // Less than a day
      if (diffInMs < 86400000) {
        const hours = Math.floor(diffInMs / 3600000);
        if (hours < 1) {
          const minutes = Math.floor(diffInMs / 60000);
          return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        }
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      }
      
      // Less than a week
      if (diffInMs < 604800000) {
        const days = Math.floor(diffInMs / 86400000);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      }
      
      // Format with date
      return messageDate.toLocaleDateString();
    } catch (err) {
      return "Invalid date";
    }
  };
  
  // Prepare stats data for the UI
  const statsData = [
    {
      icon: FolderIcon,
      label: "Total Projects",
      value: loading ? "-" : stats.projects.toString()
    },
    {
      icon: AwardIcon,
      label: "Certificates",
      value: loading ? "-" : stats.certificates.toString()
    },
    {
      icon: MessageSquareIcon,
      label: "Messages",
      value: loading ? "-" : stats.messages.toString()
    },
    {
      icon: TrendingUpIcon,
      label: "Profile Views",
      value: loading ? "-" : stats.profileViews > 1000 
        ? `${(stats.profileViews / 1000).toFixed(1)}k` 
        : stats.profileViews.toString()
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-600">
                    {stat.label}
                  </h3>
                  <div className="text-2xl font-semibold text-slate-900">
                    {loading ? (
                      <span className="inline-block w-10 h-6 bg-slate-200 animate-pulse rounded"></span>
                    ) : (
                      stat.value
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Messages
          </h2>
        </div>
        
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(item => (
              <div key={item} className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            {error}
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            No messages to display.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {recentMessages.map(message => (
              <div key={message.id} className="px-6 py-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-slate-900">
                      {message.name}
                    </h3>
                    <p className="text-sm text-slate-600">{message.email}</p>
                    <p className="mt-1 text-sm text-slate-800">
                      {message.message}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">{message.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}