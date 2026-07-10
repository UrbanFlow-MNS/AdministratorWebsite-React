import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const baseClass =
  'inline-flex items-center justify-center gap-1.5 font-medium rounded-[10px] cursor-pointer whitespace-nowrap no-underline border-none outline-none transition-[background-color,box-shadow,opacity] duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

const variantClass: Record<Variant, string> = {
  primary:   'bg-primary text-white enabled:hover:bg-primary-hover',
  secondary: 'bg-[#EBEBF0] text-ink enabled:hover:bg-[#E0E0E8]',
  ghost:     'bg-transparent text-muted enabled:hover:bg-canvas enabled:hover:text-ink',
  danger:    'bg-error text-white enabled:hover:bg-[#e0352a]',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3 text-[0.8125rem]',
  md: 'h-[38px] px-4 text-sm',
  lg: 'h-11 px-5 text-[0.9375rem]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[baseClass, variantClass[variant], sizeClass[size], className].join(' ')}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
