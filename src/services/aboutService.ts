import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { uploadImage, uploadFile } from './cloudinaryService';

// Định nghĩa cấu trúc dữ liệu About
export interface AboutData {
  name: string;
  email: string;
  location: string;
  availability: string;
  bio: string;
  additionalInfo: string;
  photoUrl: string;
  resumeUrl?: string;
  skills?: {
    name: string;
    level: number;
  }[];
}

// Dữ liệu mặc định
export const defaultAboutData: AboutData = {
  name: 'Vũ Minh Hiếu',
  email: 'example@example.com',
  location: 'TP. Hồ Chí Minh, Việt Nam',
  availability: 'Full-time',
  bio: 'Tôi là một Web Developer đam mê với công nghệ và thiết kế giao diện người dùng.',
  additionalInfo: 'Tôi có kinh nghiệm làm việc với React, Node.js, và các công nghệ web hiện đại khác.',
  photoUrl: '',
  skills: [
    { name: 'HTML/CSS', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 80 },
    { name: 'Node.js', level: 75 }
  ]
};

// Lấy dữ liệu About từ Firestore
export const getAboutData = async (): Promise<AboutData> => {
  try {
    const docRef = doc(db, 'portfolio', 'about');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as AboutData;
    } else {
      console.log('No about data found!');
      return defaultAboutData;
    }
  } catch (error) {
    console.error('Error getting about data:', error);
    return defaultAboutData;
  }
};

// Cập nhật dữ liệu About
export const updateAboutData = async (data: AboutData): Promise<void> => {
  try {
    const docRef = doc(db, 'portfolio', 'about');
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error updating about data:', error);
    throw error;
  }
};

// Upload ảnh hồ sơ - Sử dụng Cloudinary
export const uploadProfilePhoto = async (file: File): Promise<string> => {
  try {
    return await uploadImage(file);
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
};

// Upload CV/Resume - Sử dụng Cloudinary
export const uploadResume = async (file: File): Promise<string> => {
  try {
    return await uploadFile(file);
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};
