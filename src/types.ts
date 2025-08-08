export interface Sponsor {
  id: string;
  name: string;
  packageSize: number;
  used: number;
  replies: number;
  lastReply: string;
  notes: string;
  subscriptionDate?: string;
}

export interface Lawyer {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  status: 'نشط' | 'موقوف';
  notes: string;
  joinDate?: string;
  maxCases?: number;
  currentCases?: number;
  isSubscribed?: boolean;
  subscriptionEndDate?: string;
  subscriptionType?: 'شهري' | 'سنوي' | 'مجاني';
}

export interface Case {
  id: string;
  title: string;
  sponsorId: string | null;
  lawyerId: string | null;
  type: string;
  status: string;
  isFree: boolean;
  createdAt: string;
  description?: string;
}

export interface Reorder {
  id: string;
  sponsorId: string;
  delta: number;
  note: string;
  at: string;
  amount?: number;
  invoiceNumber?: string;
}

export interface AppData {
  sponsors: Sponsor[];
  lawyers: Lawyer[];
  cases: Case[];
  reorders: Reorder[];
}

export interface Stats {
  totalCases: number;
  freeCases: number;
  activeLawyers: number;
  totalReplies: number;
  activeSponsors: number;
  lowPackages: number;
}

export interface Task {
  id: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export interface MarketingStats {
  sponsorId: string;
  sponsorName: string;
  startDate: string;
  endDate: string;
  totalClients: number;
  subscribedClients: number;
  pendingCases: number;
  referrals: number;
  repliedClients: number;
  newClients: number;
  conversionRate: number;
  revenue: number;
  topCampaign: string;
}

export interface AppData {
  // ... existing fields
  tasks: Task[];
}