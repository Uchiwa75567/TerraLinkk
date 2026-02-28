import React, { useEffect, useMemo, useRef, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Users, ShoppingCart, ShieldAlert, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
  getMarketplaceStats,
  listApprovedAnnouncements,
  loadMarketplace,
  updateFarmerNoticeStatus,
  updateListingStatus,
} from "../lib/marketplace";
import { useSearchParams } from "react-router-dom";

export const AdminDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentSection = searchParams.get("section") || "aperçu";
  const [refreshToken, setRefreshToken] = useState(0);
  const topRef = useRef<HTMLDivElement | null>(null);
  const usersRef = useRef<HTMLDivElement | null>(null);
  const moderationRef = useRef<HTMLDivElement | null>(null);

  const state = useMemo(() => loadMarketplace(), [refreshToken]);
  const statsData = useMemo(() => getMarketplaceStats(), [refreshToken]);
  const pendingListings = state.listings.filter((l) => l.status === "pending");
  const pendingFarmerNotices = state.farmerNotices.filter((n) => n.status === "pending");
  const approvedAnnouncements = useMemo(
    () => listApprovedAnnouncements().slice(0, 6),
    [refreshToken],
  );

  const stats = [
    {
      label: "Utilisateurs Totaux",
      value: `${statsData.usersApprox}`,
      icon: <Users className="w-5 h-5" />,
      color: "bg-blue-500",
    },
    {
      label: "Demandes Totales",
      value: `${statsData.requestsTotal}`,
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "bg-green-500",
    },
    {
      label: "Articles en attente",
      value: `${statsData.listingsPending + statsData.farmerNoticesPending}`,
      icon: <ShieldAlert className="w-5 h-5" />,
      color: "bg-orange-500",
    },
  ];

  const moderate = (listingId: string, action: "approved" | "rejected") => {
    updateListingStatus(listingId, action);
    setRefreshToken((v) => v + 1);
    toast.success(action === "approved" ? "Annonce approuvée" : "Annonce rejetée");
  };

  const moderateNotice = (noticeId: string, action: "approved" | "rejected") => {
    updateFarmerNoticeStatus(noticeId, action);
    setRefreshToken((v) => v + 1);
    toast.success(action === "approved" ? "Annonce agriculteur approuvée" : "Annonce agriculteur rejetée");
  };

  useEffect(() => {
    const section = searchParams.get("section");
    if (section === "users") {
      setTimeout(() => usersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return;
    }
    if (section === "moderation") {
      setTimeout(
        () => moderationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        60,
      );
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
                "url('https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1400')",
            }}
          />
          <div className="absolute inset-0 bg-slate-900/55" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-2xl font-bold text-white">Panneau d'Administration</h1>
            <p className="text-slate-100">Gestion du système et modération.</p>
          </div>
        </div>

        {currentSection !== "moderation" && (
          <div ref={usersRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100">
                <div className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4`}>
                  {s.icon}
                </div>
                <p className="text-slate-500 text-sm font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {currentSection !== "users" && (
          <div ref={moderationRef} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h3 className="font-bold text-slate-900">File de Modération</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingListings.map((listing) => (
              <div key={listing.id} className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{listing.name}</h4>
                  <p className="text-xs text-slate-500">
                    {listing.type === "semence" ? "Semence" : "Tracteur"} • {listing.ownerName} •{" "}
                    {listing.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moderate(listing.id, "approved")}
                    className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                    title="Approuver"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => moderate(listing.id, "rejected")}
                    className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    title="Rejeter"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {pendingFarmerNotices.map((notice) => (
              <div key={notice.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={notice.farmPhoto} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                  <div>
                    <h4 className="font-bold text-slate-900">{notice.title}</h4>
                    <p className="text-xs text-slate-500">
                      Besoin agriculteur • {notice.farmerName} • {notice.location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moderateNotice(notice.id, "approved")}
                    className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                    title="Approuver"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => moderateNotice(notice.id, "rejected")}
                    className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    title="Rejeter"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {pendingListings.length === 0 && pendingFarmerNotices.length === 0 && (
              <p className="p-6 text-sm text-slate-500">Aucun article en attente de validation.</p>
            )}
          </div>
        </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Annonces validées en ligne</h3>
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
