import React from 'react';
import { AlertCircle } from 'lucide-react';

const Input = React.forwardRef(
  (
    {
      label,
      name,
      type = 'text',
      value,
      onChange,
      placeholder,
      required,
      disabled,
      icon,
      trailing,
      error,
      helpText, // <--- ADD THIS HERE to destructure it
      className = '',
      ...props // This now correctly excludes `helpText`
    },
    ref
  ) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}

          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            ref={ref}
            className={`
              block w-full rounded-md border px-3 py-2 text-sm shadow-sm
              transition focus:outline-none focus:ring-2 focus:ring-blue-500
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-700'}
              bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100
              placeholder:text-gray-500 dark:placeholder:text-gray-400
              disabled:cursor-not-allowed disabled:opacity-60
            `}
            {...props}
          />

          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-red-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}

          {trailing && (
            <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
              {trailing}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helpText && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>} {/* <--- ADD THIS LINE */}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;