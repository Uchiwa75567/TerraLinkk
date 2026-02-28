import type { UserRole } from "../context/AuthContext";
import { loadUsersFromDb } from "./db";

export interface PublicProfileUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profile?: Record<string, string | undefined>;
}

const demoUsers: PublicProfileUser[] = [
  {
    id: "demo_farmer_1",
    name: "Mamadou Ndiaye",
    email: "mamadou.farmer@terralink.demo",
    role: "farmer",
    avatar:
      "https://images.pexels.com/photos/2382904/pexels-photo-2382904.jpeg?auto=compress&cs=tinysrgb&w=600",
    profile: {
      contact: "+221 77 100 20 30",
      localisation: "Thiès, Sénégal",
      culturesPrincipales: "Mil, arachide",
      tailleExploitation: "18 ha",
      nombreEmployes: "9",
      certifications: "Agriculture durable locale",
      photoExploitation:
        "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
  },
  {
    id: "demo_seller_1",
    name: "Awa Seeds Market",
    email: "awa.seller@terralink.demo",
    role: "seller",
    avatar:
      "https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=600",
    profile: {
      contact: "+221 76 220 10 11",
      localisation: "Kaolack, Sénégal",
      entreprise: "Awa Agro Distribution",
      categoriesProduits: "Semences maïs, sorgho, niébé",
      capaciteStock: "1200 sacs",
      certifications: "ISO semences régionales",
      photoCommerce:
        "https://storage.googleapis.com/dala-prod-public-storage/generated-images/456b8acf-79dd-41b0-a081-885aa8a51798/seed-warehouse-0d49e033-1772288681575.webp",
    },
  },
  {
    id: "demo_owner_1",
    name: "Cheikh Rentals",
    email: "cheikh.owner@terralink.demo",
    role: "owner",
    avatar:
      "https://images.pexels.com/photos/1268122/pexels-photo-1268122.jpeg?auto=compress&cs=tinysrgb&w=600",
    profile: {
      contact: "+221 78 450 00 12",
      localisation: "Saint-Louis, Sénégal",
      regionService: "Nord et vallée du fleuve",
      machinesDisponibles: "3 tracteurs, 2 remorques",
      tarifHoraireMoyen: "35€/h",
      certifications: "Maintenance certifiée",
      photoParc:
        "https://storage.googleapis.com/dala-prod-public-storage/generated-images/456b8acf-79dd-41b0-a081-885aa8a51798/tractor-rental-cd75fcfa-1772288681160.webp",
    },
  },
];

const usersFromDb = (): PublicProfileUser[] =>
  Object.values(loadUsersFromDb() as Record<string, PublicProfileUser>).filter(
    (u) => !!u?.id && !!u?.role,
  );

export const getPublicProfiles = (): PublicProfileUser[] => {
  if (typeof window === "undefined") return demoUsers;
  const fromStorage = usersFromDb();
  const map = new Map<string, PublicProfileUser>();
  [...demoUsers, ...fromStorage].forEach((u) => map.set(u.id, u));
  return Array.from(map.values()).filter((u) => u.role !== null);
};

export const getPublicProfileById = (id: string): PublicProfileUser | undefined =>
  getPublicProfiles().find((u) => u.id === id);

export const roleLabel = (role: UserRole): string => {
  if (role === "farmer") return "Agriculteur";
  if (role === "seller") return "Vendeur";
  if (role === "owner") return "Propriétaire";
  if (role === "admin") return "Admin";
  return "Utilisateur";
};
