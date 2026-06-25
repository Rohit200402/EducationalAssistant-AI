namespace EduAssist.API.DTOs;
public record CategoryDto(int CategoryId, string SubjectName);
public record CategoryForCreate(string SubjectName);
public record CategoryForUpdate(int CategoryId, string SubjectName);
