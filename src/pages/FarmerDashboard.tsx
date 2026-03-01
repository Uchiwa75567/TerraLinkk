import React, { useEffect, useMemo, useRef, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Search, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import { createRequest, listApprovedResources, listFarmerRequests } from "../lib/marketplace";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { createFarmerNotice, listFarmerNotices } from "../lib/marketplace";
import { listApprovedAnnouncements } from "../lib/marketplace";
import { Spinner } from "../components/ui/spinner";
import { optimizeImageFileToDataUrl } from "../lib/image";

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"tous" | "semence" | "tracteur">("tous");
  const [resources, setResources] = useState(listApprovedResources());
  const [myRequests, setMyRequests] = useState(user ? listFarmerRequests(user.id) : []);
  const [myNotices, setMyNotices] = useState(user ? listFarmerNotices(user.id) : []);
  const [isCreatingNotice, setIsCreatingNotice] = useState(false);
  const [pendingRequestIds, setPendingRequestIds] = useState<Record<string, boolean>>({});
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    details: "",
    location: "",
    mainCrop: "",
    farmPhoto: "",
  });
  const ordersRef = useRef<HTMLDivElement | null>(null);
  const knownApprovedNoticeIdsRef = useRef<Set<string>>(new Set());
  const farmerNotifKey = user ? `terra_notified_farmer_notices_${user.id}` : "";

  const refreshData = () => {
    setResources(listApprovedResources());
    if (user) {
      setMyRequests(listFarmerRequests(user.id));
      setMyNotices(listFarmerNotices(user.id));
    }
  };

  useEffect(() => {
    refreshData();
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;

    const initKnownApproved = () => {
      const currentApprovedIds = listFarmerNotices(user.id)
        .filter((n) => n.status === "approved")
        .map((n) => n.id);
      const saved = localStorage.getItem(farmerNotifKey);
      if (!saved) {
        localStorage.setItem(farmerNotifKey, JSON.stringify(currentApprovedIds));
        knownApprovedNoticeIdsRef.current = new Set(currentApprovedIds);
        return;
      }
      try {
        const parsed = JSON.parse(saved) as string[];
        knownApprovedNoticeIdsRef.current = new Set(parsed);
      } catch {
        knownApprovedNoticeIdsRef.current = new Set(currentApprovedIds);
        localStorage.setItem(farmerNotifKey, JSON.stringify(currentApprovedIds));
      }
    };

    initKnownApproved();

    const watchApprovals = () => {
      const latestNotices = listFarmerNotices(user.id);
      setMyNotices(latestNotices);
      setResources(listApprovedResources());
      setMyRequests(listFarmerRequests(user.id));

      const latestApproved = latestNotices.filter((n) => n.status === "approved");
      const known = knownApprovedNoticeIdsRef.current;
      const newlyApproved = latestApproved.filter((n) => !known.has(n.id));
      if (newlyApproved.length > 0) {
        newlyApproved.forEach((notice) => {
          toast.success(`Votre annonce "${notice.title}" a ete validee par l'administrateur.`);
          known.add(notice.id);
        });
        localStorage.setItem(farmerNotifKey, JSON.stringify(Array.from(known)));
      }
    };

    const interval = window.setInterval(watchApprovals, 5000);
    return () => window.clearInterval(interval);
  }, [user, farmerNotifKey]);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section === "seeds") setFilter("semence");
    if (section === "tractors") setFilter("tracteur");
    if (section === "aperçu") setFilter("tous");
    if (section === "orders") {
      setFilter("tous");
      setTimeout(() => ordersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  }, [searchParams]);

  const filtered = useMemo(
    () =>
      resources.filter(
        (r) =>
          (filter === "tous" || r.type === filter) &&
          r.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [resources, filter, search],
  );
  const approvedAnnouncements = useMemo(
    () => listApprovedAnnouncements().slice(0, 6),
    [resources, myNotices, myRequests],
  );

  const handleAction = (listingId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté.");
      return;
    }
    if (pendingRequestIds[listingId]) return;

    const listing = resources.find((item) => item.id === listingId);
    if (!listing) return;

    setPendingRequestIds((v) => ({ ...v, [listingId]: true }));
    try {
      createRequest({
        listingId: listing.id,
        listingName: listing.name,
        listingType: listing.type,
        farmerId: user.id,
        farmerName: user.name,
        providerId: listing.ownerId,
        providerName: listing.ownerName,
      });

      refreshData();
      toast.success(`Demande envoyée pour ${listing.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible d'envoyer la demande.");
    } finally {
      setPendingRequestIds((v) => ({ ...v, [listingId]: false }));
    }
  };

  const handleNoticePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await optimizeImageFileToDataUrl(file, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.72,
      });
      setNoticeForm((v) => ({ ...v, farmPhoto: dataUrl }));
    } catch {
      toast.error("Impossible de traiter l'image.");
    }
  };

  const handleCreateNotice = () => {
    if (!user) return;
    if (isCreatingNotice) return;
    if (
      !noticeForm.title ||
      !noticeForm.details ||
      !noticeForm.location ||
      !noticeForm.mainCrop ||
      !noticeForm.farmPhoto
    ) {
      toast.error("Complète tous les champs et ajoute une photo de l'exploitation.");
      return;
    }
    setIsCreatingNotice(true);
    try {
      createFarmerNotice({
        farmerId: user.id,
        farmerName: user.name,
        title: noticeForm.title,
        details: noticeForm.details,
        location: noticeForm.location,
        mainCrop: noticeForm.mainCrop,
        farmPhoto: noticeForm.farmPhoto,
      });
      setNoticeForm({ title: "", details: "", location: "", mainCrop: "", farmPhoto: "" });
      setShowNoticeForm(false);
      refreshData();
      toast.success("Annonce publiée, en attente de validation.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible de publier l'annonce.");
    } finally {
      setIsCreatingNotice(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="bg-[#1B5E20] rounded-[2rem] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2">Développez votre ferme plus rapidement</h1>
            <p className="text-slate-200">
              Recherchez les meilleures ressources dans votre région aujourd'hui.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none">
            <img
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/456b8acf-79dd-41b0-a081-885aa8a51798/farm-management-5cea4079-1772289441304.webp"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
            />
          </div>
          <div className="flex gap-2">
            {(["tous", "semence", "tracteur"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-3 rounded-xl font-bold text-sm capitalize border transition-all",
                  filter === f
                    ? "bg-white border-[#1B5E20] text-[#1B5E20]"
                    : "bg-white border-slate-200 text-slate-500",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Mes annonces d'exploitation</h3>
            <button
              onClick={() => setShowNoticeForm((v) => !v)}
              className="bg-[#1B5E20] text-white px-3 py-2 rounded-xl text-xs font-bold"
            >
              {showNoticeForm ? "Fermer" : "Publier une annonce"}
            </button>
          </div>
          {showNoticeForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                value={noticeForm.title}
                onChange={(e) => setNoticeForm((v) => ({ ...v, title: e.target.value }))}
                className="border border-slate-200 rounded-xl px-3 py-2"
                placeholder="Titre de l'annonce"
              />
              <input
                value={noticeForm.location}
                onChange={(e) => setNoticeForm((v) => ({ ...v, location: e.target.value }))}
                className="border border-slate-200 rounded-xl px-3 py-2"
                placeholder="Localisation"
              />
              <input
                value={noticeForm.mainCrop}
                onChange={(e) => setNoticeForm((v) => ({ ...v, mainCrop: e.target.value }))}
                className="border border-slate-200 rounded-xl px-3 py-2"
                placeholder="Culture principale"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleNoticePhotoUpload}
                className="border border-slate-200 rounded-xl px-3 py-2"
              />
              <textarea
                value={noticeForm.details}
                onChange={(e) => setNoticeForm((v) => ({ ...v, details: e.target.value }))}
                className="border border-slate-200 rounded-xl px-3 py-2 md:col-span-2 min-h-24"
                placeholder="Détails du besoin"
              />
              <button
                onClick={handleCreateNotice}
                disabled={isCreatingNotice}
                className="bg-[#1B5E20] text-white rounded-xl px-3 py-2 font-bold md:col-span-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingNotice && <Spinner className="text-white" />}
                Envoyer pour validation
              </button>
            </div>
          )}
          <div className="space-y-2">
            {myNotices.slice(0, 5).map((notice) => (
              <div key={notice.id} className="border border-slate-100 rounded-xl p-3 flex gap-3 items-center">
                <img src={notice.farmPhoto} className="w-14 h-14 rounded-lg object-cover border border-slate-200" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{notice.title}</p>
                  <p className="text-xs text-slate-500">{notice.location} • {notice.mainCrop}</p>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                  notice.status === "approved" && "bg-green-100 text-green-700",
                  notice.status === "pending" && "bg-orange-100 text-orange-700",
                  notice.status === "rejected" && "bg-red-100 text-red-700",
                )}>
                  {notice.status === "approved" ? "Approuvée" : notice.status === "rejected" ? "Rejetée" : "En attente"}
                </span>
              </div>
            ))}
            {myNotices.length === 0 && (
              <p className="text-sm text-slate-500">Aucune annonce publiée.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all"
            >
              <div className="relative h-48">
                <img src={item.img} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold">{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs mb-4">
                  <MapPin className="w-3 h-3" /> {item.location}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-[#1B5E20] font-bold">{item.price}</p>
                  <button
                    onClick={() => handleAction(item.id)}
                    disabled={!!pendingRequestIds[item.id]}
                    className="bg-[#1B5E20] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1B5E20]/90 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {pendingRequestIds[item.id] && <Spinner className="text-white" />}
                    Demander
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div ref={ordersRef} className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Mes demandes récentes</h3>
          <div className="space-y-3">
            {myRequests.slice(0, 6).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{request.listingName}</p>
                  <p className="text-xs text-slate-500">Fournisseur: {request.providerName}</p>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-full uppercase",
                    request.status === "approved" && "bg-green-100 text-green-700",
                    request.status === "pending" && "bg-orange-100 text-orange-700",
                    request.status === "rejected" && "bg-red-100 text-red-700",
                  )}
                >
                  {request.status === "approved"
                    ? "Approuvée"
                    : request.status === "rejected"
                      ? "Rejetée"
                      : "En attente"}
                </span>
              </div>
            ))}
            {myRequests.length === 0 && (
              <p className="text-sm text-slate-500">Aucune demande pour le moment.</p>
            )}
          </div>
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
