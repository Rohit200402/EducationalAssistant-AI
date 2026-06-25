export interface AdminDashboardStats { totalUsers: number; totalRequests: number; totalResponses: number; totalCategories: number; activeUsersToday: number; requestsToday: number; recentRequests: DashboardRequest[]; }
export interface UserDashboardStats { totalQuestions: number; totalBookmarks: number; currentStreak: number; questionsThisWeek: number; remainingQuota: number; dailyLimit: number; recentQuestions: DashboardRequest[]; topCategories: DashboardCategory[]; }
export interface DashboardRequest { userRequestId: number; query: string; categoryName: string; requestedOn: string; hasResponse: boolean; }
export interface DashboardCategory { categoryName: string; count: number; }
