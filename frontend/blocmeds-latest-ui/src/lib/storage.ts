export interface UserData {
  username: string;
  balance: number;
  scans: number;
  streak: number;
  reports: number;
  trustScore: number;
  rank: string;
  transactions: string[];
  recentActivity: string[];
  generatedHistory: string[];
  reportsHistory: string[];
  achievements: string[];
  notifications: boolean;
  darkMode: boolean;
}

const STORAGE_KEY = 'blocmeds_user';

export const defaultUser: UserData = {
  username: '',
  balance: 100,
  scans: 0,
  streak: 0,
  reports: 0,
  trustScore: 0,
  rank: 'Bronze',
  transactions: ['Welcome bonus: +100 ETH'],
  recentActivity: ['Account created'],
  generatedHistory: [],
  reportsHistory: [],
  achievements: [],
  notifications: true,
  darkMode: false,
};

export const getUser = (): UserData | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveUser = (user: UserData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const updateUser = (updates: Partial<UserData>): UserData => {
  const current = getUser() || defaultUser;
  const updated = { ...current, ...updates };
  
  // Calculate trust score
  updated.trustScore = Math.round((updated.scans + updated.reports * 2) / 10);
  
  // Calculate rank
  if (updated.trustScore < 5) {
    updated.rank = 'Bronze';
  } else if (updated.trustScore < 10) {
    updated.rank = 'Silver';
  } else {
    updated.rank = 'Gold';
  }
  
  saveUser(updated);
  return updated;
};

export const clearUser = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
