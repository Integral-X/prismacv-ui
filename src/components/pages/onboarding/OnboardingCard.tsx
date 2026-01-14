'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface OnboardingCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const OnboardingCard = ({
  title,
  description,
  icon,
  onClick,
  className,
}: OnboardingCardProps) => {
  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all duration-300',
        'hover:-translate-y-2 hover:shadow-lg',
        'border-2 hover:border-primary/30',
        'bg-white',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <div className="[&>svg]:stroke-primary [&>svg]:stroke-[1.5] [&>svg]:fill-none">
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
