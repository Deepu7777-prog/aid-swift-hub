export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AccidentReport {
  id: string;
  userId: string;
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  photoUrl: string | null;
  status: 'pending' | 'verified' | 'resolved';
  type: 'manual' | 'shake-detected';
}

export interface UserStats {
  totalReports: number;
  verifiedReports: number;
  rewardPoints: number;
  rank: string;
}

const STORAGE_KEYS = {
  USER: 'emergency_user',
  REPORTS: 'emergency_reports',
  STATS: 'emergency_stats',
};

export const storage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getReports: (): AccidentReport[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
  },

  addReport: (report: Omit<AccidentReport, 'id'>): AccidentReport => {
    const reports = storage.getReports();
    const newReport: AccidentReport = {
      ...report,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    
    // Update stats
    const stats = storage.getStats();
    stats.totalReports += 1;
    stats.rewardPoints += 10;
    stats.rank = calculateRank(stats.rewardPoints);
    storage.setStats(stats);
    
    return newReport;
  },

  getStats: (): UserStats => {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : {
      totalReports: 0,
      verifiedReports: 0,
      rewardPoints: 0,
      rank: 'Newcomer',
    };
  },

  setStats: (stats: UserStats): void => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  },
};

function calculateRank(points: number): string {
  if (points >= 500) return 'Guardian Hero';
  if (points >= 300) return 'Safety Champion';
  if (points >= 150) return 'First Responder';
  if (points >= 50) return 'Active Reporter';
  return 'Newcomer';
}
