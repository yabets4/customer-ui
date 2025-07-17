import React, { useState } from 'react';
import { SquareChevronDown, X, Rocket, UserCircle2, Settings, LogOut } from 'lucide-react'; // Added more icons for potential use

const navLinks = [ // Renamed to avoid conflict and clarity
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'CRM', href: '/crm' },
  { name: 'Inventory', href: '/inventory' },
  { name: 'Projects', href: '/projects' },
  { name: 'Finance', href: '/finance' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // For user dropdown

  // Helper to determine if a link is active (for demonstration, assumes current path)
  // In a real app, you'd use react-router-dom's useLocation hook
  const isActiveLink = (href) => {
    // This is a simplified check. For full routing, use `useLocation().pathname`
    // return location.pathname === href;
    return false; // Placeholder, as actual path isn't available here
  };

  return (
    <header className="bg-gradient-to-r from-gray-950 to-gray-600 shadow-xl sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between h-16">

        {/* Logo and Brand Name */}
        <div className="flex-shrink-0">
          <a href="/" className="flex items-center text-white text-2xl max-sm:ml-25 font-extrabold tracking-tight">
            <Rocket className="w-8 h-8 mr-2 text-blue-300 transform rotate-45" /> {/* Enhanced logo icon */}
            King's<span className="font-light text-blue-200">ERP</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-grow justify-center space-x-8">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className={`relative text-white font-medium text-lg px-3 py-2 rounded-lg
                          hover:bg-blue-600 hover:text-white transition-all duration-300
                          ${isActiveLink(link.href) ? 'bg-blue-600 text-white shadow-md' : 'text-blue-100'}`}
            >
              {link.name}
              {isActiveLink(link.href) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
              )}
            </a>
          ))}
        </nav>

        {/* User/Profile Section (Desktop) */}
        <div className="hidden md:flex items-center space-x-4 relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 text-blue-100 hover:text-white transition"
          >
            <UserCircle2 className="w-7 h-7" />
            <span className="font-medium text-lg">Yabets M</span> {/* Example User Name */}
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 ring-1 ring-black ring-opacity-5">
              <a href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
                <UserCircle2 className="w-5 h-5 mr-2" /> Profile
              </a>
              <a href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
                <Settings className="w-5 h-5 mr-2" /> Settings
              </a>
              <div className="border-t border-gray-100 my-1"></div>
              <button className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition">
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-blue-200 transition">
            {isMobileMenuOpen ? <X size={28} strokeWidth={2.5} /> : <SquareChevronDown size={28} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 pb-4 shadow-lg animate-fade-in-down"> {/* Added animation class */}
          <nav className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium
                            ${isActiveLink(link.href) ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white'}
                            transition-colors duration-200`}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              >
                {link.name}
              </a>
            ))}
            <div className="border-t border-blue-600 my-2"></div> {/* Separator for user actions */}
            <a href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-600 hover:text-white transition">
                <UserCircle2 className="inline-block w-5 h-5 mr-2" /> Profile
            </a>
            <a href="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-600 hover:text-white transition">
                <Settings className="inline-block w-5 h-5 mr-2" /> Settings
            </a>
            <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-red-700 hover:text-white transition">
                <LogOut className="inline-block w-5 h-5 mr-2" /> Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
