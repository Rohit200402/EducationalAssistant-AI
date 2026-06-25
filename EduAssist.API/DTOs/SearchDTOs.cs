namespace EduAssist.API.DTOs;

public class SearchResultDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty; // "question", "response", "bookmark"
    public string Title { get; set; } = string.Empty;
    public string Snippet { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}
