import React from 'react';
import { cn } from '../../lib/utils';

export const buttonVariants = ({ variant = 'primary', size = 'md' } = {}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-90 shadow-sm',
    secondary: 'bg-primary-light text-white hover:bg-opacity-90 shadow-sm',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'text-primary hover:bg-primary/5',
    link: 'text-primary underline-offset-4 hover:underline',
    default: 'bg-primary text-white hover:bg-opacity-90 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3.5 text-lg font-semibold',
    icon: 'h-10 w-10',
    default: 'px-6 py-2.5',
  };

  return cn(
    'inline-flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-50',
    variants[variant as keyof typeof variants] || variants.default,
    sizes[size as keyof typeof sizes] || sizes.default
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'default';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'default';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);