namespace EduAssist.API.Models;

public class Rating
{
    public int RatingId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int AIResponseId { get; set; }
    public int Value { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public AIResponse AIResponse { get; set; } = null!;
}
