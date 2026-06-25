namespace EduAssist.API.Services;
public interface IAIService
{
    Task<string> GenerateResponseAsync(string query, string categoryName, string preferredLanguage, string? systemPrompt = null);
    Task<string> GenerateConversationResponseAsync(List<ChatMessage> messages, string categoryName, string preferredLanguage, string? systemPrompt = null);
    Task<string> GenerateQuizQuestionsAsync(string topic, string categoryName, int numberOfQuestions);
}

public class ChatMessage
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
