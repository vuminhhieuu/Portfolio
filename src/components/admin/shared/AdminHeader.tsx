import React from 'react';

interface AdminHeaderProps {
  title: string;
  error: string | null;
  success: string | null;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, error, success, actions }: AdminHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
    </div>
  );
} 