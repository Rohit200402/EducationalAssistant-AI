namespace EduAssist.API.DTOs;
public class AIResponseDto { public int AIResponseId { get; set; } public string Response { get; set; } = ""; public DateTime CreatedAt { get; set; } public int UserRequestId { get; set; } public string? Query { get; set; } public string? CategoryName { get; set; } }
