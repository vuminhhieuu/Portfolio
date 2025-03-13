import { db, storage } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, where, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Định nghĩa kiểu dữ liệu cho Project
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
  category?: string; // Thêm trường category cho việc phân loại dự án
  createdAt?: number; // Thời gian tạo project
  updatedAt?: number; // Thời gian cập nhật cuối cùng
}

// Lấy tất cả projects
export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsQuery = query(collection(db, 'projects'), orderBy('order'));
    const projectsSnapshot = await getDocs(projectsQuery);
    
    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
    
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Lấy featured projects
export const getFeaturedProjects = async (): Promise<Project[]> => {
  try {
    const projectsQuery = query(
      collection(db, 'projects'), 
      where('featured', '==', true),
      orderBy('order')
    );
    const projectsSnapshot = await getDocs(projectsQuery);
    
    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
    
    return projects;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    throw error;
  }
};

// Lấy projects theo category
export const getProjectsByCategory = async (category: string): Promise<Project[]> => {
  try {
    const projectsQuery = query(
      collection(db, 'projects'), 
      where('category', '==', category),
      orderBy('order')
    );
    const projectsSnapshot = await getDocs(projectsQuery);
    
    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
    
    return projects;
  } catch (error) {
    console.error(`Error fetching projects by category ${category}:`, error);
    throw error;
  }
};

// Lưu một project
export const saveProject = async (project: Project): Promise<Project> => {
  try {
    // Thêm/cập nhật timestamps
    const now = Date.now();
    const updatedProject = {
      ...project,
      updatedAt: now
    };
    
    // Nếu là project mới, thêm createdAt
    if (!project.createdAt) {
      updatedProject.createdAt = now;
    }
    
    // Lưu thông tin project vào Firestore
    await setDoc(doc(db, 'projects', project.id), updatedProject);
    
    return updatedProject;
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
};

// Xóa một project
export const deleteProject = async (projectId: string, imageUrl: string | null = null): Promise<void> => {
  try {
    // Xóa ảnh từ storage nếu có
    if (imageUrl) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.log('Error deleting image or no image to delete:', error);
      }
    }
    
    // Xóa document từ Firestore
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Cập nhật thứ tự của projects
export const updateProjectsOrder = async (projects: Project[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    projects.forEach((project, index) => {
      const projectRef = doc(db, 'projects', project.id);
      batch.update(projectRef, { order: index });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error updating projects order:', error);
    throw error;
  }
};

// Lấy tất cả categories từ projects
export const getAllCategories = async (): Promise<string[]> => {
  try {
    const projects = await getProjects();
    const categories = new Set<string>();
    
    projects.forEach(project => {
      if (project.category) {
        categories.add(project.category);
      }
    });
    
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error getting all categories:', error);
    throw error;
  }
};

// Tạo project mới với dữ liệu mặc định
export const createEmptyProject = (): Project => {
  return {
    id: uuidv4(),
    title: '',
    description: '',
    technologies: [],
    imageUrl: '',
    githubUrl: '',
    demoUrl: '',
    featured: false,
    order: 9999, // Sẽ được cập nhật khi lưu
    category: '',
    createdAt: Date.now()
  };
};