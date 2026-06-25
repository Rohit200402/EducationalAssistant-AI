namespace EduAssist.API.DTOs;
public class BookmarkDto { public int BookmarkId { get; set; } public string UserId { get; set; } = ""; public int AIResponseId { get; set; } public DateTime BookmarkedOn { get; set; } public string Notes { get; set; } = ""; public BookmarkAIResponseDto? AIResponse { get; set; } }
public record BookmarkForCreate(int AIResponseId, string Notes);
public record BookmarkForUpdate(int BookmarkId, string Notes);
public class BookmarkAIResponseDto { public int AIResponseId { get; set; } public string Response { get; set; } = ""; public DateTime CreatedAt { get; set; } public string? Query { get; set; } public string? CategoryName { get; set; } }
