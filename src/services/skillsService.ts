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
    // Thêm order nếu chưa có và đảm bảo tất cả ID đều hợp lệ
    const updatedCategories = categories.map((category, categoryIndex) => {
      // Kiểm tra ID category
      if (!category.id || typeof category.id !== 'string' || category.id.includes('/')) {
        console.error("Invalid category ID found, skipping:", category);
        return null; // Category không hợp lệ, bỏ qua
      }
      
      const updatedSkills = category.skills
        .filter(skill => {
          // Kiểm tra ID skill
          if (!skill.id || typeof skill.id !== 'string' || skill.id.includes('/')) {
            console.error("Invalid skill ID found, skipping:", skill);
            return false; // Skill không hợp lệ, bỏ qua
          }
          return true;
        })
        .map((skill, skillIndex) => ({
          ...skill,
          order: skill.order !== undefined ? skill.order : skillIndex
        }));
      
      return {
        ...category,
        order: category.order !== undefined ? category.order : categoryIndex,
        skills: updatedSkills
      };
    }).filter(Boolean) as SkillCategory[]; // Lọc bỏ các category null
    
    // Xử lý từng category
    for (const category of updatedCategories) {
      try {
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
          try {
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
          } catch (skillError) {
            console.error(`Error saving skill ${skill.id}:`, skillError);
            // Tiếp tục xử lý các skill khác
          }
        }
        
        // Xóa các skills không còn trong danh sách
        for (const skillIdToDelete of existingSkillIds) {
          try {
            await deleteDoc(
              doc(db, "skillCategories", category.id, "skills", skillIdToDelete)
            );
          } catch (deleteError) {
            console.error(`Error deleting skill ${skillIdToDelete}:`, deleteError);
            // Tiếp tục xử lý các skill khác
          }
        }
      } catch (categoryError) {
        console.error(`Error processing category ${category.id}:`, categoryError);
        // Tiếp tục xử lý các category khác
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error saving skill categories:", error);
    return false;
  }
};

// Xóa category và skills
export const deleteSkillCategory = async (categoryId: string): Promise<boolean> => {
  try {
    // Xóa category
    await deleteDoc(doc(db, "skillCategories", categoryId));  
    return true;
  } catch (error) {
    console.error("Error deleting skill category:", error);
    return false;
  }
}

// Xóa một skill cụ thể
export const deleteSkill = async (categoryId: string, skillId: string): Promise<boolean> => {
  try {
    // Xóa skill từ subcollection skills của category
    await deleteDoc(
      doc(db, "skillCategories", categoryId, "skills", skillId)
    );
    return true;
  } catch (error) {
    console.error("Error deleting skill:", error);
    return false;
  }
};

// Tạo category mới
export const createSkillCategory = async (category: Omit<SkillCategory, 'skills'>): Promise<string | null> => {
  try {
    const categoryRef = doc(collection(db, "skillCategories"));
    const id = categoryRef.id;
    
    await setDoc(categoryRef, {
      title: category.title,
      order: category.order || 0
    });
    
    return id;
  } catch (error) {
    console.error("Error creating skill category:", error);
    return null;
  }
};

// Tạo skill mới
export const createSkill = async (skill: Omit<Skill, 'id'>): Promise<string | null> => {
  try {
    const skillRef = doc(collection(db, "skillCategories", skill.category, "skills"));
    const id = skillRef.id;
    
    await setDoc(skillRef, {
      name: skill.name,
      level: skill.level,
      category: skill.category,
      icon: skill.icon || "",
      color: skill.color || "",
      order: skill.order || 0
    });
    
    return id;
  } catch (error) {
    console.error("Error creating skill:", error);
    return null;
  }
};