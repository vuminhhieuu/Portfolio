import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlusIcon, TrashIcon, SaveIcon, InfoIcon, SearchIcon, ArrowUpIcon, ArrowDownIcon, Copy } from "lucide-react";
import { createSkill, getSkills, deleteSkill, saveSkillCategories,  deleteSkillCategory, SkillCategory, Skill } from "../../../services/skillsService";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as AiIcons from "react-icons/ai";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ChevronDownIcon, EyeIcon, PaletteIcon } from "lucide-react";
import { Button, Card, CardHeader, CardBody, Alert, Spinner } from "../../../components/ui";

// Component cho bảng màu phổ biến
const COLOR_PRESETS = [
  "#3b82f6", // blue-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#a855f7", // purple-500
  "#ec4899", // pink-500
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#f59e0b", // amber-500
  "#16a34a", // green-500
  "#14b8a6", // teal-500
  "#06b6d4", // cyan-500
  "#0ea5e9", // sky-500
  "#0d9488", // teal-600
  "#0891b2", // cyan-600
  "#4f46e5", // indigo-600
  "#7c3aed", // violet-600
  "#2563eb", // blue-600
  "#9333ea"  // purple-600
];

function ColorPresets({ onSelect }: { onSelect: (color: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {COLOR_PRESETS.map(color => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          className="w-6 h-6 rounded-full border border-slate-300 transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}

// Thêm component IconPreview để hiển thị preview icon
function IconPreview({ iconName, color }: { iconName: string, color: string }) {
  let Icon;
  
  if (iconName.startsWith("Fa") && FaIcons[iconName as keyof typeof FaIcons]) {
    Icon = FaIcons[iconName as keyof typeof FaIcons];
  } else if (iconName.startsWith("Si") && SiIcons[iconName as keyof typeof SiIcons]) {
    Icon = SiIcons[iconName as keyof typeof SiIcons];
  } else if (iconName.startsWith("Ai") && AiIcons[iconName as keyof typeof AiIcons]) {
    Icon = AiIcons[iconName as keyof typeof AiIcons];
  } else {
    return null;
  }
  
  return <Icon style={{ color }} className="w-6 h-6" />;
}

// Component hiển thị gợi ý icon
function IconSelector({ onSelect, onClose }: { onSelect: (icon: string) => void, onClose: () => void }) {
  const iconSets = [
    { 
      prefix: "Fa", 
      name: "Font Awesome",
      icons: [
        "FaReact", "FaNode", "FaNodeJs", "FaJava", "FaPython", "FaHtml5", "FaCss3Alt", 
        "FaPhp", "FaLaravel", "FaJs", "FaGit", "FaGithub", "FaDocker", "FaDatabase", 
        "FaCode", "FaAngular", "FaVuejs", "FaAws", "FaLinux", "FaWindows", "FaApple"
      ]
    },
    { 
      prefix: "Si", 
      name: "Simple Icons",
      icons: [
        "SiTypescript", "SiJavascript", "SiNextdotjs", "SiTailwindcss", "SiExpress", 
        "SiMongodb", "SiPostgresql", "SiGraphql", "SiFirebase", "SiSwagger", "SiRedux", 
        "SiFlutter", "SiDart", "SiCsharp", "SiDotnet", "SiUnity", "SiRust", "SiGo", 
        "SiKubernetes", "SiJenkins", "SiJira", "SiBootstrap", "SiSass", "SiJquery", 
        "SiMysql", "SiTensorflow", "SiPython", "SiDjango"
      ]
    },
    { 
      prefix: "Ai", 
      name: "Ant Design Icons",
      icons: [
        "AiFillCode", "AiFillApi", "AiFillAndroid", "AiFillApple", "AiFillBug", 
        "AiFillCloud", "AiFillDatabase", "AiFillHtml5", "AiFillGithub", "AiFillWindows"
      ]
    }
  ];

  const [selectedSet, setSelectedSet] = useState(iconSets[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIcons = searchTerm
    ? selectedSet.icons.filter(icon => 
        icon.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedSet.icons;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-lg p-4 max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Select an Icon</h3>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
        >
          &times;
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center border border-slate-300 rounded-lg px-2 mb-3">
          <SearchIcon size={16} className="text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 focus:outline-none"
            placeholder="Search icons..."
          />
        </div>
        
        <div className="flex gap-2 mb-3">
          {iconSets.map(set => (
            <button
              key={set.prefix}
              onClick={() => setSelectedSet(set)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedSet.prefix === set.prefix
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {set.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
        {filteredIcons.map(icon => (
          <button
            key={icon}
            onClick={() => onSelect(icon)}
            className="flex flex-col items-center p-2 border border-slate-200 rounded hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            {/* Thêm preview icon */}
            <div className="mb-2">
              <IconPreview iconName={icon} color="#3b82f6" />
            </div>
            <span className="text-xs text-slate-500 truncate w-full text-center">
              {icon}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-slate-500 flex items-start gap-1.5">
        <InfoIcon size={14} className="mt-0.5 flex-shrink-0" />
        <p>
          These are common icons. View all at{" "}
          <a 
            href="https://react-icons.github.io/react-icons/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            react-icons.github.io
          </a>
        </p>
      </div>
    </div>
  );
}

// Component Skill có thể kéo thả
function DraggableSkill({ skill, index, categoryId, moveSkill, canDrop, ...props }: { 
  skill: Skill, 
  index: number, 
  categoryId: string, 
  moveSkill: (fromIndex: number, toIndex: number, fromCategoryId: string, toCategoryId: string) => void, 
  canDrop: () => boolean,
  props?: any 
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'SKILL',
    item: { id: skill.id, index, categoryId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'SKILL',
    canDrop: () => canDrop(), // Sử dụng hàm canDrop để xác định có thể thả không
    hover: (item: { index: number, categoryId: string }, monitor: any) => {
      if (!canDrop()) return; // Nếu không thả được thì không làm gì
      
      if (item.index === index && item.categoryId === categoryId) {
        return;
      }
      moveSkill(item.index, index, item.categoryId, categoryId);
      item.index = index;
      item.categoryId = categoryId;
    },
  });

  return (
    <div 
      ref={(node) => drag(drop(node))} 
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="skill-item"
      {...props}
    />
  );
}

const validateSkill = (skill: Skill) => {
  const errors: Record<string, string> = {};
  
  if (!skill.name.trim()) {
    errors.name = "Skill name is required";
  }
  
  if (skill.name.length > 50) {
    errors.name = "Skill name must be less than 50 characters";
  }
  
  if (!skill.level) {
    errors.level = "Skill level is required";
  }
  
  return errors;
};

// Thêm chức năng Preview trong SkillsAdmin
function SkillPreview({ skill }: { skill: Skill }) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert": return "bg-green-100 text-green-700";
      case "Advanced": return "bg-blue-100 text-blue-700";
      case "Intermediate": return "bg-yellow-100 text-yellow-700";
      case "Beginner": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getProgressWidth = (level: string) => {
    switch (level) {
      case "Expert": return "w-full";
      case "Advanced": return "w-4/5";
      case "Intermediate": return "w-3/5";
      case "Beginner": return "w-2/5";
      default: return "w-2/5";
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconPreview iconName={skill.icon || ""} color={skill.color || "#6366f1"} />
          <span className="font-medium">{skill.name}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
          {skill.level}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div 
          className={`${getProgressWidth(skill.level)} h-full rounded-full`}
          style={{ backgroundColor: skill.color || '#6366f1' }}
        ></div>
      </div>
    </div>
  );
}

export function SkillsAdmin() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [iconSelector, setIconSelector] = useState({ show: false, categoryId: "", skillId: "" });
  const [colorSelector, setColorSelector] = useState({ show: false, categoryId: "", skillId: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationState, setValidationState] = useState<Record<string, Record<string, string>> | null>(null);
  const [previewSkillId, setPreviewSkillId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesData = await getSkills();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching skills data:", error);
        setError("Failed to load skills data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Thêm mới danh mục kỹ năng
  const handleAddCategory = () => {
    const newCategory: SkillCategory = {
      id: uuidv4(),
      title: "New Category",
      skills: [],
      order: categories.length
    };
    setCategories([...categories, newCategory]);
  };

  // Xóa danh mục
  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        const success = await deleteSkillCategory(categoryId);
        if (success) {
          setCategories(categories.filter(category => category.id !== categoryId));
          setSuccess("Category deleted successfully!");
        } else {
          setError("Failed to delete category.");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        setError("An error occurred while deleting the category.");
      }
    }
  };

  // Cập nhật tiêu đề danh mục
  const handleCategoryChange = (categoryId: string, title: string) => {
    setCategories(
      categories.map(category =>
        category.id === categoryId ? { ...category, title } : category
      )
    );
  };

  // Thêm kỹ năng mới
  const handleAddSkill = async (categoryId: string) => {
    const newSkill: Omit<Skill, 'id'> = {
      name: "New Skill",
      level: "Beginner",
      category: categoryId,
      icon: "FaCode", // Default icon
      color: "#6366f1", // Default color
      order: categories.find(c => c.id === categoryId)?.skills.length || 0
    };
    
    try {
      // Sử dụng service để tạo skill mới
      const newId = await createSkill(newSkill);
      
      if (newId) {
        setCategories(
          categories.map(category =>
            category.id === categoryId 
              ? { 
                  ...category, 
                  skills: [...category.skills, {
                    ...newSkill,
                    id: newId
                  }] 
                }
              : category
          )
        );
        setSuccess("Skill added successfully!");
      } else {
        setError("Failed to add skill.");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      setError("An error occurred while adding the skill.");
    }
  };

  // Xóa kỹ năng
  const handleDeleteSkill = async (categoryId: string, skillId: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        // Sử dụng service để xóa skill
        const success = await deleteSkill(categoryId, skillId);
        
        if (success) {
          setCategories(
            categories.map(category =>
              category.id === categoryId
                ? { 
                    ...category, 
                    skills: category.skills.filter(skill => skill.id !== skillId) 
                  }
                : category
            )
          );
          setSuccess("Skill deleted successfully!");
        } else {
          setError("Failed to delete skill.");
        }
      } catch (error) {
        console.error("Error deleting skill:", error);
        setError("An error occurred while deleting the skill.");
      }
    }
  };

  // Cập nhật thuộc tính kỹ năng
  const handleSkillChange = (
    categoryId: string,
    skillId: string,
    field: keyof Skill,
    value: string
  ) => {
    setCategories(
      categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              skills: category.skills.map(skill =>
                skill.id === skillId
                  ? { ...skill, [field]: value }
                  : skill
              )
            }
          : category
      )
    );
  };

  // Thêm các hàm này vào component SkillsAdmin

// Duplicate skill
const handleDuplicateSkill = (categoryId: string, skillId: string) => {
  setCategories(prevCategories => {
    const newCategories = [...prevCategories];
    const categoryIndex = newCategories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex === -1) return prevCategories;
    
    const skillToDuplicate = newCategories[categoryIndex].skills.find(s => s.id === skillId);
    
    if (!skillToDuplicate) return prevCategories;
    
    const duplicatedSkill: Skill = {
      ...skillToDuplicate,
      id: uuidv4(),
      name: `${skillToDuplicate.name} (Copy)`,
      order: newCategories[categoryIndex].skills.length
    };
    
    newCategories[categoryIndex].skills.push(duplicatedSkill);
    
    return newCategories;
  });
};

// Export skills data
const handleExport = () => {
  try {
    const dataToExport = {
      categories: categories.map(category => ({
        ...category,
        skills: category.skills.map(skill => ({
          id: skill.id,
          name: skill.name,
          level: skill.level,
          category: skill.category,
          icon: skill.icon,
          color: skill.color,
          order: skill.order
        }))
      }))
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-skills-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setSuccess("Data exported successfully!");
  } catch (error) {
    console.error("Error exporting data:", error);
    setError("Failed to export data.");
  }
};

  // Import skills data
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (!result) {
            setError("Could not read file");
            return;
          }
          
          const importedData = JSON.parse(result as string);
          
          if (importedData?.categories && Array.isArray(importedData.categories)) {
            // Chuẩn hóa và đảm bảo tất cả ID đều hợp lệ
            const validatedCategories = importedData.categories.map((category: any, categoryIndex: number) => {
              // Đảm bảo category.id hợp lệ (không undefined và không chứa ký tự đặc biệt)
              const categoryId = category.id && typeof category.id === 'string' && !category.id.includes('/') ? 
                category.id : uuidv4();
              
              // Đảm bảo có title
              const title = category.title || `Category ${categoryIndex + 1}`;
              
              // Đảm bảo có mảng skills
              let categorySkills = Array.isArray(category.skills) ? category.skills : [];
              
              // Xử lý từng skill
              const validatedSkills = categorySkills.map((skill: any, skillIndex: number) => {
                // Đảm bảo skill.id hợp lệ
                const skillId = skill.id && typeof skill.id === 'string' && !skill.id.includes('/') ? 
                  skill.id : uuidv4();
                  
                return {
                  id: skillId,
                  name: skill.name || "Unnamed Skill",
                  level: skill.level || "Beginner",
                  category: categoryId, // Gán categoryId mới nếu đã được tạo lại
                  icon: skill.icon || "FaCode",
                  color: skill.color || "#6366f1",
                  order: typeof skill.order === 'number' ? skill.order : skillIndex
                };
              });
              
              return {
                id: categoryId,
                title,
                skills: validatedSkills,
                order: typeof category.order === 'number' ? category.order : categoryIndex
              };
            });
            
            setCategories(validatedCategories);
            setSuccess("Skills data imported successfully!");
          } else {
            setError("Invalid data format. Expected a 'categories' array.");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setError("Failed to parse imported data. Make sure it's a valid JSON file.");
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing data:", error);
      setError("Failed to import data.");
    } finally {
      if (event.target) event.target.value = '';
    }
  };

  // Hiển thị icon selector
  const openIconSelector = (categoryId: string, skillId: string) => {
    setIconSelector({ show: true, categoryId, skillId });
  };

  // Đóng icon selector
  const closeIconSelector = () => {
    setIconSelector({ show: false, categoryId: "", skillId: "" });
  };

  // Chọn icon
  const handleSelectIcon = (iconName: string) => {
    handleSkillChange(iconSelector.categoryId, iconSelector.skillId, "icon", iconName);
    closeIconSelector();
  };

  // Hiển thị color selector
  const openColorSelector = (categoryId: string, skillId: string) => {
    setColorSelector({ show: true, categoryId, skillId });
  };

  // Đóng color selector
  const closeColorSelector = () => {
    setColorSelector({ show: false, categoryId: "", skillId: "" });
  };

  // Chọn màu
  const handleSelectColor = (color: string) => {
    handleSkillChange(colorSelector.categoryId, colorSelector.skillId, "color", color);
    closeColorSelector();
  };

  // Di chuyển danh mục lên/xuống
  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === categories.length - 1)) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newCategories = [...categories];
    [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];
    
    // Cập nhật thứ tự
    newCategories.forEach((category, idx) => {
      category.order = idx;
    });
    
    setCategories(newCategories);
  };

  // Di chuyển kỹ năng lên/xuống trong cùng danh mục
  const handleMoveSkill = (categoryId: string, skillIndex: number, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;
    
    const skills = [...categories[categoryIndex].skills];
    
    if ((direction === 'up' && skillIndex === 0) || 
        (direction === 'down' && skillIndex === skills.length - 1)) {
      return;
    }
    
    const newSkillIndex = direction === 'up' ? skillIndex - 1 : skillIndex + 1;
    [skills[skillIndex], skills[newSkillIndex]] = [skills[newSkillIndex], skills[skillIndex]];
    
    // Cập nhật thứ tự
    skills.forEach((skill, idx) => {
      skill.order = idx;
    });
    
    const newCategories = [...categories];
    newCategories[categoryIndex].skills = skills;
    setCategories(newCategories);
  };

  // Lưu thay đổi vào Firebase
  // Cập nhật hàm handleSave
const handleSave = async () => {
  // Validate data
  const errors: Record<string, Record<string, string>> = {};
  let hasError = false;
  
  categories.forEach(category => {
    category.skills.forEach(skill => {
      const skillErrors = validateSkill(skill);
      if (Object.keys(skillErrors).length > 0) {
        errors[skill.id] = skillErrors;
        hasError = true;
      }
    });
  });
  
  if (hasError) {
    setValidationState(errors);
    setError("Please fix validation errors before saving.");
    return;
  }
  
  try {
    setSaving(true);
    
    // Sử dụng service để lưu dữ liệu
    const success = await saveSkillCategories(categories);
    
    if (success) {
      setSuccess("Changes saved successfully!");
      setValidationState(null);
      setError(null);
    } else {
      throw new Error("Failed to save changes");
    }
  } catch (error) {
    console.error("Error saving data:", error);
    setError("Failed to save changes. Please try again.");
  } finally {
    setSaving(false);
  }
};

  // Kéo thả kỹ năng
  const moveSkill = (fromIndex: number, toIndex: number, fromCategoryId: string, toCategoryId: string) => {
    setCategories(prevCategories => {
      // Tạo bản sao để không thay đổi state trực tiếp
      const newCategories = JSON.parse(JSON.stringify(prevCategories));
      
      // Tìm các danh mục nguồn và đích
      const fromCategoryIndex = newCategories.findIndex((c: SkillCategory) => c.id === fromCategoryId);
      const toCategoryIndex = newCategories.findIndex((c: SkillCategory) => c.id === toCategoryId);
      
      if (fromCategoryIndex === -1 || toCategoryIndex === -1) return prevCategories;
      
      // Lấy kỹ năng cần di chuyển
      const [movedSkill] = newCategories[fromCategoryIndex].skills.splice(fromIndex, 1);
      
      // Cập nhật categoryId của kỹ năng nếu di chuyển sang danh mục khác
      if (fromCategoryId !== toCategoryId) {
        movedSkill.category = toCategoryId;
      }
      
      // Chèn kỹ năng vào vị trí mới
      newCategories[toCategoryIndex].skills.splice(toIndex, 0, movedSkill);
      
      // Cập nhật thứ tự của các kỹ năng trong danh mục nguồn
      newCategories[fromCategoryIndex].skills.forEach((skill: Skill, index: number) => {
        skill.order = index;
      });
      
      // Cập nhật thứ tự của các kỹ năng trong danh mục đích (nếu khác với nguồn)
      if (fromCategoryId !== toCategoryId) {
        newCategories[toCategoryIndex].skills.forEach((skill: Skill, index: number) => {
          skill.order = index;
        });
      }
      
      return newCategories;
    });
  };

  // Toggle skill preview
  const togglePreview = (skillId: string | null) => {
    setPreviewSkillId(skillId === previewSkillId ? null : skillId);
  };

  // Hiển thị lỗi validation cho một trường
  const getFieldError = (skillId: string, field: string) => {
    if (!validationState || !validationState[skillId]) return null;
    return validationState[skillId][field];
  };

  // Kiểm tra khả năng thả kỹ năng vào danh mục
  const canDropSkill = () => true;

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <Spinner size="lg" />
        <span className="ml-3">Loading skills data...</span>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Skills Management</h1>
        <div className="flex gap-2">
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <div className="px-4 py-2 bg-white border border-slate-300 rounded-md hover:bg-slate-50 flex items-center">
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </div>
            </label>
            
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Export
            </button>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={saving}
            color="primary"
            startIcon={saving ? <Spinner size="sm" className="mr-2" /> : <SaveIcon size={18} className="mr-2" />}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

        {error && (
          <Alert variant="error" className="mb-4" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4" onDismiss={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <div className="space-y-6">
          {categories.map((category, categoryIndex) => (
            <Card key={category.id} className="border border-slate-200">
              <CardHeader className="bg-slate-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={category.title}
                      onChange={(e) => handleCategoryChange(category.id, e.target.value)}
                      className="font-semibold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveCategory(categoryIndex, 'up')}
                      disabled={categoryIndex === 0}
                      title="Move Up"
                    >
                      <ArrowUpIcon size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveCategory(categoryIndex, 'down')}
                      disabled={categoryIndex === categories.length - 1}
                      title="Move Down"
                    >
                      <ArrowDownIcon size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      title="Delete Category"
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardBody>
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.id} className="border border-slate-200 rounded-md p-3 bg-white">
                      <DraggableSkill 
                        skill={skill} 
                        index={skillIndex} 
                        categoryId={category.id}
                        moveSkill={moveSkill}
                        canDropSkill={canDropSkill}
                      >
                        <div className="grid grid-cols-12 gap-4">
                          {/* Skill name */}
                          <div className="col-span-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => handleSkillChange(category.id, skill.id, 'name', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md ${
                                getFieldError(skill.id, 'name') 
                                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                              }`}
                            />
                            {getFieldError(skill.id, 'name') && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError(skill.id, 'name')}
                              </p>
                            )}
                          </div>

                          {/* Skill level */}
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Level
                            </label>
                            <select
                              value={skill.level}
                              onChange={(e) => handleSkillChange(category.id, skill.id, 'level', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md ${
                                getFieldError(skill.id, 'level') 
                                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                              }`}
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                            {getFieldError(skill.id, 'level') && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError(skill.id, 'level')}
                              </p>
                            )}
                          </div>

                          {/* Icon selector */}
                          <div className="col-span-3">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Icon
                            </label>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="flex-1 flex items-center justify-between"
                                onClick={() => openIconSelector(category.id, skill.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <IconPreview iconName={skill.icon || ""} color={skill.color || "#6366f1"} />
                                  <span className="truncate">
                                    {skill.icon || "Select Icon"}
                                  </span>
                                </div>
                                <ChevronDownIcon size={14} />
                              </Button>
                            </div>
                          </div>

                          {/* Color picker */}
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Color
                            </label>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-8 h-8 rounded border border-slate-300"
                                style={{ backgroundColor: skill.color || "#6366f1" }}
                              />
                              <input
                                type="text"
                                value={skill.color || ""}
                                onChange={(e) => handleSkillChange(category.id, skill.id, 'color', e.target.value)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="#6366f1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openColorSelector(category.id, skill.id)}
                              >
                                <PaletteIcon size={16} />
                              </Button>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1">
                            <label className="invisible block text-sm mb-1">Actions</label>
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePreview(skill.id)}
                                title="Preview"
                                className="px-1"
                              >
                                <EyeIcon size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDuplicateSkill(category.id, skill.id)}
                                title="Duplicate Skill" 
                                className="px-1"
                              >
                                <Copy size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                color="danger"
                                size="sm"
                                onClick={() => handleDeleteSkill(category.id, skill.id)}
                                title="Delete Skill"
                                className="px-1"
                              >
                                <TrashIcon size={14} />
                              </Button>
                            </div>
                          </div>
                          
                        </div>

                        {/* Preview section */}
                        {previewSkillId === skill.id && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Preview</h4>
                            <SkillPreview skill={skill} />
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateSkill(category.id, skill.id)}
                          title="Duplicate Skill"
                          className="px-1"
                        >
                          <Copy size={14} />
                        </Button>
                      </DraggableSkill>
                      
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => handleAddSkill(category.id)}
                    startIcon={<PlusIcon size={16} className="mr-1" />}
                    className="w-full py-2"
                  >
                    Add Skill
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={handleAddCategory}
            startIcon={<PlusIcon size={16} className="mr-1" />}
            className="w-full py-2"
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Icon Selector Modal */}
      {iconSelector.show && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <IconSelector
            onSelect={handleSelectIcon}
            onClose={closeIconSelector}
          />
        </div>
      )}

      {/* Color Selector Popup */}
      {colorSelector.show && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50" onClick={closeColorSelector}>
          <div className="bg-white rounded-lg border border-slate-200 shadow-lg p-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-2">Select Color</h3>
            <ColorPresets onSelect={handleSelectColor} />
            <input
              type="color"
              value={
                categories
                  .find(c => c.id === colorSelector.categoryId)
                  ?.skills.find(s => s.id === colorSelector.skillId)
                  ?.color || "#6366f1"
              }
              onChange={(e) => handleSelectColor(e.target.value)}
              className="w-full h-8 mt-3"
            />
          </div>
        </div>
      )}
    </DndProvider>
  );
}

