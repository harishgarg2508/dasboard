'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserPlus, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <span className="text-xl font-semibold text-gray-800">
            Dental Practice
          </span>
          
          <div className="flex space-x-4">
            <Link
              href="/dashboard"
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors
                ${pathname === '/dashboard' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:bg-indigo-50'}`}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
            
            <Link
              href="/form"
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors
                ${pathname === '/form' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:bg-indigo-50'}`}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              New Patient
            </Link>
            
            <Link
              href="/list"
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors
                ${pathname === '/list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:bg-indigo-50'}`}
            >
              <Users className="w-5 h-5 mr-2" />
              Patient List
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;