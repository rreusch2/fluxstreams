import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500';
  
  const variantClasses = {
    primary: 'relative overflow-hidden bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02] after:absolute after:inset-0 after:bg-white/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity',
    secondary: 'bg-slate-800 text-white hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-lg transition-all',
    outline: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/30 transition-all'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};

export default Button;