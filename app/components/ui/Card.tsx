import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function Card({ children, className, title, description }: CardProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow-md p-6', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
