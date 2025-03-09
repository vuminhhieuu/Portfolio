import React from "react";
import { UsersIcon, FolderIcon, AwardIcon, MessageSquareIcon, TrendingUpIcon } from "lucide-react";
export function Dashboard() {
  const stats = [{
    icon: FolderIcon,
    label: "Total Projects",
    value: "12"
  }, {
    icon: AwardIcon,
    label: "Certificates",
    value: "8"
  }, {
    icon: MessageSquareIcon,
    label: "New Messages",
    value: "5"
  }, {
    icon: TrendingUpIcon,
    label: "Profile Views",
    value: "1.2k"
  }];
  const recentMessages = [{
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    message: "Interested in collaboration...",
    date: "2 hours ago"
  }, {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    message: "Great portfolio! Would love to...",
    date: "5 hours ago"
  }];
  return <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Dashboard</h1>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
        const Icon = stat.icon;
        return <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-600">
                    {stat.label}
                  </h3>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>;
      })}
      </div>
      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Messages
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {recentMessages.map(message => <div key={message.id} className="px-6 py-4">
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
            </div>)}
        </div>
      </div>
    </div>;
}