namespace EduAssist.API.DTOs;

public class LeaderboardDto
{
    public int Rank { get; set; }
    public string DisplayName { get; set; } = "";
    public int TotalQuestions { get; set; }
    public string TopCategory { get; set; } = "";
}
