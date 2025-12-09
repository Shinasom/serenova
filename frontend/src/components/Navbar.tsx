"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
import { Home, MessageCircle, Wind, BookHeart, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // 1. Hide Navbar on Auth pages
  if (pathname === '/login' || pathname === '/register') return null;

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Redirect to login
    router.push('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Breathe', path: '/breathe', icon: Wind }, 
    { name: 'Journal', path: '/journal', icon: BookHeart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 py-2 px-6 md:top-0 md:bottom-auto md:border-b md:border-t-0 z-40">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        
        {/* Desktop Logo */}
        <div className="hidden md:block font-bold text-xl text-serenova-dark font-poppins">
          Serenova
        </div>

        {/* Navigation Links */}
        <div className="flex w-full md:w-auto justify-between md:gap-8 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                  isActive(item.path) 
                    ? 'text-serenova-primary bg-serenova-bg' 
                    : 'text-gray-400 hover:text-serenova-dark'
                }`}
              >
                <Icon size={24} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Logout Button (Visible on Desktop, or add to list for mobile if preferred) */}
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 p-2 text-red-400 hover:text-red-600 transition-colors ml-2 md:ml-4 border-l border-gray-100 pl-4 md:border-none md:pl-0"
          >
            <LogOut size={20} />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>

      </div>
    </nav>
  );
}