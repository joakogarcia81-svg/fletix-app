import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4', className)}
    >
      <div>
        <h2 className="text-lg font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
