import { AppData, Sponsor, Lawyer, Case, Reorder } from '../types';

export class DataService {
  static generateId(): string {
    return Math.random().toString(36).slice(2, 10);
  }

  static getSampleData(): AppData {
    const today = new Date().toISOString().slice(0, 10);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().slice(0, 10);

    const sponsors: Sponsor[] = [
      {
        id: this.generateId(),
        name: 'Facebook - حملة يونيو 2024',
        packageSize: 50,
        used: 32,
        replies: 120,
        lastReply: today,
        notes: 'حملة رئيسية للاستشارات القانونية',
        subscriptionDate: lastMonthStr,
      },
      {
        id: this.generateId(),
        name: 'Facebook - حملة يوليو 2024',
        packageSize: 40,
        used: 10,
        replies: 55,
        lastReply: today,
        notes: 'تجريب تقسيم شرائح العملاء',
        subscriptionDate: today,
      },
      {
        id: this.generateId(),
        name: 'Facebook - حملة أغسطس 2024',
        packageSize: 30,
        used: 25,
        replies: 89,
        lastReply: today,
        notes: 'حملة متخصصة في القضايا الجنائية',
        subscriptionDate: today,
      },
    ];

    const lawyers: Lawyer[] = [
      {
        id: this.generateId(),
        name: 'أحمد محمد السيد',
        phone: '01000000000',
        specialty: 'جنائي',
        status: 'نشط',
        notes: 'خبرة 15 سنة في القضايا الجنائية',
        joinDate: lastMonthStr,
        maxCases: 20,
        currentCases: 15,
        isSubscribed: true,
        subscriptionEndDate: '2024-12-31',
        subscriptionType: 'سنوي',
      },
      {
        id: this.generateId(),
        name: 'منة محمد علي',
        phone: '01111111111',
        specialty: 'مدني',
        status: 'نشط',
        notes: 'متخصصة في قضايا الأسرة والميراث',
        joinDate: lastMonthStr,
        maxCases: 15,
        currentCases: 8,
        isSubscribed: true,
        subscriptionEndDate: '2024-11-30',
        subscriptionType: 'شهري',
      },
      {
        id: this.generateId(),
        name: 'خالد أحمد إبراهيم',
        phone: '01222222222',
        specialty: 'تجاري',
        status: 'نشط',
        notes: 'خبير في القانون التجاري والشركات',
        joinDate: today,
        maxCases: 10,
        currentCases: 3,
        isSubscribed: false,
        subscriptionEndDate: '',
        subscriptionType: 'مجاني',
      },
      {
        id: this.generateId(),
        name: 'فاطمة حسن محمود',
        phone: '01333333333',
        specialty: 'عمالي',
        status: 'موقوف',
        notes: 'في إجازة مؤقتة',
        joinDate: lastMonthStr,
        maxCases: 12,
        currentCases: 0,
        isSubscribed: false,
        subscriptionEndDate: '',
        subscriptionType: 'مجاني',
      },
    ];

    const cases: Case[] = [
      {
        id: this.generateId(),
        title: 'جنحة تبديد رقم 1985/2024',
        sponsorId: sponsors[0].id,
        lawyerId: lawyers[0].id,
        type: 'جنحة',
        status: 'قيد المتابعة',
        isFree: true,
        createdAt: today,
        description: 'قضية تبديد أموال شركة',
      },
      {
        id: this.generateId(),
        title: 'أسرة - نفقة رقم 123/2024',
        sponsorId: sponsors[1].id,
        lawyerId: lawyers[1].id,
        type: 'أسرة',
        status: 'مفتوحة',
        isFree: false,
        createdAt: today,
        description: 'دعوى نفقة زوجة وأطفال',
      },
      {
        id: this.generateId(),
        title: 'تجاري - نزاع شراكة رقم 456/2024',
        sponsorId: sponsors[2].id,
        lawyerId: lawyers[2].id,
        type: 'تجاري',
        status: 'مغلقة',
        isFree: false,
        createdAt: lastMonthStr,
        description: 'نزاع بين شركاء في شركة تجارية',
      },
      {
        id: this.generateId(),
        title: 'عمالي - فصل تعسفي رقم 789/2024',
        sponsorId: null,
        lawyerId: null,
        type: 'عمالي',
        status: 'جديدة',
        isFree: true,
        createdAt: today,
        description: 'دعوى فصل تعسفي من العمل',
      },
      {
        id: this.generateId(),
        title: 'مدني - تعويض أضرار رقم 321/2024',
        sponsorId: sponsors[0].id,
        lawyerId: lawyers[1].id,
        type: 'مدني',
        status: 'قيد المتابعة',
        isFree: false,
        createdAt: lastMonthStr,
        description: 'دعوى تعويض عن أضرار حادث سيارة',
      },
    ];

    const reorders: Reorder[] = [
      {
        id: this.generateId(),
        sponsorId: sponsors[0].id,
        delta: 20,
        note: 'تجديد الباقة الشهرية',
        at: lastMonthStr,
        amount: 5000,
        invoiceNumber: 'INV-001',
      },
      {
        id: this.generateId(),
        sponsorId: sponsors[1].id,
        delta: 15,
        note: 'زيادة عدد القضايا المسموحة',
        at: today,
        amount: 3000,
        invoiceNumber: 'INV-002',
      },
    ];

    return {
      sponsors,
      lawyers,
      cases,
      reorders,
      tasks: [],
    };
  }

