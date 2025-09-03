import { getDbClient } from "../firebase.client";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

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

export const getExperiences = async (): Promise<Experience[]> => {
  const db = getDbClient();
  const experiencesQuery = query(collection(db, 'experiences'), orderBy('order'));
  const snap = await getDocs(experiencesQuery);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Experience[];
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(date);
};

export const calculateDuration = (startDate: string, endDate?: string, current?: boolean): string => {
  if (!startDate) return '';
  const start = new Date(startDate);
  const end = current ? new Date() : endDate ? new Date(endDate) : null;
  if (!end) return '';
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  let duration = '';
  if (years > 0) duration += `${years} year${years > 1 ? 's' : ''}`;
  if (months > 0 || (months < 0 && years > 0)) {
    const adjustedMonths = months < 0 ? 12 + months : months;
    if (duration) duration += ' ';
    duration += `${adjustedMonths} month${adjustedMonths > 1 ? 's' : ''}`;
  }
  if (!duration) return 'Less than a month';
  return duration;
}; 