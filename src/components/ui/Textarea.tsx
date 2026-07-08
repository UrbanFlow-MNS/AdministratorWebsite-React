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
      <div className="field">
        {label && <label htmlFor={inputId}>{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          rows={3}
          className={['textarea', error ? 'error' : '', className].join(' ')}
          {...props}
        />
        {error && <p className="field-error">{error}</p>}
        {hint && !error && <p className="field-hint">{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
