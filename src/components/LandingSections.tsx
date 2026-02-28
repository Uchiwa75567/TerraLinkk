import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Users, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HERO_IMG = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/456b8acf-79dd-41b0-a081-885aa8a51798/hero-bg-01bdc461-1772289440696.webp";

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-[#F5F5F0] via-[#E8F5E9] to-[#F5F5F0]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-[#66BB6A]/10 text-[#1B5E20] px-4 py-1.5 rounded-full text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B5E20] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B5E20]"></span>
              </span>
              Soutenir l'Agriculture Moderne
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1]">
              Connecter les Agriculteurs aux <span className="text-[#1B5E20]">Ressources Essentielles</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Trouvez des semences de qualité, louez des tracteurs modernes et connectez-vous avec des fournisseurs fiables. Tout en un seul endroit.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-[#1B5E20] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1B5E20]/90 hover:scale-[1.02] transition-all shadow-lg shadow-[#1B5E20]/20">
                Trouver des Semences <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="bg-white text-[#1B5E20] border-2 border-[#1B5E20] px-8 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-[#1B5E20]/5 transition-all">
                Louer un Tracteur
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100" alt="" />
                ))}
              </div>
              <p className="text-sm font-medium text-slate-500">
                <span className="text-slate-900 font-bold">5 000+</span> agriculteurs nous ont rejoint ce mois-ci
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
              <img src={HERO_IMG} alt="Agriculteur dans son champ" className="w-full aspect-[4/5] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-[240px] border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#66BB6A]/20 p-2 rounded-lg text-[#1B5E20]">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Mieux Noté</p>
                  <p className="font-bold text-slate-900">Semences d'Élite</p>
                </div>
              </div>
              <div className="flex gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Rechercher des Ressources",
      desc: "Parcourez des milliers de variétés de semences et d'équipements disponibles dans votre région.",
      icon: <Search className="w-8 h-8" />,
      color: "bg-blue-500"
    },
    {
      title: "Contacter les Fournisseurs",
      desc: "Discutez directement avec les vendeurs et propriétaires pour négocier les conditions et la disponibilité.",
      icon: <Users className="w-8 h-8" />,
      color: "bg-[#66BB6A]"
    },
    {
      title: "Confirmer et Cultiver",
      desc: "Sécurisez votre commande et retournez à ce que vous faites de mieux : cultiver votre terre.",
      icon: <CheckCircle className="w-8 h-8" />,
      color: "bg-orange-500"
    }
  ];

  return (
    <section id="comment-ca-marche" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comment fonctionne TerraLink</h2>
          <p className="text-slate-600">Trois étapes simples pour booster votre productivité agricole et simplifier vos opérations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {idx < 2 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-slate-100 -z-10 translate-x-[-15%]"></div>
              )}
              <div className="bg-[#F5F5F0] rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#66BB6A]/20 group-hover:-translate-y-2">
                <div className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${step.color.split('-')[1]}-500/30`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};