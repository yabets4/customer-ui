import React from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-in-out whitespace-nowrap";

const sizes = {
  sm: "text-sm px-3 py-1.5 h-9", // Added fixed height for consistency
  md: "text-base px-4 py-2 h-10",
  lg: "text-lg px-5 py-2.5 h-12",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-5 h-5",
};

const variants = {
  // Primary (most prominent)
  primary: "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",

  // Secondary (less prominent)
  secondary: "bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300 hover:shadow-md focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",

  // Solid (neutral dark)
  solid: "bg-gray-900 text-white shadow-md hover:bg-gray-800 hover:shadow-lg focus:ring-2 focus:ring-gray-700 focus:ring-offset-2",

  // Outlined (bordered)
  outlined: "border border-gray-300 text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",

  // Ghost (minimal, text only)
  ghost: "text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2",

  // Link (styled like a link)
  link: "text-blue-600 hover:underline focus:ring-2 focus:ring-blue-300 focus:ring-offset-2",

  // Success (positive confirmation)
  success: "bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2",

  // Warning (cautionary actions)
  warning: "bg-yellow-500 text-white shadow-md hover:bg-yellow-600 hover:shadow-lg focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",

  // Info (informational actions)
  info: "bg-cyan-600 text-white shadow-md hover:bg-cyan-700 hover:shadow-lg focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2",

  // Dark (very subtle, less emphasis than solid)
  dark: "bg-gray-700 text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2",

  // Light (subtle neutral)
  light: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2",

  // Disabled (no hover, no interactivity – must be conditionally applied)
  disabled: "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70",
  neon: "bg-black text-green-400 border border-green-500 shadow-md hover:bg-green-500 hover:text-black hover:shadow-lg transition focus:ring-2 focus:ring-green-400 focus:ring-offset-2",

  // Frosted Glass (minimal & modern)
  glass: "bg-white/30 backdrop-blur-sm text-white border border-white/20 hover:bg-white/40 transition shadow hover:shadow-md focus:ring-2 focus:ring-white/50 focus:ring-offset-2",

  // Aurora Gradient
  aurora: "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white font-semibold shadow-md hover:opacity-90 focus:ring-2 focus:ring-pink-300 focus:ring-offset-2",

  // Terminal (monospace/dev-style)
  terminal: "bg-gray-900 text-green-400 font-mono border border-green-600 hover:bg-green-600 hover:text-black hover:border-black shadow-md focus:ring-2 focus:ring-green-500",

  // Cyberpunk
  cyberpunk: "bg-yellow-400 text-black uppercase font-bold tracking-wide hover:bg-pink-500 hover:text-white hover:shadow-lg transition focus:ring-2 focus:ring-pink-300 focus:ring-offset-2",

  // Aqua (soft blue)
  aqua: "bg-sky-500 text-white shadow hover:bg-sky-600 hover:shadow-md focus:ring-2 focus:ring-sky-400",

  // Royal (luxury look)
  royal: "bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg hover:brightness-110 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",

  // Outline Accent (subtle)
  outlineAccent: "border border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 hover:text-blue-700 focus:ring-2 focus:ring-blue-300",

  
  // Ghost Dark
  ghostDark: "text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300",

  // Matrix
  matrix: "bg-black text-green-400 border border-green-600 hover:bg-green-700 hover:text-black hover:border-black font-mono focus:ring-2 focus:ring-green-500",
   
  // 🔴 Classic Danger
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2",

  
  // 🧨 Danger Outlined
  dangerOutlined: "border border-red-500 text-red-600 bg-white hover:bg-red-50 focus:ring-2 focus:ring-red-400 focus:ring-offset-2",

  // 🩸 Ghost Danger (subtle)
  dangerGhost: "text-red-600 hover:bg-red-100 focus:ring-2 focus:ring-red-300 focus:ring-offset-2",

  // 🚨 Destructive Warning (bold)
  destructive: "bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold shadow hover:opacity-90 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",

  // 💣 Blackout Danger (for dark UIs)
  dangerDark: "bg-black text-red-400 border border-red-500 hover:bg-red-600 hover:text-white hover:border-black focus:ring-2 focus:ring-red-600",

  // ⚠️ Flat Red (minimal)
  dangerFlat: "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
};


export default function Button({
  children,
  icon: Icon, // Renamed 'icon' to 'Icon' to follow React component naming conventions
  iconOnly = false,
  iconPosition = "left",
  variant = "solid",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const currentIconSizeClass = iconSizes[size];

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-60 cursor-not-allowed", // Dim and prevent cursor change
        iconOnly && "p-0 aspect-square", // Ensure square aspect ratio for icon-only
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className={clsx("animate-spin", currentIconSizeClass)} />
      ) : iconOnly && Icon ? (
        <Icon className={currentIconSizeClass} />
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon className={clsx("mr-2", currentIconSizeClass)} />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon className={clsx("ml-2", currentIconSizeClass)} />
          )}
        </>
      )}
    </button>
  );
}