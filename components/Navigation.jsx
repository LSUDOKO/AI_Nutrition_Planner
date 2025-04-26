"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Home, 
  Dumbbell, 
  ChefHat, 
  User, 
  Bell, 
  Menu, 
  X,
  BookOpen,
  Calendar,
  Search,
  Settings,
  Clock,
  LogIn
} from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2); // Example notification count
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Temporary auth state until Clerk is installed
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ href, children, icon }) => {
    const isActive = pathname === href;
    
    return (
      <Link href={href} className="group">
        <motion.div 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg ${
            isActive 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'text-slate-200 hover:bg-white/10'
          } transition-all duration-200`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className={`${isActive ? 'text-white' : 'text-emerald-400 group-hover:text-white'} transition-colors`}>
            {icon}
          </span>
          <span className="font-medium">{children}</span>
          
          {isActive && (
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5 bg-white" 
              layoutId="navbar-indicator"
              style={{ width: '100%' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.div>
      </Link>
    );
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled 
          ? 'bg-slate-900/90 backdrop-blur-lg shadow-lg' 
          : 'bg-gradient-to-r from-slate-900 to-slate-800'
      } border-b border-slate-700/50 transition-all duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <motion.div
                  className="flex items-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center">
                    <BookOpen size={18} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 text-transparent bg-clip-text font-bold text-xl">
                    Nutritionist AI
                  </span>
                </motion.div>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex ml-10 items-center space-x-1.5 relative">
              <NavLink href="/" icon={<Home size={18} />}>Home</NavLink>
              <NavLink href="/fitness" icon={<Dumbbell size={18} />}>Fitness</NavLink>
              <NavLink href="/recipe" icon={<ChefHat size={18} />}>Recipes</NavLink>
              <NavLink href="/diary" icon={<Calendar size={18} />}>Diary</NavLink>
              <NavLink href="/profile" icon={<User size={18} />}>Profile</NavLink>
            </div>
          </div>
          
          {/* Search bar and user profile */}
          {isSignedIn ? (
            <div className="hidden md:flex items-center gap-3">
              {/* Search bar */}
              <motion.div 
                className={`relative ${searchFocused ? 'w-64' : 'w-48'} transition-all duration-300`}
                animate={{ width: searchFocused ? 256 : 192 }}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search foods..."
                  className="w-full bg-slate-800/70 border border-slate-700 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 block pl-10 pr-3 py-1.5 text-sm rounded-lg placeholder-slate-400 text-white"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </motion.div>
              
              {/* Recent activity */}
              <motion.div
                className="relative cursor-pointer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/notifications">
                  <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Clock size={18} className="text-slate-300" />
                  </div>
                </Link>
              </motion.div>
              
              {/* Notifications */}
              <motion.div
                className="relative cursor-pointer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/notifications">
                  <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Bell size={18} className="text-emerald-400" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
              
              {/* Settings */}
              <motion.div
                className="relative cursor-pointer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/settings">
                  <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Settings size={18} className="text-slate-300" />
                  </div>
                </Link>
              </motion.div>
              
              {/* User profile button (temporary placeholder) */}
              <div className="border-l border-slate-700/50 ml-2 pl-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white cursor-pointer">
                  U
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <Link href="/login">
                <motion.button
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-emerald-600/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-slate-300 hover:text-white focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu with AnimatePresence for smooth transitions */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-800 backdrop-blur-lg border-b border-slate-700/50 overflow-hidden"
          >
            {/* Mobile search */}
            <div className="px-4 pt-4 pb-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search foods..."
                  className="w-full bg-slate-700/50 border border-slate-600 block pl-10 pr-3 py-2 rounded-lg placeholder-slate-400 text-white text-sm"
                />
              </div>
            </div>
            
            {/* Mobile nav links */}
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {[
                { href: '/', label: 'Home', icon: <Home size={18} /> },
                { href: '/fitness', label: 'Fitness', icon: <Dumbbell size={18} /> },
                { href: '/recipe', label: 'Recipes', icon: <ChefHat size={18} /> },
                { href: '/diary', label: 'Food Diary', icon: <Calendar size={18} /> },
                { href: '/profile', label: 'Profile', icon: <User size={18} /> },
              ].map((item) => (
                <NavLink key={item.href} href={item.href} icon={item.icon}>
                  {item.label}
                </NavLink>
              ))}
            </div>
            
            {/* Mobile user profile */}
            {isSignedIn && (
              <div className="pt-4 pb-5 border-t border-slate-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      U
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">User Name</div>
                    <div className="text-sm font-medium text-slate-400">user@example.com</div>
                  </div>
                  <Link href="/notifications" className="ml-auto">
                    <div className="relative mr-1">
                      <Bell size={20} className="text-emerald-400" />
                      {notificationCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                          {notificationCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link href="/settings">
                    <motion.div
                      className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm text-white hover:bg-slate-700/70"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Settings size={16} className="text-slate-300" />
                      <span>Settings</span>
                    </motion.div>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Sign in button for mobile */}
            {!isSignedIn && (
              <div className="px-5 py-4 border-t border-slate-700">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-500"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}