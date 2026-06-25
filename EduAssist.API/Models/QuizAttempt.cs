namespace EduAssist.API.Models;
public class QuizAttempt
{
    public int AttemptId { get; set; }
    public int QuizId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    public string Answers { get; set; } = string.Empty; // JSON string
    public Quiz Quiz { get; set; } = null!;
}
