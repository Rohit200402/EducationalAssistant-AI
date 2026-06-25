namespace EduAssist.API.DTOs;
public class ProgressStats { public int TotalQuestions { get; set; } public int QuestionsThisWeek { get; set; } public int QuestionsThisMonth { get; set; } public int CurrentStreak { get; set; } public int LongestStreak { get; set; } public List<CategoryBreakdown> CategoryBreakdown { get; set; } = new(); public List<RecentActivity> RecentActivity { get; set; } = new(); }
public class CategoryBreakdown { public int CategoryId { get; set; } public string CategoryName { get; set; } = ""; public int QuestionCount { get; set; } public double Percentage { get; set; } }
public class RecentActivity { public DateTime Date { get; set; } public int QuestionCount { get; set; } }
