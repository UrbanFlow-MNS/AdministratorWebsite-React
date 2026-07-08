type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClass: Record<BadgeVariant, string> = {
  default: 'badge-default',
  success: 'badge-success',
  warning: 'badge-warning',
  error:   'badge-error',
  info:    'badge-info',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={['badge', variantClass[variant], className].join(' ')}>
      {children}
    </span>
  );
}
