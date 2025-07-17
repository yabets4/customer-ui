// src/components/ui/Textarea.jsx

import React from "react";

export const Textarea = React.forwardRef(({ className, icon: IconComponent, ...props }, ref) => {
  return (
    // This wrapper div is essential to position the icon relative to the textarea.
    // The textarea itself cannot directly contain the icon element.
    <div className="relative">
      {IconComponent && ( // Conditionally render the icon if IconComponent is provided
        <div className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">
          {/*
            IMPORTANT: IconComponent should be a React component (e.g., FileText from lucide-react),
            NOT an already rendered JSX element like <FileText />.
            If you pass <FileText /> as the icon prop, IconComponent will already be a JSX element,
            and trying to render <IconComponent /> again will cause the error you're seeing.
          */}
          <IconComponent className="w-5 h-5" />
        </div>
      )}
      <textarea
        ref={ref}
        // Adjust padding-left (pl-10) if an icon is present to make space for it.
        // Ensure 'resize-none' is correctly applied if you want to prevent user resizing.
        className={`w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none
          ${IconComponent ? 'pl-10' : ''}  // Add left padding if an icon is present
          ${className}
        `}
        {...props}
      />
    </div>
  );
});

Textarea.displayName = "Textarea";