import React from "react";
import { Loader2Icon } from "lucide-react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  icon?: React.ReactNode;
}
export function Button({
  children,
  variant = "primary",
  loading = false,
  icon,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300"
  };
  return <button className={`${baseStyles} ${variants[variant]}`} disabled={disabled || loading} {...props}>
      {loading && <Loader2Icon className="animate-spin" size={16} />}
      {!loading && icon}
      {children}
    </button>;
}