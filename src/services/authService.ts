import { 
  signInWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { auth } from './firebase';

// Hàm đăng nhập
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Hàm đăng xuất
export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};