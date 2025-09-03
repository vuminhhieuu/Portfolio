import { getDbClient } from "../firebase.client";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

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

export const getCertificates = async (): Promise<Certificate[]> => {
  const db = getDbClient();
  const certificatesQuery = query(collection(db, 'certificates'), orderBy('order'));
  const snap = await getDocs(certificatesQuery);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Certificate[];
}; 