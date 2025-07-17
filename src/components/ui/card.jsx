import React from "react";

const Card = ({ className = "", children }) => {
  return (
    <div className={`rounded-2xl bg-white dark:bg-zinc-900 shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ className = "", children }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};
export default Card