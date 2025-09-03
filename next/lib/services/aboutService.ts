import { getDbClient } from "../firebase.client";
import { doc, getDoc } from "firebase/firestore";

export interface AboutData {
  name: string;
  email: string;
  location: string;
  availability: string;
  bio: string;
  additionalInfo: string;
  photoUrl: string;
  resumeUrl?: string;
  skills?: { name: string; level: number; }[];
}

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

export const getAboutData = async (): Promise<AboutData> => {
  const db = getDbClient();
  const docRef = doc(db, 'portfolio', 'about');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data() as AboutData;
  return defaultAboutData;
}; 