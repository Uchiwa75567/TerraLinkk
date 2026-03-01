import dbSeed from "../data/app-db.json";

const DB_STORAGE_KEY = "terra_db_v2";
const REMOTE_DB_API_URL = (import.meta.env.VITE_DB_API_URL || "").trim().replace(/\/$/, "");
const DEFAULT_ADMIN_ID = "usr_admin_terralink_com";
const DEFAULT_ADMIN = {
  id: DEFAULT_ADMIN_ID,
  name: "Admin TerraLink",
  email: "admin@terralink.com",
  role: "admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin@terralink.com",
  profile: {
    contact: "+221700000000",
    localisation: "Dakar, Sénégal",
    departement: "Administration",
  },
  passwordHash: "e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7",
  createdAt: "2026-02-28T00:00:00.000Z",
  updatedAt: "2026-02-28T00:00:00.000Z",
};

export interface AppDbShape {
  users: Record<string, any>;
  marketplace: {
    listings: any[];
    requests: any[];
    farmerNotices: any[];
  };
}

const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const STORAGE_QUOTA_MESSAGE =
  "Stockage local saturé. Reduisez la taille/le nombre d'images ou utilisez un vrai backend de stockage.";

const isQuotaExceededError = (error: unknown): boolean => {
  if (!(error instanceof DOMException)) return false;
  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error.code === 22 ||
    error.code === 1014
  );
};

const setStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    if (isQuotaExceededError(error)) {
      throw new Error(STORAGE_QUOTA_MESSAGE);
    }
    throw error;
  }
};

const hasRemoteDbApi = () => REMOTE_DB_API_URL.length > 0;
const getRemoteDbEndpoint = () => `${REMOTE_DB_API_URL}/api/db`;
const isValidDbShape = (value: unknown): value is AppDbShape => {
  if (!value || typeof value !== "object") return false;
  const db = value as AppDbShape;
  return !!(
    db.users &&
    db.marketplace &&
    Array.isArray(db.marketplace.listings) &&
    Array.isArray(db.marketplace.requests) &&
    Array.isArray(db.marketplace.farmerNotices)
  );
};

const withDefaultAdmin = (db: AppDbShape): AppDbShape => {
  if (!db.users[DEFAULT_ADMIN_ID]) {
    db.users[DEFAULT_ADMIN_ID] = DEFAULT_ADMIN;
  }
  if (!db.marketplace.farmerNotices) {
    db.marketplace.farmerNotices = [];
  }
  return db;
};

const ensureDb = (): AppDbShape => {
  const raw = localStorage.getItem(DB_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as AppDbShape;
      if (isValidDbShape(parsed)) {
        const normalized = withDefaultAdmin(parsed);
        setStorage(DB_STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    } catch {
      // fallback seed
    }
  }
  const seeded = withDefaultAdmin(deepClone(dbSeed as AppDbShape));
  setStorage(DB_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

export const loadDb = (): AppDbShape => ensureDb();

export const saveDb = (db: AppDbShape): void => {
  setStorage(DB_STORAGE_KEY, JSON.stringify(db));
  enqueueRemoteSave(db);
};

const fetchRemoteDb = async (): Promise<AppDbShape | null> => {
  if (!hasRemoteDbApi()) return null;
  const response = await fetch(getRemoteDbEndpoint(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as unknown;
  if (!isValidDbShape(payload)) return null;
  return withDefaultAdmin(payload);
};

const pushDbToRemote = async (db: AppDbShape): Promise<void> => {
  if (!hasRemoteDbApi()) return;
  const response = await fetch(getRemoteDbEndpoint(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(db),
  });
  if (!response.ok) {
    throw new Error(`Echec de sync distante (${response.status})`);
  }
};

let remoteWriteQueue: Promise<void> = Promise.resolve();
const enqueueRemoteSave = (db: AppDbShape): void => {
  if (!hasRemoteDbApi()) return;
  const snapshot = deepClone(db);
  remoteWriteQueue = remoteWriteQueue
    .then(() => pushDbToRemote(snapshot))
    .catch(() => {
      // Ignore transient network issues; local storage remains source of truth for UX.
    });
};

export const syncDbWithRemote = async (): Promise<void> => {
  if (!hasRemoteDbApi()) return;
  try {
    const remoteDb = await fetchRemoteDb();
    if (remoteDb) {
      setStorage(DB_STORAGE_KEY, JSON.stringify(remoteDb));
      return;
    }
    // If remote is empty/unavailable but API exists, push local DB once.
    const localDb = ensureDb();
    await pushDbToRemote(localDb);
  } catch {
    // Keep app usable with local cache if network/API is down.
  }
};

export const loadUsersFromDb = (): Record<string, any> => loadDb().users;

export const saveUsersToDb = (users: Record<string, any>): void => {
  const db = loadDb();
  db.users = users;
  saveDb(db);
};

export const loadMarketplaceFromDb = (): AppDbShape["marketplace"] => loadDb().marketplace;

export const saveMarketplaceToDb = (marketplace: AppDbShape["marketplace"]): void => {
  const db = loadDb();
  db.marketplace = marketplace;
  saveDb(db);
};
