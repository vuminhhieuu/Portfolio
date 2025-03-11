import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Định nghĩa interface cho kinh nghiệm làm việc
export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities?: string[];
  technologies?: string[];
  order: number;
  logo?: string;
  url?: string;
}

// Lấy tất cả kinh nghiệm làm việc
export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const experiencesQuery = query(collection(db, 'experiences'), orderBy('order'));
    const experiencesSnapshot = await getDocs(experiencesQuery);
    
    const experiences = experiencesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Experience[];
    
    return experiences;
  } catch (error) {
    console.error('Error fetching experiences:', error);
    throw error;
  }
};

// Lưu kinh nghiệm làm việc
export const saveExperience = async (experience: Experience): Promise<Experience> => {
  try {
    // Đảm bảo trường current được cập nhật chính xác
    if (experience.current) {
      experience.endDate = "";
    }
    
    // Lưu thông tin kinh nghiệm vào Firestore
    await setDoc(doc(db, 'experiences', experience.id), experience);
    
    return experience;
  } catch (error) {
    console.error('Error saving experience:', error);
    throw error;
  }
};

// Xóa kinh nghiệm làm việc
export const deleteExperience = async (experienceId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'experiences', experienceId));
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};

// Cập nhật thứ tự của các kinh nghiệm làm việc
export const updateExperiencesOrder = async (experiences: Experience[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    experiences.forEach((experience, index) => {
      const experienceRef = doc(db, 'experiences', experience.id);
      batch.update(experienceRef, { order: index });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error updating experiences order:', error);
    throw error;
  }
};

// Tạo kinh nghiệm mới với dữ liệu mặc định
export const createEmptyExperience = (): Experience => {
  return {
    id: uuidv4(),
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: [],
    technologies: [],
    order: 9999, // Sẽ được cập nhật khi lưu
    logo: '',
    url: ''
  };
};

// Format ngày để hiển thị
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long' 
  }).format(date);
};

// Tính toán thời gian làm việc
export const calculateDuration = (startDate: string, endDate?: string, current?: boolean): string => {
  if (!startDate) return '';
  
  const start = new Date(startDate);
  const end = current ? new Date() : endDate ? new Date(endDate) : null;
  
  if (!end) return '';
  
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  
  let duration = '';
  
  if (years > 0) {
    duration += `${years} year${years > 1 ? 's' : ''}`;
  }
  
  if (months > 0 || (months < 0 && years > 0)) {
    const adjustedMonths = months < 0 ? 12 + months : months;
    if (duration) duration += ' ';
    duration += `${adjustedMonths} month${adjustedMonths > 1 ? 's' : ''}`;
  }
  
  if (!duration) {
    return 'Less than a month';
  }
  
  return duration;
};