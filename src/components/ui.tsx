import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  color?: "default" | "primary" | "danger";
  size?: "sm" | "md" | "lg";
  startIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = "default", 
  color = "default", 
  size = "md", 
  startIcon,
  className = "",
  children,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none";
  
  const variantStyles = {
    default: `${color === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : 
              color === "danger" ? "bg-red-600 text-white hover:bg-red-700" : 
              "bg-slate-900 text-white hover:bg-slate-800"}`,
    outline: `border ${color === "primary" ? "border-blue-600 text-blue-600 hover:bg-blue-50" : 
               color === "danger" ? "border-red-600 text-red-600 hover:bg-red-50" : 
               "border-slate-300 text-slate-700 hover:bg-slate-50"}`,
    ghost: `${color === "primary" ? "text-blue-600 hover:bg-blue-50" : 
            color === "danger" ? "text-red-600 hover:bg-red-50" : 
            "text-slate-700 hover:bg-slate-50"}`,
  };
  
  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} 
      {...props}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
    </button>
  );
};

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "" }) => {
  return (
    <div className={`px-4 py-3 border-b border-slate-200 ${className}`}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = "" }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

interface AlertProps {
  variant: "success" | "error" | "info" | "warning";
  children?: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ variant, children, className = "", onDismiss }) => {
  const variantStyles = {
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  
  return (
    <div className={`p-4 rounded-md border ${variantStyles[variant]} ${className}`} role="alert">
      <div className="flex justify-between">
        <div>{children}</div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-inherit opacity-70 hover:opacity-100">
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${className}`} />
  );
};

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
  variant?: "primary" | "secondary";
}

export function CategoryFilter({ 
  categories, 
  activeCategory, 
  onChange,
  variant = "primary" 
}: CategoryFilterProps) {
  if (!categories || categories.length === 0) return null;
  
  const filterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  return (
    <motion.div
      className="w-full flex justify-center mb-10"
      variants={filterVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-full overflow-x-auto pb-2">
        <div className={`inline-flex rounded-xl p-1.5 ${variant === "primary" ? "bg-slate-100" : "bg-white border border-slate-200"} flex-nowrap`}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onChange(category)}
              className={`
                px-5 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300
                ${activeCategory === category 
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200" 
                  : "text-slate-600 hover:text-blue-500"}
              `}
            >
              {typeof category === 'string' ? category.charAt(0).toUpperCase() + category.slice(1) : category}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}