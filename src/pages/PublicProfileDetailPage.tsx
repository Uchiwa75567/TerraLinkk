import React from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { getPublicProfileById, roleLabel } from "../lib/publicProfiles";

const PublicProfileDetailPage: React.FC = () => {
  const { id } = useParams();
  const profile = id ? getPublicProfileById(id) : undefined;

  if (!profile || profile.role === "admin") {
    return (
      <div className="min-h-screen bg-[#F5F5F0]">
        <Navbar />
        <div className="pt-28 max-w-3xl mx-auto px-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Profil introuvable</h1>
            <Link to="/profils" className="text-[#1B5E20] font-bold mt-3 inline-block">
              Retour à l'annuaire
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const cover =
    profile.profile?.photoExploitation ||
    profile.profile?.photoCommerce ||
    profile.profile?.photoParc ||
    profile.avatar;

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <img src={cover} className="w-full h-72 object-cover" />
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <img src={profile.avatar} className="w-16 h-16 rounded-full object-cover border border-slate-200" />
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
                  <p className="text-slate-500">{roleLabel(profile.role)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-semibold text-slate-800">{profile.email}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-500">Contact</p>
                  <p className="font-semibold text-slate-800">{profile.profile?.contact || "Non renseigné"}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-500">Localisation</p>
                  <p className="font-semibold text-slate-800">{profile.profile?.localisation || "Non renseignée"}</p>
                </div>

                {profile.role === "farmer" && (
                  <>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500">Cultures principales</p>
                      <p className="font-semibold text-slate-800">{profile.profile?.culturesPrincipales || "-"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500">Taille exploitation</p>
                      <p className="font-semibold text-slate-800">{profile.profile?.tailleExploitation || "-"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500">Nombre d'employés</p>
                      <p className="font-semibold text-slate-800">{profile.profile?.nombreEmployes || "-"}</p>
                    </div>
                  </>
                )}

                {profile.role === "seller" && (
                  <>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500">Entreprise</p>
                      <p className="font-semibold text-slate-800">{profile.profile?.entreprise || "-"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500">Produits</p>
                      <p className="font-semibold text-slate-800">{profile.profile?.categoriesProduits || "-"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500">Capacité stock</p>
                      <p className="font-semibold text-slate-800">{profile.profile?.capaciteStock || "-"}</p>
                    </div>
                  </>
                )}

                {profile.role === "owner" && (
                  <>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500">Région de service</p>
                      <p className="font-semibold text-slate-800">{profile.profile?.regionService || "-"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500">Machines disponibles</p>
                      <p className="font-semibold text-slate-800">{profile.profile?.machinesDisponibles || "-"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500">Tarif horaire</p>
                      <p className="font-semibold text-slate-800">{profile.profile?.tarifHoraireMoyen || "-"}</p>
                    </div>
                  </>
                )}

              </div>

              <div className="mt-6">
                <p className="text-xs text-slate-500">Certifications</p>
                <p className="font-semibold text-slate-800">{profile.profile?.certifications || "Non renseignées"}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/profils" className="text-[#1B5E20] font-bold">
              ← Retour à l'annuaire
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PublicProfileDetailPage;
