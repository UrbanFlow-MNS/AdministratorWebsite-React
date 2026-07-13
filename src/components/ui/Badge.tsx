type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClass: Record<BadgeVariant, string> = {
  default: 'bg-[#EBEBF0] text-muted',
  success: 'bg-success/[0.12] text-[#1a7a35]',
  warning: 'bg-warning/[0.12] text-[#8a5500]',
  error:   'bg-error/[0.12] text-[#c0291f]',
  info:    'bg-info/[0.12] text-[#0055b3]',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClass[variant], className].join(' ')}>
      {children}
    </span>
  );
}
