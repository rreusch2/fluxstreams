import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  pulse?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  pulse = false,
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500';
  
  const variantClasses = {
    primary: 'relative overflow-hidden bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md hover:shadow-lg after:absolute after:inset-0 after:bg-white/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity',
    secondary: 'bg-slate-800 text-white hover:bg-slate-700 transition-all',
    outline: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/30 transition-all'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 4px 14px 0 rgba(20, 184, 166, 0.2)', 
        '0 6px 20px 0 rgba(20, 184, 166, 0.4)', 
        '0 4px 14px 0 rgba(20, 184, 166, 0.2)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: {
      scale: 0.98,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 20
      }
    }
  };
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variants={buttonVariants}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      animate={pulse && !disabled ? "pulse" : ""}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      {...(pulse && !disabled ? { variants: pulseVariants } : {})}
    >
      {children}
    </motion.button>
  );
};

export default Button;