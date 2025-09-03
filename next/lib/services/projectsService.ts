import { getDbClient } from "../firebase.client";
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  order: number;
  category?: string;
  createdAt?: number;
  updatedAt?: number;
}

export const getProjects = async (): Promise<Project[]> => {
  const db = getDbClient();
  const projectsQuery = query(collection(db, 'projects'), orderBy('order'));
  const projectsSnapshot = await getDocs(projectsQuery);
  return projectsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Project[];
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  const db = getDbClient();
  const projectsQuery = query(collection(db, 'projects'), where('featured', '==', true), orderBy('order'));
  const projectsSnapshot = await getDocs(projectsQuery);
  return projectsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Project[];
};

export const getProjectsByCategory = async (category: string): Promise<Project[]> => {
  const db = getDbClient();
  const projectsQuery = query(collection(db, 'projects'), where('category', '==', category), orderBy('order'));
  const projectsSnapshot = await getDocs(projectsQuery);
  return projectsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Project[];
}; 