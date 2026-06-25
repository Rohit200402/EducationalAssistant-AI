namespace EduAssist.API.DTOs;

public class StudyGoalDto
{
    public int GoalId { get; set; }
    public int DailyTarget { get; set; }
    public int WeeklyTarget { get; set; }
    public int QuestionsToday { get; set; }
    public int QuestionsThisWeek { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public record StudyGoalForUpdate(int DailyTarget, int WeeklyTarget);
