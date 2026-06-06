import * as React from 'react';
import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-lg border border-neutral-200/10 dark:border-neutral-800/60',
          'bg-neutral-950/5 dark:bg-neutral-950/40',
          'px-3 py-1.5 text-sm text-neutral-800 dark:text-neutral-200',
          'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
          'hover:bg-neutral-950/10 dark:hover:bg-neutral-950/50',
          'focus:bg-white dark:focus:bg-neutral-950/80',
          'focus:border-neutral-300 dark:focus:border-neutral-700',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all duration-200',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
