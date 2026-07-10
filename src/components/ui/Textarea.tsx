import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-[5px]">
        {label && <label htmlFor={inputId} className="text-[0.8125rem] font-medium text-ink">{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          rows={3}
          className={[
            'w-full px-3 py-2.5 bg-surface border-[1.5px] rounded-[10px] text-sm text-ink outline-none resize-none transition-[border-color,box-shadow] duration-150 placeholder:text-faint',
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

Textarea.displayName = 'Textarea';
