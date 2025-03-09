import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockIcon } from "lucide-react";
export function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add authentication logic here
    if (credentials.username === "admin" && credentials.password === "password") {
      navigate("/admin");
    } else {
      setError("Invalid credentials");
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <LockIcon size={24} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
          </div>
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <input type="text" id="username" value={credentials.username} onChange={e => setCredentials(prev => ({
              ...prev,
              username: e.target.value
            }))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input type="password" id="password" value={credentials.password} onChange={e => setCredentials(prev => ({
              ...prev,
              password: e.target.value
            }))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>;
}