
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserMenu from '@/components/Auth/UserMenu';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  return (
    <motion.header 
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-secondary/50 shadow-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-brand-primary">Ma P'tite Salle</span>
            </Link>
          </motion.div>
          
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" current={location.pathname === "/"}>
              Accueil
            </NavLink>
            
            {user && (
              <>
                <NavLink to="/wizard" current={location.pathname === "/wizard"}>
                  Profil
                </NavLink>
                <NavLink to="/dashboard" current={location.pathname === "/dashboard"}>
                  Dashboard
                </NavLink>
              </>
            )}
          </nav>
          
          <div className="flex items-center">
            <UserMenu />
            
            <div className="flex md:hidden ml-4">
              <button className="text-brand-primary p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const NavLink = ({ 
  to, 
  current, 
  children 
}: { 
  to: string; 
  current: boolean; 
  children: React.ReactNode 
}) => {
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
        current 
          ? 'text-brand-primary' 
          : 'text-gray-600 hover:text-brand-primary'
      }`}
    >
      {children}
      {current && (
        <motion.span 
          className="absolute inset-x-0 -bottom-1 h-0.5 bg-brand-primary"
          layoutId="underline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};

export default Header;
