namespace EduAssist.API.Models;
public class AIResponse
{
    public int AIResponseId { get; set; }
    public string Response { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int UserRequestId { get; set; }
    public UserRequest UserRequest { get; set; } = null!;
}
