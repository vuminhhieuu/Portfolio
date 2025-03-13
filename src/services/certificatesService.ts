import { db, storage } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Định nghĩa interface cho Certificate
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  order: number;
}

// Lấy tất cả chứng chỉ
export const getCertificates = async (): Promise<Certificate[]> => {
  try {
    const certificatesQuery = query(collection(db, 'certificates'), orderBy('order'));
    const certificatesSnapshot = await getDocs(certificatesQuery);
    
    const certificates = certificatesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Certificate[];
    
    return certificates;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};

// Lưu chứng chỉ
export const saveCertificate = async (certificate: Certificate): Promise<Certificate> => {
  try {
    // Lưu thông tin chứng chỉ vào Firestore
    await setDoc(doc(db, 'certificates', certificate.id), certificate);
    
    return certificate;
  } catch (error) {
    console.error('Error saving certificate:', error);
    throw error;
  }
};

// Xóa chứng chỉ
export const deleteCertificate = async (certificateId: string, imageUrl: string | null = null): Promise<void> => {
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
    await deleteDoc(doc(db, 'certificates', certificateId));
  } catch (error) {
    console.error('Error deleting certificate:', error);
    throw error;
  }
};

// Cập nhật thứ tự của các chứng chỉ
export const updateCertificatesOrder = async (certificates: Certificate[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    certificates.forEach((certificate, index) => {
      const certificateRef = doc(db, 'certificates', certificate.id);
      batch.update(certificateRef, { order: index });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error updating certificates order:', error);
    throw error;
  }
};

// Tạo chứng chỉ mới với dữ liệu mặc định
export const createEmptyCertificate = (): Certificate => {
  return {
    id: uuidv4(),
    title: '',
    issuer: '',
    issueDate: '',
    imageUrl: '',
    order: 9999, // Sẽ được cập nhật khi lưu
  };
};

// Lấy chứng chỉ mới nhất
export const getLatestCertificates = async (limit: number = 3): Promise<Certificate[]> => {
  try {
    const certificatesQuery = query(collection(db, 'certificates'), orderBy('issueDate', 'desc'));
    const certificatesSnapshot = await getDocs(certificatesQuery);
    
    const certificates = certificatesSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Certificate[];
    
    return certificates.slice(0, limit);
  } catch (error) {
    console.error('Error fetching latest certificates:', error);
    throw error;
  }
};