namespace EduAssist.API.Services;
public interface IAIService
{
    Task<string> GenerateResponseAsync(string query, string categoryName, string preferredLanguage);
}
