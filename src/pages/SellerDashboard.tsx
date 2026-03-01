import React, { useEffect, useMemo, useRef, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Plus, Package, TrendingUp, Bell, Check, Users, X } from "lucide-react";
import { toast } from "sonner";
import {
  createListing,
  listApprovedAnnouncements,
  listOwnerListings,
  listProviderRequests,
  updateRequestStatus,
} from "../lib/marketplace";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { Spinner } from "../components/ui/spinner";

const DEFAULT_SEED_IMAGE =
  "https://storage.googleapis.com/dala-prod-public-storage/generated-images/456b8acf-79dd-41b0-a081-885aa8a51798/seed-warehouse-0d49e033-1772288681575.webp";

export const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentSection = searchParams.get("section") || "aperçu";
  const [refreshToken, setRefreshToken] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isPublishingProduct, setIsPublishingProduct] = useState(false);
  const [pendingOrderIds, setPendingOrderIds] = useState<Record<string, boolean>>({});
  const topRef = useRef<HTMLDivElement | null>(null);
  const productsRef = useRef<HTMLDivElement | null>(null);
  const salesRef = useRef<HTMLDivElement | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    location: "",
    stock: "10",
    img: "",
  });

  const products = useMemo(
    () => (user ? listOwnerListings(user.id, "semence") : []),
    [user?.id, refreshToken],
  );
  const orders = useMemo(
    () => (user ? listProviderRequests(user.id, "semence") : []),
    [user?.id, refreshToken],
  );
  const approvedAnnouncements = useMemo(
    () => listApprovedAnnouncements().slice(0, 6),
    [refreshToken],
  );

  const stats = [
    {
      label: "Revenu estimé",
      value: `${orders.filter((o) => o.status === "approved").length * 40}€`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-green-500",
    },
    {
      label: "Annonces actives",
      value: `${products.filter((p) => p.status === "approved").length}`,
      icon: <Package className="w-5 h-5" />,
      color: "bg-blue-500",
    },
    {
      label: "Commandes en attente",
      value: `${orders.filter((o) => o.status === "pending").length}`,
      icon: <Bell className="w-5 h-5" />,
      color: "bg-orange-500",
    },
  ];

  const resetForm = () =>
    setNewProduct({
      name: "",
      price: "",
      location: "",
      stock: "10",
      img: "",
    });

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleProductPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setNewProduct((v) => ({ ...v, img: dataUrl }));
  };

  const handleAddProduct = () => {
    if (!user) return;
    if (isPublishingProduct) return;
    if (!newProduct.name || !newProduct.price || !newProduct.location || !newProduct.img) {
      toast.error("Complète les champs requis.");
      return;
    }
    setIsPublishingProduct(true);
    try {
      createListing({
        type: "semence",
        name: newProduct.name,
        price: newProduct.price,
        location: newProduct.location,
        img: newProduct.img || DEFAULT_SEED_IMAGE,
        stock: Number(newProduct.stock || "0"),
        ownerId: user.id,
        ownerName: user.name,
      });
      setRefreshToken((v) => v + 1);
      setShowForm(false);
      resetForm();
      toast.success("Produit ajouté. En attente de validation admin.");
    } finally {
      setIsPublishingProduct(false);
    }
  };

  const handleOrderStatus = (requestId: string, status: "approved" | "rejected") => {
    if (pendingOrderIds[requestId]) return;
    setPendingOrderIds((v) => ({ ...v, [requestId]: true }));
    try {
      updateRequestStatus(requestId, status);
      setRefreshToken((v) => v + 1);
      toast.success(status === "approved" ? "Commande approuvée" : "Commande rejetée");
    } finally {
      setPendingOrderIds((v) => ({ ...v, [requestId]: false }));
    }
  };

  useEffect(() => {
    const section = searchParams.get("section");
    if (section === "products") {
      setTimeout(() => productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return;
    }
    if (section === "sales") {
      setTimeout(() => salesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
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
                "url('https://images.pexels.com/photos/7728083/pexels-photo-7728083.jpeg?auto=compress&cs=tinysrgb&w=1400')",
            }}
          />
          <div className="absolute inset-0 bg-slate-900/45" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-2xl font-bold text-white">Tableau de Bord Vendeur</h1>
            <p className="text-slate-100">Gérez votre inventaire et vos performances de vente.</p>
          </div>
        </div>

        {currentSection !== "sales" && (
          <div className="flex justify-end items-center">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="bg-[#1B5E20] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1B5E20]/90 transition-all"
            >
              <Plus className="w-5 h-5" /> {showForm ? "Fermer" : "Ajouter un Produit"}
            </button>
          </div>
        )}

        {showForm && (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              value={newProduct.name}
              onChange={(e) => setNewProduct((v) => ({ ...v, name: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2"
              placeholder="Nom du produit"
            />
            <input
              value={newProduct.price}
              onChange={(e) => setNewProduct((v) => ({ ...v, price: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2"
              placeholder="Prix (ex: 28€/sac)"
            />
            <input
              value={newProduct.location}
              onChange={(e) => setNewProduct((v) => ({ ...v, location: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2"
              placeholder="Localisation"
            />
            <input
              value={newProduct.stock}
              onChange={(e) => setNewProduct((v) => ({ ...v, stock: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2"
              placeholder="Stock"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProductPhotoUpload}
              className="border border-slate-200 rounded-xl px-3 py-2 md:col-span-2"
            />
            <button
              onClick={handleAddProduct}
              disabled={isPublishingProduct}
              className="bg-[#1B5E20] text-white rounded-xl px-3 py-2 font-bold disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2 justify-center"
            >
              {isPublishingProduct && <Spinner className="text-white" />}
              Publier
            </button>
            {newProduct.img && (
              <img src={newProduct.img} className="h-16 w-24 object-cover rounded-lg border border-slate-200" />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div
          className={`grid grid-cols-1 ${
            currentSection === "aperçu" ? "lg:grid-cols-2" : "lg:grid-cols-1"
          } gap-8`}
        >
          {currentSection !== "sales" && (
            <div ref={productsRef} className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Inventaire</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="px-6 py-4 font-bold">Produit</th>
                      <th className="px-6 py-4 font-bold">Stock</th>
                      <th className="px-6 py-4 font-bold">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="px-6 py-4 font-semibold text-slate-900">{p.name}</td>
                        <td className="px-6 py-4 text-slate-500">{p.stock ?? "-"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                              p.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : p.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {p.status === "approved"
                              ? "Actif"
                              : p.status === "rejected"
                                ? "Refusé"
                                : "En attente"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td className="px-6 py-4 text-slate-500" colSpan={3}>
                          Aucun produit pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentSection !== "products" && (
            <div ref={salesRef} className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Commandes Récentes</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {orders.slice(0, 8).map((o) => (
                  <div key={o.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{o.farmerName}</p>
                        <p className="text-[10px] text-slate-500">{o.listingName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      {o.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleOrderStatus(o.id, "approved")}
                            disabled={!!pendingOrderIds[o.id]}
                            className="p-1 bg-green-100 text-green-600 rounded disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-1"
                            title="Approuver"
                          >
                            {pendingOrderIds[o.id] && <Spinner className="text-green-600 size-3" />}
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOrderStatus(o.id, "rejected")}
                            disabled={!!pendingOrderIds[o.id]}
                            className="p-1 bg-red-100 text-red-600 rounded disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-1"
                            title="Rejeter"
                          >
                            {pendingOrderIds[o.id] && <Spinner className="text-red-600 size-3" />}
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        {o.status === "approved"
                          ? "Approuvée"
                          : o.status === "rejected"
                            ? "Rejetée"
                            : "En attente"}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="p-4 text-sm text-slate-500">Aucune commande reçue.</p>
                )}
              </div>
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
