import { createBrowserRouter } from 'react-router-dom';
import { Portfolio } from '../pages/Portfolio';
import { Login } from '../components/admin/Login';
import { AdminLayout } from '../components/admin/AdminLayout';
import { Dashboard } from '../components/admin/Dashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { 
  HeroAdmin,
  AboutAdmin, 
  SkillsAdmin, 
  ProjectsAdmin, 
  CertificatesAdmin, 
  ExperienceAdmin, 
  MessagesAdmin, 
  MediaAdmin 
} from '../components/admin/pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Portfolio />
  },
  {
    path: '/admin/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'hero', element: <HeroAdmin /> }, 
          { path: 'about', element: <AboutAdmin /> },
          { path: 'skills', element: <SkillsAdmin /> },
          { path: 'projects', element: <ProjectsAdmin /> },
          { path: 'certificates', element: <CertificatesAdmin /> },
          { path: 'experience', element: <ExperienceAdmin /> },
          { path: 'messages', element: <MessagesAdmin /> },
          { path: 'media', element: <MediaAdmin /> }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">404</h1>
        <p className="text-slate-600 mb-6">Page not found</p>
        <a href="/" className="text-blue-500 hover:underline">Go back home</a>
      </div>
    </div>
  }
]);