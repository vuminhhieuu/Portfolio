import { db } from "./firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

// Định nghĩa types
export interface Skill {
  id: string;
  name: string;
  level: string;
  category: string;
  icon?: string;
  color?: string;
  order?: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: Skill[];
  order?: number;
}

// Lấy tất cả skills từ Firebase
export const getSkills = async (): Promise<SkillCategory[]> => {
  try {
    // Lấy tất cả categories
    const categoriesSnapshot = await getDocs(collection(db, "skillCategories"));
    const categories: SkillCategory[] = [];
    
    // Xử lý từng category
    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryData = categoryDoc.data();
      
      // Lấy skills của category này
      const skillsSnapshot = await getDocs(
        collection(db, "skillCategories", categoryDoc.id, "skills")
      );
      
      const skills: Skill[] = skillsSnapshot.docs.map(skillDoc => ({
        id: skillDoc.id,
        ...skillDoc.data()
      } as Skill));
      
      // Thêm vào mảng kết quả
      categories.push({
        id: categoryDoc.id,
        title: categoryData.title,
        order: categoryData.order || 0,
        skills
      });
    }
    
    // Sắp xếp categories theo order
    return categories.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
};

// Lưu categories và skills vào Firebase
export const saveSkillCategories = async (categories: SkillCategory[]): Promise<boolean> => {
  try {
    // Thêm order nếu chưa có
    const updatedCategories = categories.map((category, categoryIndex) => {
      const updatedSkills = category.skills.map((skill, skillIndex) => ({
        ...skill,
        order: skill.order !== undefined ? skill.order : skillIndex
      }));
      
      return {
        ...category,
        order: category.order !== undefined ? category.order : categoryIndex,
        skills: updatedSkills
      };
    });
    
    // Xử lý từng category
    for (const category of updatedCategories) {
      // Lưu document category
      await setDoc(doc(db, "skillCategories", category.id), {
        title: category.title,
        order: category.order
      });
      
      // Lấy skill IDs hiện tại để xử lý xóa
      const existingSkillsSnapshot = await getDocs(
        collection(db, "skillCategories", category.id, "skills")
      );
      
      const existingSkillIds = new Set(
        existingSkillsSnapshot.docs.map(doc => doc.id)
      );
      
      // Xử lý từng skill
      for (const skill of category.skills) {
        await setDoc(
          doc(db, "skillCategories", category.id, "skills", skill.id),
          {
            name: skill.name,
            level: skill.level,
            category: category.id,
            icon: skill.icon || "",
            color: skill.color || "",
            order: skill.order
          }
        );
        
        // Xóa ID này khỏi danh sách cần xóa
        existingSkillIds.delete(skill.id);
      }
      
      // Xóa các skills không còn trong danh sách
      for (const skillIdToDelete of existingSkillIds) {
        await deleteDoc(
          doc(db, "skillCategories", category.id, "skills", skillIdToDelete)
        );
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error saving skill categories:", error);
    return false;
  }
};