import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/terralink-logo.png" alt="Logo TerraLink" className="w-10 h-10 rounded-md object-cover" />
              <span className="text-xl font-bold text-white">TerraLink</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Donner aux agriculteurs les outils et ressources modernes pour cultiver un avenir durable.
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-[#66BB6A]" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-[#66BB6A]" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-[#66BB6A]" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Accueil</Link></li>
              <li><Link to="/login" className="hover:text-white">Trouver des semences</Link></li>
              <li><Link to="/login" className="hover:text-white">Louer un tracteur</Link></li>
              <li><Link to="/register" className="hover:text-white">Devenir vendeur</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Guide agricole</a></li>
              <li><a href="#" className="hover:text-white">Tendances du marché</a></li>
              <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-white">Politique de confidentialité</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@terralink.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +221 77 486 79 60</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 123 Rue de l'Agriculture, Fermeville</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} TerraLink. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
