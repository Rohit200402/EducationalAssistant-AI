namespace EduAssist.API.DTOs;
public class UserRequestDto { public int UserRequestId { get; set; } public string Query { get; set; } = ""; public int CategoryId { get; set; } public string? CategoryName { get; set; } public string UserId { get; set; } = ""; public string? UserName { get; set; } public DateTime RequestedOn { get; set; } public AIResponseBriefDto? AIResponse { get; set; } }
public record UserRequestForCreate(string Query, int CategoryId);
public class AIResponseBriefDto { public int AIResponseId { get; set; } public string Response { get; set; } = ""; public DateTime CreatedAt { get; set; } }
