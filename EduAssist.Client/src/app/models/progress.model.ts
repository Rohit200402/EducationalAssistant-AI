export interface ProgressStats { totalQuestions: number; questionsThisWeek: number; questionsThisMonth: number; currentStreak: number; longestStreak: number; categoryBreakdown: CategoryBreakdown[]; recentActivity: RecentActivity[]; }
export interface CategoryBreakdown { categoryId: number; categoryName: string; questionCount: number; percentage: number; }
export interface RecentActivity { date: string; questionCount: number; }
