export interface StudyGoalDto {
  goalId: number;
  dailyTarget: number;
  weeklyTarget: number;
  questionsToday: number;
  questionsThisWeek: number;
  updatedAt: string;
}

export interface StudyGoalForUpdate {
  dailyTarget: number;
  weeklyTarget: number;
}
