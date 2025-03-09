import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboardIcon, UserIcon, WrenchIcon, FolderIcon, AwardIcon, BriefcaseIcon, MessageSquareIcon, ImageIcon, LogOutIcon } from "lucide-react";
export function AdminLayout() {
  const navigate = useNavigate();
  const menuItems = [{
    icon: LayoutDashboardIcon,
    label: "Dashboard",
    path: "/admin"
  }, {
    icon: UserIcon,
    label: "About Me",
    path: "/admin/about"
  }, {
    icon: WrenchIcon,
    label: "Skills",
    path: "/admin/skills"
  }, {
    icon: FolderIcon,
    label: "Projects",
    path: "/admin/projects"
  }, {
    icon: AwardIcon,
    label: "Certificates",
    path: "/admin/certificates"
  }, {
    icon: BriefcaseIcon,
    label: "Experience",
    path: "/admin/experience"
  }, {
    icon: MessageSquareIcon,
    label: "Messages",
    path: "/admin/messages"
  }, {
    icon: ImageIcon,
    label: "Media",
    path: "/admin/media"
  }];
  const handleLogout = () => {
    // Add logout logic here
    navigate("/admin/login");
  };
  return <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-white border-r border-slate-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-800">
              Portfolio Admin
            </h1>
          </div>
          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {menuItems.map(item => {
              const Icon = item.icon;
              return <li key={item.path}>
                    <button onClick={() => navigate(item.path)} className="flex items-center w-full px-4 py-2 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors">
                      <Icon size={20} className="mr-3" />
                      {item.label}
                    </button>
                  </li>;
            })}
            </ul>
          </nav>
          {/* Logout */}
          <div className="p-4 border-t border-slate-200">
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-red-600 transition-colors">
              <LogOutIcon size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>;
}