  static calculateStats(data: AppData) {
    const totalCases = data.cases.length;
    const freeCases = data.cases.filter(c => c.isFree).length;
    const activeLawyers = data.lawyers.filter(l => l.status === 'نشط').length;
    const totalReplies = data.sponsors.reduce((sum, s) => sum + (s.replies || 0), 0);
    const activeSponsors = data.sponsors.filter(s => (s.packageSize || 0) > (s.used || 0)).length;
    const lowPackages = data.sponsors.filter(s => {
      const remaining = (s.packageSize || 0) - (s.used || 0);
      return remaining <= 5 && remaining > 0;
    }).length;

    return {
      totalCases,
      freeCases,
      activeLawyers,
      totalReplies,
      activeSponsors,
      lowPackages,
    };
  }

  static updateSponsorUsage(data: AppData, caseId: string, oldSponsorId: string | null, newSponsorId: string | null) {
    // إنقاص العدّاد من السبونسر القديم
    if (oldSponsorId) {
      const oldSponsor = data.sponsors.find(s => s.id === oldSponsorId);
      if (oldSponsor && oldSponsor.used > 0) {
        oldSponsor.used -= 1;
      }
    }

    // زيادة العدّاد للسبونسر الجديد
    if (newSponsorId) {
      const newSponsor = data.sponsors.find(s => s.id === newSponsorId);
      if (newSponsor) {
        newSponsor.used = (newSponsor.used || 0) + 1;
      }
    }
  }

  static exportToJSON(data: AppData): string {
    return JSON.stringify(data, null, 2);
  }

  static importFromJSON(jsonString: string): AppData | null {
    try {
      const parsed = JSON.parse(jsonString);
      // التحقق من صحة البيانات
      if (parsed && typeof parsed === 'object' && 
          Array.isArray(parsed.sponsors) && 
          Array.isArray(parsed.lawyers) && 
          Array.isArray(parsed.cases) && 
          Array.isArray(parsed.reorders)) {
        return parsed as AppData;
      }
      return null;
    } catch {
      return null;
    }
  }

  static getInitialData(): AppData {
    return this.getSampleData();
  }

  static exportData(data: AppData): string {
    return this.exportToJSON(data);
  }

  static importData(jsonString: string): AppData {
    const result = this.importFromJSON(jsonString);
    if (!result) {
      throw new Error('Invalid data format');
    }
    return result;
  }
}