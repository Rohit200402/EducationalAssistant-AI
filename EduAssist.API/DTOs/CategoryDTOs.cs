namespace EduAssist.API.DTOs;
public record CategoryDto(int CategoryId, string SubjectName, string Description, string SystemPrompt);
public record CategoryForCreate(string SubjectName, string Description = "", string SystemPrompt = "");
public record CategoryForUpdate(int CategoryId, string SubjectName, string Description = "", string SystemPrompt = "");
