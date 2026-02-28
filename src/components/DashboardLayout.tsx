import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  LogOut, 
  Package, 
  Tractor, 
  Users, 
  Bell,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../lib/utils';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('section') || 'aperçu');

  const getNavItems = () => {
    const common = [
      { id: 'aperçu', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Aperçu' },
    ];

    if (user?.role === 'farmer') {
      return [
        ...common,
        { id: 'seeds', icon: <Package className="w-5 h-5" />, label: 'Trouver des semences' },
        { id: 'tractors', icon: <Tractor className="w-5 h-5" />, label: 'Louer un tracteur' },
        { id: 'orders', icon: <ChevronRight className="w-5 h-5" />, label: 'Mes commandes' },
      ];
    }
    
    if (user?.role === 'seller') {
      return [
        ...common,
        { id: 'products', icon: <Package className="w-5 h-5" />, label: 'Mes produits' },
        { id: 'sales', icon: <Bell className="w-5 h-5" />, label: 'Commandes' },
      ];
    }

    if (user?.role === 'owner') {
      return [
        ...common,
        { id: 'fleet', icon: <Tractor className="w-5 h-5" />, label: 'Mon équipement' },
        { id: 'rentals', icon: <Bell className="w-5 h-5" />, label: 'Demandes de location' },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...common,
        { id: 'users', icon: <Users className="w-5 h-5" />, label: 'Utilisateurs' },
        { id: 'moderation', icon: <Package className="w-5 h-5" />, label: 'Modération' },
      ];
    }

    return common;
  };

  const navItems = getNavItems();
  const currentSection = searchParams.get('section') || activeTab;

  const tabLabels: Record<string, string> = {
    aperçu: 'Tableau de bord',
    seeds: 'Semences',
    tractors: 'Tracteurs',
    orders: 'Commandes',
    products: 'Produits',
    sales: 'Ventes',
    fleet: 'Ma flotte',
    rentals: 'Locations',
    users: 'Utilisateurs',
    moderation: 'Modération'
  };
  
  const roleLabel = user?.role
    ? ({
        farmer: 'Agriculteur',
        seller: 'Vendeur',
        owner: 'Propriétaire',
        admin: 'Administrateur',
      }[user.role] ?? user.role)
    : 'Invité';
  
  const roleBackgroundImage = user?.role
    ? ({
        farmer: 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg',
        seller: 'https://images.pexels.com/photos/175389/pexels-photo-175389.jpeg',
        owner: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg',
        admin: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg',
      }[user.role] ?? '')
    : '';

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex relative overflow-hidden">
      {roleBackgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: `url(${roleBackgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5F0]/95 via-[#F5F5F0]/92 to-[#eef4ec]/95 pointer-events-none" />
      {/* Sidebar */}
      <aside className="w-64 bg-white/95 border-r border-slate-200 hidden md:flex flex-col fixed h-full z-20 backdrop-blur-sm">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/terralink-logo.png" alt="Logo TerraLink" className="w-12 h-12 rounded-md object-cover" />
            <span className="text-xl font-bold text-[#1B5E20]">TerraLink</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                const params = new URLSearchParams(searchParams);
                params.set('section', item.id);
                setSearchParams(params);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                currentSection === item.id
                  ? "bg-[#1B5E20] text-white" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <img src={user?.avatar} className="w-10 h-10 rounded-full bg-slate-100" alt="" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400">{roleLabel}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative z-10">
        <header className="h-16 bg-white/95 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-slate-800">
            {tabLabels[currentSection] || currentSection}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-100 md:hidden overflow-hidden">
               <img src={user?.avatar} alt="" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
