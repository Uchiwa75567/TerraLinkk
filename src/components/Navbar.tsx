import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/terralink-logo.png"
              alt="Logo TerraLink"
              className="w-14 h-14 rounded-lg object-cover group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-bold text-[#1B5E20] tracking-tight">TerraLink</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/#fonctionnalites" className="text-slate-600 hover:text-[#1B5E20] font-medium transition-colors">Fonctionnalités</Link>
            <Link to="/#comment-ca-marche" className="text-slate-600 hover:text-[#1B5E20] font-medium transition-colors">Comment ça marche</Link>
            <Link to="/profils" className="text-slate-600 hover:text-[#1B5E20] font-medium transition-colors">Profils</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="bg-[#1B5E20] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#1B5E20]/90 transition-all">
                  Tableau de bord
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                  aria-label="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-600 hover:text-[#1B5E20] font-medium transition-colors">Connexion</Link>
                <Link to="/register" className="bg-[#1B5E20] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#1B5E20]/90 transition-all shadow-sm">
                  Commencer
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 py-4 px-4 space-y-4 animate-in slide-in-from-top duration-300">
          <Link to="/#fonctionnalites" className="block text-slate-600 font-medium" onClick={() => setIsOpen(false)}>Fonctionnalités</Link>
          <Link to="/#comment-ca-marche" className="block text-slate-600 font-medium" onClick={() => setIsOpen(false)}>Comment ça marche</Link>
          <Link to="/profils" className="block text-slate-600 font-medium" onClick={() => setIsOpen(false)}>Profils</Link>
          {user ? (
            <Link to="/dashboard" className="block bg-[#1B5E20] text-white px-4 py-2 rounded-xl text-center" onClick={() => setIsOpen(false)}>Tableau de bord</Link>
          ) : (
            <>
              <Link to="/login" className="block text-slate-600 font-medium" onClick={() => setIsOpen(false)}>Connexion</Link>
              <Link to="/register" className="block bg-[#1B5E20] text-white px-4 py-2 rounded-xl text-center" onClick={() => setIsOpen(false)}>Commencer</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
