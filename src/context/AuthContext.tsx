import React, { createContext, useContext, useState } from 'react';
import { loadUsersFromDb, saveUsersToDb } from '../lib/db';

export type UserRole = 'farmer' | 'seller' | 'owner' | 'admin' | null;

export interface FarmerProfile {
  contact: string;
  localisation: string;
  culturesPrincipales: string;
  tailleExploitation: string;
  nombreEmployes: string;
  certifications: string;
  photoExploitation?: string;
}

export interface SellerProfile {
  contact: string;
  localisation: string;
  entreprise: string;
  categoriesProduits: string;
  capaciteStock: string;
  certifications: string;
  photoCommerce?: string;
}

export interface OwnerProfile {
  contact: string;
  localisation: string;
  regionService: string;
  machinesDisponibles: string;
  tarifHoraireMoyen: string;
  certifications: string;
  photoParc?: string;
}

export interface AdminProfile {
  contact: string;
  localisation: string;
  departement: string;
}

export type UserProfile = FarmerProfile | SellerProfile | OwnerProfile | AdminProfile;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profile?: UserProfile;
}

interface StoredAccount extends User {
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthActionResult {
  ok: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<AuthActionResult>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    profile?: UserProfile,
    avatar?: string,
  ) => Promise<AuthActionResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const userIdFromEmail = (email: string) =>
  `usr_${email.trim().toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
const SESSION_KEY = 'terra_user_v2';
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const passwordMinLength = 6;

const hashPassword = async (value: string): Promise<string> => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const loadUsers = (): Record<string, StoredAccount> => loadUsersFromDb() as Record<string, StoredAccount>;
const saveUsers = (users: Record<string, StoredAccount>) => saveUsersToDb(users);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const login: AuthContextType['login'] = async (email, password, role) => {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || !password || !role) {
      return { ok: false, message: 'Email, mot de passe et rôle sont requis.' };
    }

    const users = loadUsers();
    const userId = userIdFromEmail(cleanEmail);
    const account = users[userId];
    if (!account) {
      return { ok: false, message: 'Aucun compte trouvé avec cet email.' };
    }

    if (account.role !== role) {
      return { ok: false, message: `Ce compte est enregistré comme ${account.role}.` };
    }

    const incomingHash = await hashPassword(password);
    if (!account.passwordHash) {
      account.passwordHash = incomingHash;
      account.updatedAt = new Date().toISOString();
    users[userId] = account;
      saveUsers(users);
    } else if (account.passwordHash !== incomingHash) {
      return { ok: false, message: 'Mot de passe incorrect.' };
    }

    const nextUser: User = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      avatar: account.avatar,
      profile: account.profile,
    };

    setUser(nextUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    return { ok: true };
  };

  const register: AuthContextType['register'] = async (
    name,
    email,
    password,
    role,
    profile,
    avatar,
  ) => {
    const cleanEmail = normalizeEmail(email);
    if (!name.trim() || !cleanEmail || !role) {
      return { ok: false, message: 'Nom, email et rôle sont requis.' };
    }
    if (role === 'admin') {
      return { ok: false, message: "L'inscription admin est désactivée. Contactez un administrateur." };
    }
    if (!password || password.length < passwordMinLength) {
      return { ok: false, message: `Le mot de passe doit contenir au moins ${passwordMinLength} caractères.` };
    }

    const newUser: StoredAccount = {
      id: userIdFromEmail(cleanEmail),
      name,
      email: cleanEmail,
      role,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      profile,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const users = loadUsers();
    if (users[newUser.id]) {
      return { ok: false, message: 'Un compte avec cet email existe déjà.' };
    }
    users[newUser.id] = newUser;
    saveUsers(users);

    const sessionUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      profile: newUser.profile,
    };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
