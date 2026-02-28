import React, { useEffect, useMemo, useRef, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Tractor, Calendar, Plus, MoreVertical, TrendingUp, Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import {
  createListing,
  listApprovedAnnouncements,
  listOwnerListings,
  listProviderRequests,
  updateRequestStatus,
} from "../lib/marketplace";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";

const DEFAULT_TRACTOR_IMAGE =
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/456b8acf-79dd-41b0-a081-885aa8a51798/tractor-rental-cd75fcfa-1772288681160.webp";

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentSection = searchParams.get("section") || "aperçu";
  const [refreshToken, setRefreshToken] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const topRef = useRef<HTMLDivElement | null>(null);
  const fleetRef = useRef<HTMLDivElement | null>(null);
  const rentalsRef = useRef<HTMLDivElement | null>(null);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    price: "",
    location: "",
    img: "",
  });

  const equipment = useMemo(
    () => (user ? listOwnerListings(user.id, "tracteur") : []),
    [user?.id, refreshToken],
  );
  const requests = useMemo(
    () => (user ? listProviderRequests(user.id, "tracteur") : []),
    [user?.id, refreshToken],
  );
  const approvedAnnouncements = useMemo(
    () => listApprovedAnnouncements().slice(0, 6),
    [refreshToken],
  );

  const handleAddEquipment = () => {
    if (!user) return;
    if (!newEquipment.name || !newEquipment.price || !newEquipment.location || !newEquipment.img) {
      toast.error("Complète les champs requis.");
      return;
    }
    createListing({
      type: "tracteur",
      name: newEquipment.name,
      price: newEquipment.price,
      location: newEquipment.location,
      img: newEquipment.img || DEFAULT_TRACTOR_IMAGE,
      ownerId: user.id,
      ownerName: user.name,
    });
    setRefreshToken((v) => v + 1);
    setShowForm(false);
    setNewEquipment({ name: "", price: "", location: "", img: "" });
    toast.success("Équipement ajouté. En attente de validation admin.");
  };

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleEquipmentPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setNewEquipment((v) => ({ ...v, img: dataUrl }));
  };

  const handleRequestStatus = (requestId: string, status: "approved" | "rejected") => {
    updateRequestStatus(requestId, status);
    setRefreshToken((v) => v + 1);
    toast.success(status === "approved" ? "Demande approuvée" : "Demande refusée");
  };

  useEffect(() => {
    const section = searchParams.get("section");
    if (section === "fleet") {
      setTimeout(() => fleetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return;
    }
    if (section === "rentals") {
      setTimeout(() => rentalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return;
    }
    if (section === "aperçu") {
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  }, [searchParams]);

  return (
    <DashboardLayout>
      <div className="space-y-8" ref={topRef}>
        <div className="relative overflow-hidden rounded-[2rem] p-8 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=1400')",
            }}
          />
          <div className="absolute inset-0 bg-[#1B5E20]/55" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-2xl font-bold text-white">Ma Flotte d'Équipement</h1>
            <p className="text-slate-100">Suivez et gérez votre machinerie agricole.</p>
          </div>
        </div>

        {currentSection !== "rentals" && (
          <div className="flex justify-end items-center">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="bg-[#1B5E20] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> {showForm ? "Fermer" : "Ajouter un Équipement"}
            </button>
          </div>
        )}

        {showForm && (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              value={newEquipment.name}
              onChange={(e) => setNewEquipment((v) => ({ ...v, name: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2"
              placeholder="Nom de l'équipement"
            />
            <input
              value={newEquipment.price}
              onChange={(e) => setNewEquipment((v) => ({ ...v, price: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2"
              placeholder="Prix (ex: 95€/jour)"
            />
            <input
              value={newEquipment.location}
              onChange={(e) => setNewEquipment((v) => ({ ...v, location: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2"
              placeholder="Localisation"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleEquipmentPhotoUpload}
              className="border border-slate-200 rounded-xl px-3 py-2 md:col-span-2"
            />
            <button
              onClick={handleAddEquipment}
              className="bg-[#1B5E20] text-white rounded-xl px-3 py-2 font-bold"
            >
              Publier
            </button>
            {newEquipment.img && (
              <img src={newEquipment.img} className="h-16 w-24 object-cover rounded-lg border border-slate-200" />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{equipment.length}</p>
              <p className="text-xs text-slate-500 font-medium">Équipements publiés</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {requests.filter((r) => r.status === "pending").length}
              </p>
              <p className="text-xs text-slate-500 font-medium">Demandes en attente</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {requests.filter((r) => r.status === "approved").length * 80}€
              </p>
              <p className="text-xs text-slate-500 font-medium">Gains estimés</p>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 ${
            currentSection === "aperçu" ? "lg:grid-cols-3" : "lg:grid-cols-1"
          } gap-8`}
        >
          {currentSection !== "rentals" && (
            <div
              ref={fleetRef}
              className={currentSection === "aperçu" ? "lg:col-span-2 space-y-4" : "space-y-4"}
            >
            <h3 className="font-bold text-slate-900 px-1">Mon Matériel</h3>
            {equipment.map((e) => (
              <div
                key={e.id}
                className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden">
                    <img src={e.img} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{e.name}</h4>
                    <p className="text-[10px] text-slate-400">{e.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-3 py-1 rounded-full",
                      e.status === "approved" && "bg-green-100 text-green-700",
                      e.status === "pending" && "bg-orange-100 text-orange-700",
                      e.status === "rejected" && "bg-red-100 text-red-700",
                    )}
                  >
                    {e.status === "approved"
                      ? "Disponible"
                      : e.status === "pending"
                        ? "En attente"
                        : "Refusé"}
                  </span>
                  <button className="p-2 text-slate-400 hover:text-slate-900">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {equipment.length === 0 && (
              <p className="text-sm text-slate-500 px-1">Aucun équipement pour le moment.</p>
            )}
          </div>
          )}

          {currentSection !== "fleet" && (
            <div ref={rentalsRef} className="bg-white rounded-[2rem] border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-6">Demandes de Location</h3>
            <div className="space-y-4">
              {requests.slice(0, 8).map((r) => (
                <div key={r.id} className="space-y-3 border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full" />
                    <div>
                      <p className="text-sm font-bold">{r.farmerName}</p>
                      <p className="text-[10px] text-slate-500">{r.listingName}</p>
                    </div>
                  </div>
                  {r.status === "pending" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleRequestStatus(r.id, "approved")}
                        className="bg-[#1B5E20] text-white py-2 rounded-lg text-xs font-bold flex justify-center"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRequestStatus(r.id, "rejected")}
                        className="bg-slate-100 text-slate-600 py-2 rounded-lg text-xs font-bold flex justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full",
                        r.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                      )}
                    >
                      {r.status === "approved" ? "Approuvée" : "Refusée"}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {requests.length === 0 && (
              <p className="text-sm text-slate-500 mt-2">Aucune demande de location.</p>
            )}
          </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Annonces validées de la plateforme</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {approvedAnnouncements.map((item) => (
              <div key={`${item.source}-${item.id}`} className="border border-slate-100 rounded-xl overflow-hidden">
                <img src={item.image} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-500">
                    {item.source === "farmer_notice" ? "Annonce agriculteur" : "Équipement propriétaire"}
                  </p>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.authorName} • {item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
