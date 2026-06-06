import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors whitespace-nowrap',
  {
    variants: {
      variant: {
        default:
          'border-neutral-200/10 bg-neutral-100/50 text-neutral-600 dark:bg-neutral-800/40 dark:text-neutral-300',
        blue: 'border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400',
        red: 'border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400',
        green: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400',
        yellow: 'border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400',
        outline:
          'border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-600 dark:text-neutral-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
