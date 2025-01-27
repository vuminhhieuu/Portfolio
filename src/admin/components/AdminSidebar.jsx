import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HiHome, 
  HiCollection, 
  HiDocumentText, 
  HiUser 
} from 'react-icons/hi';

const AdminSidebar = () => {
  const navItems = [
    { path: '/admin', icon: HiHome, label: 'Dashboard', exact: true },
    { path: '/admin/projects', icon: HiCollection, label: 'Projects' },
    { path: '/admin/blog', icon: HiDocumentText, label: 'Blog' },
    { path: '/admin/about', icon: HiUser, label: 'About' }
  ];

  return (
    <div className="bg-zinc-800 w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar; 