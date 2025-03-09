// src/services/aboutService.ts
import { db, storage } from './firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Define the About data structure
export interface AboutData {
  name: string;
  email: string;
  location: string;
  availability: string;
  bio: string; // First paragraph
  additionalInfo: string; // Second paragraph
  photoUrl: string;
  resumeUrl?: string;
}

// Default data
export const defaultAboutData: AboutData = {
  name: '',
  email: '',
  location: '',
  availability: '',
  bio: '',
  additionalInfo: '',
  photoUrl: '',
  resumeUrl: ''
};

// Get about data
export const getAboutData = async (): Promise<AboutData> => {
  try {
    const docRef = doc(db, 'portfolio', 'about');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as AboutData;
    } else {
      // If no document exists, return default data
      return defaultAboutData;
    }
  } catch (error) {
    console.error('Error getting about data:', error);
    throw error;
  }
};

// Update about data
export const updateAboutData = async (data: AboutData): Promise<void> => {
  try {
    const docRef = doc(db, 'portfolio', 'about');
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error updating about data:', error);
    throw error;
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `profile/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
};

// Upload resume
export const uploadResume = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `resume/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};

// Delete file from storage
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};