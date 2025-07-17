// LoadingSpinner.jsx
import React from 'react';

/**
 * A reusable and responsive loading spinner component.
 * It displays a simple animated spinner to indicate ongoing processes.
 * Uses Tailwind CSS for styling.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.size='md'] - The size of the spinner.
 * Can be 'sm', 'md', 'lg', 'xl'. Defaults to 'md'.
 * @param {string} [props.color='blue'] - The color of the spinner.
 * Can be 'blue', 'gray', 'purple', 'green', 'red', etc. (Tailwind color names).
 * Defaults to 'blue'.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the spinner container.
 */
const LoadingSpinner = ({ size = 'md', color = 'blue', className = '' }) => {
  // Define spinner size classes based on the 'size' prop
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3', // Default
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  // Define spinner color classes based on the 'color' prop
  const colorClasses = {
    blue: 'border-blue-500 border-t-transparent',
    gray: 'border-gray-500 border-t-transparent',
    purple: 'border-purple-500 border-t-transparent',
    green: 'border-green-500 border-t-transparent',
    red: 'border-red-500 border-t-transparent',
    // Add more colors as needed
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
