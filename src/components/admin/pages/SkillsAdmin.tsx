import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlusIcon, TrashIcon, SaveIcon, InfoIcon, SearchIcon, ArrowUpIcon, ArrowDownIcon, Copy } from "lucide-react";
import { getSkills, saveSkillCategories, SkillCategory, Skill } from "../../../services/skillsService";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as AiIcons from "react-icons/ai";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AdminHeader } from "../shared/AdminHeader";
import { AdminContent } from "../shared/AdminContent";

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
function DraggableSkill({ skill, index, categoryId, moveSkill, ...props }: { skill: Skill, index: number, categoryId: string, moveSkill: (fromIndex: number, toIndex: number, fromCategoryId: string, toCategoryId: string) => void, props: any }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'SKILL',
    item: { id: skill.id, index, categoryId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'SKILL',
    hover: (item: { index: number, categoryId: string }, monitor: any) => {
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
          {skill.icon ? <IconPreview iconName={skill.icon} color={skill.color || '#000000'} /> : null}
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSkills();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching skills data:", error);
        setError("Failed to load skills data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCategory = () => {
    const newCategory: SkillCategory = {
      id: uuidv4(),
      title: "New Category",
      skills: [],
      order: categories.length
    };
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      setCategories(categories.filter(category => category.id !== categoryId));
      setSuccess("Category deleted");
    }
  };

  const handleCategoryChange = (categoryId: string, title: string) => {
    setCategories(
      categories.map(category =>
        category.id === categoryId ? { ...category, title } : category
      )
    );
  };

  const handleAddSkill = (categoryId: string) => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: "New Skill",
      level: "Intermediate",
      category: categoryId,
      icon: "",
      color: "#6366f1",
      order: categories.find(c => c.id === categoryId)?.skills.length || 0
    };

    setCategories(
      categories.map(category =>
        category.id === categoryId
          ? { ...category, skills: [...category.skills, newSkill] }
          : category
      )
    );
  };

  const handleDeleteSkill = (categoryId: string, skillId: string) => {
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
  };

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
                skill.id === skillId ? { ...skill, [field]: value } : skill
              )
            }
          : category
      )
    );
  };

  const handleSave = async () => {
    // Validate all skills
    let hasErrors = false;
    const validationErrors: Record<string, Record<string, string>> = {};
    
    categories.forEach(category => {
      category.skills.forEach(skill => {
        const errors = validateSkill(skill);
        if (Object.keys(errors).length > 0) {
          hasErrors = true;
          validationErrors[skill.id] = errors;
        }
      });
    });
    
    if (hasErrors) {
      setError("Please fix validation errors before saving");
      setValidationState(validationErrors);
      return;
    }
    
    setSaving(true);
    try {
      const success = await saveSkillCategories(categories);
      if (success) {
        setSuccess("Skills saved successfully");
      } else {
        setError("Failed to save skills");
      }
    } catch (error) {
      console.error("Error saving skills:", error);
      setError("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleMoveSkill = (categoryId: string, skillId: string, direction: 'up' | 'down') => {
    setCategories(
      categories.map(category => {
        if (category.id !== categoryId) return category;
        
        const skillIndex = category.skills.findIndex(s => s.id === skillId);
        if (skillIndex === -1) return category;
        
        const newSkills = [...category.skills];
        
        if (direction === 'up' && skillIndex > 0) {
          [newSkills[skillIndex], newSkills[skillIndex - 1]] = 
          [newSkills[skillIndex - 1], newSkills[skillIndex]];
        } else if (direction === 'down' && skillIndex < newSkills.length - 1) {
          [newSkills[skillIndex], newSkills[skillIndex + 1]] = 
          [newSkills[skillIndex + 1], newSkills[skillIndex]];
        }
        
        // Cập nhật order
        const updatedSkills = newSkills.map((skill, idx) => ({
          ...skill,
          order: idx
        }));
        
        return { ...category, skills: updatedSkills };
      })
    );
  };

  const handleMoveCategory = (categoryId: string, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;
    
    const newCategories = [...categories];
    
    if (direction === 'up' && categoryIndex > 0) {
      [newCategories[categoryIndex], newCategories[categoryIndex - 1]] = 
      [newCategories[categoryIndex - 1], newCategories[categoryIndex]];
    } else if (direction === 'down' && categoryIndex < newCategories.length - 1) {
      [newCategories[categoryIndex], newCategories[categoryIndex + 1]] = 
      [newCategories[categoryIndex + 1], newCategories[categoryIndex]];
    }
    
    // Cập nhật order
    const updatedCategories = newCategories.map((category, idx) => ({
      ...category,
      order: idx
    }));
    
    setCategories(updatedCategories);
  };

  const handleDuplicateSkill = (categoryId: string, skillId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const skill = category.skills.find(s => s.id === skillId);
    if (!skill) return;
    
    const newSkill: Skill = {
      ...skill,
      id: uuidv4(),
      name: `${skill.name} (Copy)`,
      order: category.skills.length
    };
    
    setCategories(
      categories.map(c =>
        c.id === categoryId
          ? { ...c, skills: [...c.skills, newSkill] }
          : c
      )
    );
    
    setSuccess("Skill duplicated");
  };

  const moveSkill = (fromIndex: number, toIndex: number, fromCategoryId: string, toCategoryId: string) => {
    // Implement logic to reorder skills
    // ...
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(categories));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "skills_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target?.files?.[0] as Blob, "UTF-8");
    fileReader.onload = e => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        // Validate imported data structure
        // ...
        setCategories(importedData);
        setSuccess("Data imported successfully");
      } catch (error) {
        setError("Failed to import data: Invalid format");
      }
    };
  };

  // Render header actions
  const headerActions = (
    <>
      <button
        onClick={handleAddCategory}
        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
      >
        <PlusIcon size={16} />
        Add Category
      </button>
      <button
        onClick={handleSave}
        disabled={saving}
        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${
          saving ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <SaveIcon size={16} />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <AdminHeader 
        title="Manage Skills" 
        error={error} 
        success={success} 
        actions={headerActions} 
      />
      
      <AdminContent isLoading={loading}>
        <div className="space-y-8">
          {categories.map((category, categoryIndex) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleMoveCategory(category.id, 'up')}
                      disabled={categoryIndex === 0}
                      className={`p-1 rounded ${
                        categoryIndex === 0 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <ArrowUpIcon size={14} />
                    </button>
                    <button
                      onClick={() => handleMoveCategory(category.id, 'down')}
                      disabled={categoryIndex === categories.length - 1}
                      className={`p-1 rounded ${
                        categoryIndex === categories.length - 1 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <ArrowDownIcon size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={category.title}
                    onChange={e => handleCategoryChange(category.id, e.target.value)}
                    className="text-lg font-medium bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddSkill(category.id)}
                    className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    title="Add Skill"
                  >
                    <PlusIcon size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    title="Delete Category"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {category.skills.length === 0 ? (
                  <div className="text-center py-6 text-slate-500">
                    No skills in this category. Click "Add Skill" to create one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <DraggableSkill
                        key={skill.id}
                        skill={skill}
                        index={skillIndex}
                        categoryId={category.id}
                        moveSkill={moveSkill}
                        props={{}}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <div className="col-span-1 flex flex-col items-center">
                            <button
                              onClick={() => handleMoveSkill(category.id, skill.id, 'up')}
                              disabled={skillIndex === 0}
                              className={`p-1 rounded ${
                                skillIndex === 0 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-200'
                              }`}
                              title="Move Up"
                            >
                              <ArrowUpIcon size={14} />
                            </button>
                            <button
                              onClick={() => handleMoveSkill(category.id, skill.id, 'down')}
                              disabled={skillIndex === category.skills.length - 1}
                              className={`p-1 rounded ${
                                skillIndex === category.skills.length - 1 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-200'
                              }`}
                              title="Move Down"
                            >
                              <ArrowDownIcon size={14} />
                            </button>
                          </div>

                          <div className="col-span-11 md:col-span-3">
                            <label className="block text-xs text-slate-500 mb-1">
                              Skill Name
                            </label>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={e =>
                                handleSkillChange(
                                  category.id,
                                  skill.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div className="col-span-11 md:col-span-2">
                            <label className="block text-xs text-slate-500 mb-1">
                              Level
                            </label>
                            <select
                              value={skill.level}
                              onChange={e =>
                                handleSkillChange(
                                  category.id,
                                  skill.id,
                                  "level",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>

                          <div className="col-span-11 md:col-span-2">
                            <label className="block text-xs text-slate-500 mb-1">
                              Icon
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={skill.icon || ""}
                                onChange={e =>
                                  handleSkillChange(
                                    category.id,
                                    skill.id,
                                    "icon",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g. FaReact"
                              />
                              <button
                                onClick={() => setIconSelector({ 
                                  show: true, 
                                  categoryId: category.id, 
                                  skillId: skill.id 
                                })}
                                className="absolute right-2 top-2 text-slate-400 hover:text-blue-500"
                                title="Browse Icons"
                              >
                                <SearchIcon size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="col-span-11 md:col-span-2"></div>
                        </div>
                      </DraggableSkill>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </AdminContent>
    </DndProvider>
  );
}

