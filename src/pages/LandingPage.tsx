import React from 'react';
import { 
  Sprout, 
  ShoppingCart, 
  Truck, 
  ArrowRight,
  Search,
  Handshake,
  Star
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { getPublicProfiles, roleLabel } from '../lib/publicProfiles';
import { listApprovedAnnouncements } from '../lib/marketplace';

const HERO_IMAGE = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/456b8acf-79dd-41b0-a081-885aa8a51798/hero-bg-b72073f1-1772289763686.webp";
const FARMER_IMG = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/456b8acf-79dd-41b0-a081-885aa8a51798/farmer-illustration-e407138e-1772289763337.webp";
const SELLER_IMG = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/456b8acf-79dd-41b0-a081-885aa8a51798/seller-illustration-78497a20-1772289762732.webp";
const OWNER_IMG = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/456b8acf-79dd-41b0-a081-885aa8a51798/owner-illustration-b853e5b8-1772289763852.webp";

const LandingPage = () => {
  const publicProfiles = getPublicProfiles().filter((p) => p.role !== "admin").slice(0, 6);
  const approvedAnnouncements = listApprovedAnnouncements().slice(0, 6);

  return (
    <div className="bg-[#F5F5F0] min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                Révolutionner l'Agriculture
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
                Connecter les agriculteurs aux <span className="text-primary">Ressources Agricoles</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-xl">
                La place de marché moderne pour les semences, la location d'équipement et les services agricoles professionnels. Tout au même endroit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?role=farmer">
                  <Button size="lg" className="w-full sm:w-auto flex gap-2">
                    Trouver des semences <Search className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/register?role=farmer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Louer un tracteur
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform lg:rotate-3 transition-transform hover:rotate-0 duration-500">
                <img src={HERO_IMAGE} alt="Agriculteur dans son champ" className="w-full h-auto object-cover" />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comment fonctionne TerraLink</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Trois étapes simples pour booster votre productivité agricole et votre portée.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Search className="w-8 h-8 text-white" />,
                title: "1. Rechercher des ressources",
                desc: "Trouvez les meilleures semences, tracteurs et outils auprès de fournisseurs locaux de confiance.",
                bg: "bg-primary"
              },
              {
                icon: <Handshake className="w-8 h-8 text-white" />,
                title: "2. Contacter les fournisseurs",
                desc: "Communiquez directement avec les vendeurs et propriétaires. Obtenez des devis instantanément.",
                bg: "bg-[#66BB6A]"
              },
              {
                icon: <Sprout className="w-8 h-8 text-white" />,
                title: "3. Confirmer et cultiver",
                desc: "Finalisez votre commande ou location et concentrez-vous sur l'essentiel : votre ferme.",
                bg: "bg-[#8D6E63]"
              }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg", step.bg)}>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section id="pour-qui" className="py-24 bg-[#F5F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pour qui est TerraLink ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Des expériences sur mesure pour chaque professionnel de l'écosystème agricole.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Agriculteur",
                desc: "Accédez à des semences de qualité et du matériel moderne sans les coûts élevés de possession.",
                icon: <Sprout className="w-6 h-6 text-primary" />,
                cta: "Trouver des ressources",
                img: FARMER_IMG
              },
              {
                title: "Vendeur de Semences",
                desc: "Élargissez votre marché et gérez votre inventaire avec nos outils de vente performants.",
                icon: <ShoppingCart className="w-6 h-6 text-[#66BB6A]" />,
                cta: "Lister mes produits",
                img: SELLER_IMG
              },
              {
                title: "Propriétaire d'Équipement",
                desc: "Rentabilisez vos tracteurs et outils en les louant aux agriculteurs locaux.",
                icon: <Truck className="w-6 h-6 text-[#8D6E63]" />,
                cta: "Enregistrer mon matériel",
                img: OWNER_IMG
              }
            ].map((role, i) => (
              <Card key={i} className="hover:shadow-xl transition-shadow border-none shadow-soft overflow-hidden">
                <div className="h-48 overflow-hidden">
                   <img src={role.img} alt={role.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                </div>
                <CardContent className="p-8">
                  <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                    {role.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{role.title}</h3>
                  <p className="text-gray-600 mb-8">{role.desc}</p>
                  <Link to="/register" className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all">
                    {role.cta} <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Approuvé par des milliers d'agriculteurs</h2>
              <div className="space-y-8">
                {[
                  {
                    name: "Samuel Okafor",
                    role: "Riziculteur",
                    text: "TerraLink a changé ma façon de sourcer mes semences. J'ai trouvé des variétés à haut rendement introuvables localement.",
                    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel"
                  },
                  {
                    name: "Grace Mendis",
                    role: "Propriétaire de tracteur",
                    text: "Mon tracteur restait inutilisé pendant des semaines. Maintenant, il est réservé tous les jours pendant la saison des semis.",
                    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace"
                  }
                ].map((t, i) => (
                  <div key={i} className="flex gap-4">
                    <img src={t.img} alt={t.name} className="w-16 h-16 rounded-full object-cover border-4 border-[#F5F5F0] bg-slate-100" />
                    <div>
                      <div className="flex text-yellow-400 mb-1">
                        {[...Array(5)].map((_, j) => <Star className="w-4 h-4 fill-current" key={j} />)}
                      </div>
                      <p className="text-gray-700 italic mb-2">"{t.text}"</p>
                      <p className="font-bold text-gray-900">{t.name} <span className="text-gray-400 font-normal">— {t.role}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary p-12 rounded-3xl text-white text-center shadow-xl">
              <Sprout className="w-16 h-16 mx-auto mb-8 opacity-50 text-white" />
              <h3 className="text-3xl font-bold mb-6">Prêt à booster votre récolte ?</h3>
              <p className="text-white/80 mb-10 text-lg">Rejoignez la révolution agricole et connectez-vous avec votre communauté dès aujourd'hui.</p>
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full font-bold">Rejoindre TerraLink maintenant</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Annonces validées */}
      <section id="annonces-validees" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Annonces validées</h2>
            <p className="text-gray-600">
              Annonces approuvées par l'administration et visibles par toute la communauté.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approvedAnnouncements.map((item) => (
              <div key={`${item.source}-${item.id}`} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <img src={item.image} className="w-full h-44 object-cover" />
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">
                    {item.source === "farmer_notice" ? "Annonce agriculteur" : "Équipement propriétaire"}
                  </p>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{item.subtitle}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {item.authorName} • {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {approvedAnnouncements.length === 0 && (
            <p className="text-sm text-slate-500 text-center">Aucune annonce validée pour le moment.</p>
          )}
        </div>
      </section>

      {/* Annuaire public */}
      <section id="annuaire" className="py-24 bg-[#F5F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Profils Publics</h2>
              <p className="text-gray-600">Consultez les acteurs de la plateforme, même sans compte.</p>
            </div>
            <Link to="/profils" className="text-[#1B5E20] font-bold">Voir tout l'annuaire →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publicProfiles.map((p) => {
              const cover = p.profile?.photoExploitation || p.profile?.photoCommerce || p.profile?.photoParc || p.avatar;
              return (
                <Link key={p.id} to={`/profils/${p.id}`} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
                  <img src={cover} className="w-full h-44 object-cover" />
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={p.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-500">{roleLabel(p.role)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{p.profile?.localisation || "Localisation non renseignée"}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
