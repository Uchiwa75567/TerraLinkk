import { loadMarketplaceFromDb, saveMarketplaceToDb } from "./db";

export type ListingType = "semence" | "tracteur";
export type ListingStatus = "pending" | "approved" | "rejected";
export type RequestStatus = "pending" | "approved" | "rejected";

export interface Listing {
  id: string;
  type: ListingType;
  name: string;
  price: string;
  location: string;
  rating: number;
  img: string;
  stock?: number;
  ownerId: string;
  ownerName: string;
  status: ListingStatus;
  createdAt: string;
}

export interface ResourceRequest {
  id: string;
  listingId: string;
  listingName: string;
  listingType: ListingType;
  farmerId: string;
  farmerName: string;
  providerId: string;
  providerName: string;
  status: RequestStatus;
  createdAt: string;
}

export interface FarmerNotice {
  id: string;
  farmerId: string;
  farmerName: string;
  title: string;
  details: string;
  location: string;
  mainCrop: string;
  farmPhoto: string;
  status: ListingStatus;
  createdAt: string;
}

export interface MarketplaceState {
  listings: Listing[];
  requests: ResourceRequest[];
  farmerNotices: FarmerNotice[];
}

export interface ApprovedAnnouncement {
  id: string;
  source: "farmer_notice" | "owner_listing";
  title: string;
  subtitle: string;
  location: string;
  image: string;
  authorName: string;
  createdAt: string;
}

export const loadMarketplace = (): MarketplaceState => {
  const state = loadMarketplaceFromDb() as MarketplaceState;
  if (!state.listings || !state.requests) return { listings: [], requests: [], farmerNotices: [] };
  if (!state.farmerNotices) {
    state.farmerNotices = [];
    saveMarketplaceToDb(state);
  }
  return state;
};

export const saveMarketplace = (state: MarketplaceState): void => {
  saveMarketplaceToDb(state);
};

export const listApprovedResources = (): Listing[] =>
  loadMarketplace().listings.filter((l) => l.status === "approved");

export const listApprovedAnnouncements = (): ApprovedAnnouncement[] => {
  const state = loadMarketplace();
  const approvedFarmerNotices: ApprovedAnnouncement[] = state.farmerNotices
    .filter((n) => n.status === "approved")
    .map((n) => ({
      id: n.id,
      source: "farmer_notice",
      title: n.title,
      subtitle: `Besoin: ${n.mainCrop}`,
      location: n.location,
      image: n.farmPhoto,
      authorName: n.farmerName,
      createdAt: n.createdAt,
    }));

  const approvedOwnerListings: ApprovedAnnouncement[] = state.listings
    .filter((l) => l.status === "approved" && l.type === "tracteur")
    .map((l) => ({
      id: l.id,
      source: "owner_listing",
      title: l.name,
      subtitle: `Tarif: ${l.price}`,
      location: l.location,
      image: l.img,
      authorName: l.ownerName,
      createdAt: l.createdAt,
    }));

  return [...approvedFarmerNotices, ...approvedOwnerListings].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
};

export const listOwnerListings = (ownerId: string, type?: ListingType): Listing[] => {
  const state = loadMarketplace();
  return state.listings.filter((l) => l.ownerId === ownerId && (!type || l.type === type));
};

export const listProviderRequests = (providerId: string, type?: ListingType): ResourceRequest[] => {
  const state = loadMarketplace();
  return state.requests.filter(
    (r) => r.providerId === providerId && (!type || r.listingType === type),
  );
};

export const listFarmerRequests = (farmerId: string): ResourceRequest[] => {
  const state = loadMarketplace();
  return state.requests.filter((r) => r.farmerId === farmerId);
};

export const createListing = (input: Omit<Listing, "id" | "createdAt" | "status" | "rating">): Listing => {
  const state = loadMarketplace();
  const listing: Listing = {
    ...input,
    id: `lst-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    rating: 4.5,
  };
  state.listings.unshift(listing);
  saveMarketplace(state);
  return listing;
};

export const createRequest = (input: Omit<ResourceRequest, "id" | "createdAt" | "status">): ResourceRequest => {
  const state = loadMarketplace();
  const request: ResourceRequest = {
    ...input,
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  state.requests.unshift(request);
  saveMarketplace(state);
  return request;
};

export const updateRequestStatus = (requestId: string, status: RequestStatus): void => {
  const state = loadMarketplace();
  state.requests = state.requests.map((r) => (r.id === requestId ? { ...r, status } : r));
  saveMarketplace(state);
};

export const updateListingStatus = (listingId: string, status: ListingStatus): void => {
  const state = loadMarketplace();
  state.listings = state.listings.map((l) => (l.id === listingId ? { ...l, status } : l));
  saveMarketplace(state);
};

export const getMarketplaceStats = () => {
  const state = loadMarketplace();
  return {
    usersApprox: 4829,
    listingsTotal: state.listings.length,
    listingsPending: state.listings.filter((l) => l.status === "pending").length,
    requestsTotal: state.requests.length,
    farmerNoticesPending: state.farmerNotices.filter((n) => n.status === "pending").length,
  };
};

export const listFarmerNotices = (farmerId?: string): FarmerNotice[] => {
  const state = loadMarketplace();
  if (!farmerId) return state.farmerNotices;
  return state.farmerNotices.filter((n) => n.farmerId === farmerId);
};

export const createFarmerNotice = (
  input: Omit<FarmerNotice, "id" | "createdAt" | "status">,
): FarmerNotice => {
  const state = loadMarketplace();
  const notice: FarmerNotice = {
    ...input,
    id: `notice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  state.farmerNotices.unshift(notice);
  saveMarketplace(state);
  return notice;
};

export const updateFarmerNoticeStatus = (noticeId: string, status: ListingStatus): void => {
  const state = loadMarketplace();
  state.farmerNotices = state.farmerNotices.map((n) =>
    n.id === noticeId ? { ...n, status } : n,
  );
  saveMarketplace(state);
};
