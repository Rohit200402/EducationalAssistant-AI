namespace EduAssist.API.DTOs;

public record RatingDto(int RatingId, string UserId, int AIResponseId, int Value, DateTime CreatedAt);
public record RatingForCreate(int AIResponseId, int Value);
public class RatingAggregateDto
{
    public double AverageRating { get; set; }
    public int TotalRatings { get; set; }
    public int? UserRating { get; set; }
}
