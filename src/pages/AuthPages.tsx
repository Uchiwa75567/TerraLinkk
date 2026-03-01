import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole, UserProfile } from '../context/AuthContext';
import { Mail, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '../components/ui/spinner';

const AUTH_BG = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/456b8acf-79dd-41b0-a081-885aa8a51798/auth-bg-28b13e38-1772289441656.webp";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await login(email, password, role);
      if (!result.ok) {
        toast.error(result.message || "Connexion impossible.");
        return;
      }
      toast.success("Bon retour sur TerraLink !");
      navigate('/dashboard');
    } catch (error) {
      toast.error(`Connexion impossible: ${error instanceof Error ? error.message : 'Erreur inconnue.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleLabels: Record<UserRole, string> = {
    farmer: 'Agriculteur',
    seller: 'Vendeur',
    owner: 'Propriétaire',
    admin: 'Admin'
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0 z-0">
        <img src={AUTH_BG} alt="Fond agricole" className="w-full h-full object-cover opacity-20" />
      </div>
      <div className="w-full max-w-md z-10 p-4">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/terralink-logo.png" alt="Logo TerraLink" className="w-14 h-14 rounded-xl object-cover" />
            <span className="text-2xl font-bold text-[#1B5E20]">TerraLink</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Bon Retour</h1>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="nom@exemple.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
                placeholder="******"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Se connecter en tant que</label>
              <div className="grid grid-cols-2 gap-3">
                {(['farmer', 'seller', 'owner', 'admin'] as UserRole[]).map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)} className={`py-2 px-3 text-xs font-bold rounded-lg border-2 capitalize ${role === r ? 'bg-[#1B5E20]/10 border-[#1B5E20] text-[#1B5E20]' : 'bg-white border-slate-100 text-slate-500'}`}>{roleLabels[r]}</button>
                ))}
              </div>
            </div>
            <button
              disabled={isSubmitting}
              className="w-full bg-[#1B5E20] text-white py-4 rounded-xl font-bold hover:bg-[#1B5E20]/90 transition-colors shadow-lg shadow-green-900/10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Spinner className="text-white" />}
              Se connecter
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-500">Pas encore de compte ? <Link to="/register" className="text-[#1B5E20] font-bold">En créer un</Link></p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [farmerForm, setFarmerForm] = useState({
    contact: '',
    localisation: '',
    culturesPrincipales: '',
    tailleExploitation: '',
    nombreEmployes: '',
    certifications: '',
    photoExploitation: '',
  });
  const [sellerForm, setSellerForm] = useState({
    contact: '',
    localisation: '',
    entreprise: '',
    categoriesProduits: '',
    capaciteStock: '',
    certifications: '',
    photoCommerce: '',
  });
  const [ownerForm, setOwnerForm] = useState({
    contact: '',
    localisation: '',
    regionService: '',
    machinesDisponibles: '',
    tarifHoraireMoyen: '',
    certifications: '',
    photoParc: '',
  });
  const [adminForm, setAdminForm] = useState({
    contact: '',
    localisation: '',
    departement: '',
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'farmer' | 'seller' | 'owner',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    if (target === 'farmer') {
      setFarmerForm((v) => ({ ...v, photoExploitation: dataUrl }));
      return;
    }
    if (target === 'seller') {
      setSellerForm((v) => ({ ...v, photoCommerce: dataUrl }));
      return;
    }
    setOwnerForm((v) => ({ ...v, photoParc: dataUrl }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setAvatar(dataUrl);
  };

  const buildProfile = (): UserProfile | undefined => {
    if (role === 'farmer') return farmerForm;
    if (role === 'seller') return sellerForm;
    if (role === 'owner') return ownerForm;
    if (role === 'admin') return adminForm;
    return undefined;
  };

  const validateRoleForm = () => {
    const missing: string[] = [];
    if (role === 'farmer') {
      if (!farmerForm.contact) missing.push("contact");
      if (!farmerForm.localisation) missing.push("localisation");
      if (!farmerForm.culturesPrincipales) missing.push("cultures principales");
      if (!farmerForm.tailleExploitation) missing.push("taille de l'exploitation");
      if (!farmerForm.nombreEmployes) missing.push("nombre d'employés");
      if (!farmerForm.photoExploitation) missing.push("photo de l'exploitation");
      return missing;
    }
    if (role === 'seller') {
      if (!sellerForm.contact) missing.push("contact");
      if (!sellerForm.localisation) missing.push("localisation");
      if (!sellerForm.entreprise) missing.push("entreprise");
      if (!sellerForm.categoriesProduits) missing.push("produits principaux");
      if (!sellerForm.capaciteStock) missing.push("capacité de stock");
      if (!sellerForm.photoCommerce) missing.push("photo du commerce/stock");
      return missing;
    }
    if (role === 'owner') {
      if (!ownerForm.contact) missing.push("contact");
      if (!ownerForm.localisation) missing.push("localisation");
      if (!ownerForm.regionService) missing.push("région d'opération");
      if (!ownerForm.machinesDisponibles) missing.push("machines disponibles");
      if (!ownerForm.tarifHoraireMoyen) missing.push("tarif horaire moyen");
      if (!ownerForm.photoParc) missing.push("photo du parc machines");
      return missing;
    }
    if (role === 'admin') {
      if (!adminForm.contact) missing.push("contact");
      if (!adminForm.localisation) missing.push("localisation");
      if (!adminForm.departement) missing.push("département");
      return missing;
    }
    return ["rôle invalide"];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
    if (!name || !email || !role) {
      toast.error('Complète le nom, email et rôle.');
      return;
    }
    if (!password || password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('La confirmation du mot de passe ne correspond pas.');
      return;
    }
    const missingFields = validateRoleForm();
    if (missingFields.length > 0) {
      toast.error(`Inscription impossible: champs manquants (${missingFields.join(", ")}).`);
      return;
    }
    const result = await register(name, email, password, role, buildProfile(), avatar);
    if (!result.ok) {
      toast.error(result.message ? `Inscription impossible: ${result.message}` : "Inscription impossible.");
      return;
    }
    toast.success(`Bienvenue à bord, ${name} !`);
    navigate('/dashboard');
    } catch (error) {
      toast.error(`Inscription impossible: ${error instanceof Error ? error.message : "Erreur inconnue."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0 z-0">
        <img src={AUTH_BG} alt="Fond agricole" className="w-full h-full object-cover opacity-20" />
      </div>
      <div className="w-full max-w-3xl z-10 p-4">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/terralink-logo.png" alt="Logo TerraLink" className="w-14 h-14 rounded-xl object-cover" />
            <span className="text-2xl font-bold text-[#1B5E20]">TerraLink</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Créer un Compte</h1>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Ex: Jean Dupont" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="jean@exemple.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Photo de profil</label>
              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
                {avatar && <img src={avatar} className="w-12 h-12 rounded-full object-cover border border-slate-200" />}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
                placeholder="Mot de passe (min 6 caractères)"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
                placeholder="Confirmer le mot de passe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Je suis un...</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'farmer', label: 'Agriculteur' },
                  { id: 'seller', label: 'Vendeur' },
                  { id: 'owner', label: 'Loueur' }
                ].map((r) => (
                  <button key={r.id} type="button" onClick={() => setRole(r.id as UserRole)} className={`py-3 px-2 text-[10px] font-bold rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${role === r.id ? 'bg-[#1B5E20]/10 border-[#1B5E20] text-[#1B5E20]' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}>
                    <CheckCircle2 className={`w-4 h-4 ${role === r.id ? 'opacity-100' : 'opacity-0'}`} />{r.label}
                  </button>
                ))}
              </div>
            </div>
            {role === 'farmer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={farmerForm.contact} onChange={(e) => setFarmerForm((v) => ({ ...v, contact: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Contact (téléphone)" />
                <input value={farmerForm.localisation} onChange={(e) => setFarmerForm((v) => ({ ...v, localisation: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Localisation" />
                <input value={farmerForm.culturesPrincipales} onChange={(e) => setFarmerForm((v) => ({ ...v, culturesPrincipales: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Cultures principales" />
                <input value={farmerForm.tailleExploitation} onChange={(e) => setFarmerForm((v) => ({ ...v, tailleExploitation: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Taille de l'exploitation (ha)" />
                <input value={farmerForm.nombreEmployes} onChange={(e) => setFarmerForm((v) => ({ ...v, nombreEmployes: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Nombre d'employés" />
                <input value={farmerForm.certifications} onChange={(e) => setFarmerForm((v) => ({ ...v, certifications: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Certifications (optionnel)" />
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Photo de l'exploitation (obligatoire)</label>
                  <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'farmer')} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
                </div>
              </div>
            )}
            {role === 'seller' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={sellerForm.contact} onChange={(e) => setSellerForm((v) => ({ ...v, contact: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Contact (téléphone)" />
                <input value={sellerForm.localisation} onChange={(e) => setSellerForm((v) => ({ ...v, localisation: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Localisation" />
                <input value={sellerForm.entreprise} onChange={(e) => setSellerForm((v) => ({ ...v, entreprise: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Nom de l'entreprise" />
                <input value={sellerForm.categoriesProduits} onChange={(e) => setSellerForm((v) => ({ ...v, categoriesProduits: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Produits principaux" />
                <input value={sellerForm.capaciteStock} onChange={(e) => setSellerForm((v) => ({ ...v, capaciteStock: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Capacité de stock" />
                <input value={sellerForm.certifications} onChange={(e) => setSellerForm((v) => ({ ...v, certifications: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Certifications (optionnel)" />
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Photo du commerce/stock (obligatoire)</label>
                  <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'seller')} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
                </div>
              </div>
            )}
            {role === 'owner' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={ownerForm.contact} onChange={(e) => setOwnerForm((v) => ({ ...v, contact: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Contact (téléphone)" />
                <input value={ownerForm.localisation} onChange={(e) => setOwnerForm((v) => ({ ...v, localisation: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Localisation" />
                <input value={ownerForm.regionService} onChange={(e) => setOwnerForm((v) => ({ ...v, regionService: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Région d'opération" />
                <input value={ownerForm.machinesDisponibles} onChange={(e) => setOwnerForm((v) => ({ ...v, machinesDisponibles: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Machines disponibles" />
                <input value={ownerForm.tarifHoraireMoyen} onChange={(e) => setOwnerForm((v) => ({ ...v, tarifHoraireMoyen: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Tarif horaire moyen (€/h)" />
                <input value={ownerForm.certifications} onChange={(e) => setOwnerForm((v) => ({ ...v, certifications: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Certifications (optionnel)" />
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Photo du parc machines (obligatoire)</label>
                  <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'owner')} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
                </div>
              </div>
            )}
            {role === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input value={adminForm.contact} onChange={(e) => setAdminForm((v) => ({ ...v, contact: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Contact (téléphone)" />
                <input value={adminForm.localisation} onChange={(e) => setAdminForm((v) => ({ ...v, localisation: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Localisation" />
                <input value={adminForm.departement} onChange={(e) => setAdminForm((v) => ({ ...v, departement: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Département" />
              </div>
            )}
            <button
              disabled={isSubmitting}
              className="w-full bg-[#1B5E20] text-white py-4 rounded-xl font-bold hover:bg-[#1B5E20]/90 transition-colors shadow-lg shadow-green-900/10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Spinner className="text-white" />}
              Commencer
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">Vous avez déjà un compte ? <Link to="/login" className="text-[#1B5E20] font-bold">Se connecter</Link></p>
        </div>
      </div>
    </div>
  );
};
