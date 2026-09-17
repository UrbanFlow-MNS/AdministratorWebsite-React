import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-[5px]">
        {label && <label htmlFor={inputId} className="text-[0.8125rem] font-medium text-ink">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={[
            'h-[38px] w-full px-3 bg-surface border-[1.5px] rounded-[10px] text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-faint',
            error
              ? 'border-error focus:shadow-[0_0_0_3px_rgba(255,59,48,0.12)]'
              : 'border-border focus:border-primary focus:shadow-[0_0_0_3px_rgba(105,18,226,0.12)]',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
        {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
