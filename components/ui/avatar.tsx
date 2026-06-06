import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center shrink-0 rounded-full font-bold select-none',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
      },
      color: {
        blue: 'bg-blue-600 text-white',
        red: 'bg-red-600 text-white',
        neutral: 'bg-neutral-600 text-white dark:bg-neutral-400 dark:text-neutral-900',
        gradient: 'bg-gradient-to-br from-blue-600 to-red-500 text-white',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'blue',
    },
  },
);

interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>, VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback: string;
}

export function Avatar({ className, size, color, src, alt, fallback, ...props }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className={cn(avatarVariants({ size, color }), className)} {...props}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || fallback}
          onError={() => setImgError(true)}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}
