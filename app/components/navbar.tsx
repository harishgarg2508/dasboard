'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserPlus, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/form', icon: UserPlus, label: 'New Patient' },
    { href: '/list', icon: Users, label: 'Patient List' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <span className="text-xl font-semibold text-gray-800">
            Dental Practice
          </span>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex md:space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} />
            ))}
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } md:hidden`}
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} mobile />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, icon: Icon, label, pathname, mobile = false }) => {
  const isActive = pathname === href;
  const baseClasses = "inline-flex items-center px-4 py-2 rounded-lg transition-colors";
  const mobileClasses = mobile ? "w-full" : "";
  const activeClasses = isActive
    ? "bg-indigo-600 text-white"
    : "text-gray-600 hover:bg-indigo-50";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${mobileClasses} ${activeClasses}`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </Link>
  );
};

export default Navbar;

