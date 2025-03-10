import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

interface HeroData {
  name: string;
  title: string;
  description: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    email?: string;
  };
}

export const getHeroData = async (): Promise<HeroData | null> => {
  try {
    const docRef = doc(db, 'portfolio', 'hero');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as HeroData;
    } else {
      console.log("No hero data found!");
      return null;
    }
  } catch (error) {
    console.error("Error getting hero data:", error);
    throw error;
  }
};

export const defaultHeroData: HeroData = {
  name: "Vũ Minh Hiếu",
  title: "Web Developer & UI/UX Designer",
  description: "I build exceptional digital experiences with modern technologies. Specializing in React, Node.js, and cloud architecture.",
  socialLinks: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    twitter: "https://twitter.com/",
    email: "mailto:example@example.com"
  }
};