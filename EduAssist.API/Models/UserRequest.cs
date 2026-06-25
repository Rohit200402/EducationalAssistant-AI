namespace EduAssist.API.Models;
public class UserRequest
{
    public int UserRequestId { get; set; }
    public string Query { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime RequestedOn { get; set; } = DateTime.UtcNow;
    public Category Category { get; set; } = null!;
    public ICollection<AIResponse> AIResponses { get; set; } = new List<AIResponse>();
}
