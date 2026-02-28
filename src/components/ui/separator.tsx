import React from 'react';
import { cn } from '../../lib/utils';

export const Separator: React.FC<{ className?: string; orientation?: 'horizontal' | 'vertical' }> = ({ 
  className, 
  orientation = 'horizontal' 
}) => (
  <div className={cn(
    "bg-slate-200",
    orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
    className
  )} />
);