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
      <div className="field">
        {label && <label htmlFor={inputId}>{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={['input', error ? 'error' : '', className].join(' ')}
          {...props}
        />
        {error && <p className="field-error">{error}</p>}
        {hint && !error && <p className="field-hint">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
