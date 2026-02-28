import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { getPublicProfiles, roleLabel } from "../lib/publicProfiles";
import { Search } from "lucide-react";

const PublicProfilesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "farmer" | "seller" | "owner">(
    "all",
  );
  const profiles = getPublicProfiles().filter((p) => p.role !== "admin");

  const filtered = useMemo(
    () =>
      profiles.filter(
        (p) =>
          (roleFilter === "all" || p.role === roleFilter) &&
          (p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.profile?.localisation?.toLowerCase().includes(search.toLowerCase())),
      ),
    [profiles, roleFilter, search],
  );

  const coverPhoto = (p: (typeof profiles)[number]) =>
    p.profile?.photoExploitation || p.profile?.photoCommerce || p.profile?.photoParc || p.avatar;

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900">Annuaire des Acteurs Agricoles</h1>
            <p className="text-slate-600 mt-3">
              Explorez les profils agriculteurs, vendeurs, propriétaires et administrateurs.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un nom ou une localisation..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white outline-none"
              />
            </div>
            <div className="flex gap-2">
              {[
                { id: "all", label: "Tous" },
                { id: "farmer", label: "Agriculteurs" },
                { id: "seller", label: "Vendeurs" },
                { id: "owner", label: "Propriétaires" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setRoleFilter(f.id as typeof roleFilter)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                    roleFilter === f.id
                      ? "bg-[#1B5E20] text-white border-[#1B5E20]"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <Link
                to={`/profils/${p.id}`}
                key={p.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all"
              >
                <img src={coverPhoto(p)} className="w-full h-44 object-cover" />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={p.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-500">{roleLabel(p.role)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    {p.profile?.localisation || "Localisation non renseignée"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PublicProfilesPage;
