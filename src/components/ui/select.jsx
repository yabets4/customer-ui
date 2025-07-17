import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      options,
      placeholder = 'Select an option',
      required,
      disabled,
      icon, // JSX icon
      error,
      className = '',
      // Destructure 'hideLabel' here so it's not passed to the DOM element
      hideLabel,
      ...props // 'props' will now contain only valid HTML attributes
    },
    ref
  ) => {
    const handleChange = (e) => {
      if (!onChange) return;
      const { name, value } = e.target;

      // Support both (e) => {} and (value) => {} usage
      if (typeof onChange === 'function') {
        if (onChange.length === 1 && onChange.toString().includes('target')) {
          onChange({ target: { name, value } });
        } else {
          onChange(value);
        }
      }
    };

    // Determine whether to show the label based on `label` prop existence and `hideLabel` prop
    const shouldShowLabel = label && !hideLabel;

    return (
      <div className={`w-full ${className}`}>
        {shouldShowLabel && ( // Conditionally render label based on shouldShowLabel
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
              {icon}
            </div>
          )}

          <select
            id={name}
            name={name}
            ref={ref}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={`
              block w-full rounded-md border px-3 py-2 text-sm shadow-sm
              transition focus:outline-none focus:ring-2 focus:ring-blue-500
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-700'}
              bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100
              placeholder:text-gray-500 dark:placeholder:text-gray-400
              disabled:cursor-not-allowed disabled:opacity-60
              appearance-none pr-9
            `}
            {...props} // Now 'props' will not contain 'hideLabel'
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400 dark:text-gray-300">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;