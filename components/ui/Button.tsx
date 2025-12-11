import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading, 
  size = 'md',
  className = '', 
  disabled,
  glow,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const variants = {
    primary: "bg-primary text-white hover:opacity-90 shadow-soft shadow-primary/30",
    secondary: "bg-bg-input text-text-main hover:bg-border",
    outline: "border border-border text-text-main hover:bg-bg-input",
    ghost: "bg-transparent text-text-muted hover:text-text-main hover:bg-bg-input",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-soft shadow-red-500/30"
  };

  const glowStyles = glow ? "shadow-[0_0_20px_rgba(124,58,237,0.5)] ring-1 ring-white/20" : "";

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${glowStyles} ${className}`} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      <span className="flex items-center gap-2">{children}</span>
    </button>
  );
};