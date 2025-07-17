import React from 'react';
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Rocket,
  Phone,
  MapPin,
} from 'lucide-react'; // Added icons for social media and contact info

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 py-12 border-t border-gray-700 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">

          {/* Section 1: Brand Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center md:justify-start">
              <Rocket className="w-6 h-6 mr-2 text-blue-400" /> King's<span className="font-light text-blue-300">ERP</span>
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Your comprehensive solution for streamlined business operations. Empowering growth through efficiency.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard" className="hover:text-white transition-colors duration-200">Dashboard</a></li>
              <li><a href="/crm" className="hover:text-white transition-colors duration-200">CRM</a></li>
              <li><a href="/inventory" className="hover:text-white transition-colors duration-200">Inventory</a></li>
              <li><a href="/projects" className="hover:text-white transition-colors duration-200">Projects</a></li>
              <li><a href="/finance" className="hover:text-white transition-colors duration-200">Finance</a></li>
            </ul>
          </div>

          {/* Section 3: Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/faq" className="hover:text-white transition-colors duration-200">FAQ</a></li>
              <li><a href="/documentation" className="hover:text-white transition-colors duration-200">Documentation</a></li>
              <li><a href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>

          {/* Section 4: Contact Us */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <address className="not-italic text-sm space-y-2">
              <p className="flex items-center justify-center md:justify-start">
                <MapPin size={16} className="mr-2 text-gray-500" /> Addis Ababa, Ethiopia
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <Phone size={16} className="mr-2 text-gray-500" /> +251 912 345 678
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <Mail size={16} className="mr-2 text-gray-500" /> info@kingserp.com
              </p>
            </address>
          </div>

        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} King'sERP by King'sWood ERP. All rights reserved.
          </p>
          <p className="mt-2">
            Built with <span className="text-red-500">❤️</span> in Ethiopia.
          </p>
        </div>
      </div>
    </footer>
  );
}