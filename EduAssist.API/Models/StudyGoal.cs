namespace EduAssist.API.Models;

public class StudyGoal
{
    public int GoalId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int DailyTarget { get; set; } = 5;
    public int WeeklyTarget { get; set; } = 25;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
