namespace EduAssist.API.Models;
public class Quiz
{
    public int QuizId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int TotalQuestions { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Category Category { get; set; } = null!;
    public ICollection<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
    public ICollection<QuizAttempt> Attempts { get; set; } = new List<QuizAttempt>();
}
