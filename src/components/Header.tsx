
import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './Auth/UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from './Logo';
import { User } from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-8" />
          <span className="font-semibold text-xl">MyGym</span>
        </Link>
        
        {user && (
          <div className="flex items-center space-x-4">
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 text-gray-600 hover:text-brand-primary transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Profil</span>
            </Link>
            <UserMenu />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
