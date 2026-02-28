import dbSeed from "../data/app-db.json";

const DB_STORAGE_KEY = "terra_db_v2";
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

const ensureDb = (): AppDbShape => {
  const raw = localStorage.getItem(DB_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as AppDbShape;
      if (parsed.users && parsed.marketplace) {
        // Migration safeguard: always ensure default admin account exists.
        if (!parsed.users[DEFAULT_ADMIN_ID]) {
          parsed.users[DEFAULT_ADMIN_ID] = DEFAULT_ADMIN;
          localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch {
      // fallback seed
    }
  }
  const seeded = deepClone(dbSeed as AppDbShape);
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

export const loadDb = (): AppDbShape => ensureDb();

export const saveDb = (db: AppDbShape): void => {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
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
