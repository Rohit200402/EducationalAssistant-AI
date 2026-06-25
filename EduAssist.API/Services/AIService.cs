using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
namespace EduAssist.API.Services;
public class AIService : IAIService
{
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<AIService> _logger;
    public AIService(IConfiguration configuration, IHttpClientFactory httpClientFactory, ILogger<AIService> logger)
    { _configuration = configuration; _httpClientFactory = httpClientFactory; _logger = logger; }

    public async Task<string> GenerateResponseAsync(string query, string categoryName, string preferredLanguage, string? systemPrompt = null)
    {
        var apiKey = _configuration["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogWarning("OpenAI API key not configured. Using mock response.");
            await Task.Delay(500);
            return GenerateMockResponse(query, categoryName, preferredLanguage);
        }
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            var sysContent = !string.IsNullOrWhiteSpace(systemPrompt)
                ? $"{systemPrompt}\n\nLanguage: {preferredLanguage}. Provide clear educational responses."
                : $"You are EduAssist, an AI education assistant. Category: {categoryName}. Language: {preferredLanguage}. Provide clear educational responses.";
            var body = new { model = _configuration["OpenAI:Model"] ?? "gpt-3.5-turbo", messages = new[] { new { role = "system", content = sysContent }, new { role = "user", content = query } }, max_tokens = 1500, temperature = 0.7 };
            var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                return doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? "No response.";
            }
            var errorBody = await response.Content.ReadAsStringAsync();
            _logger.LogError("OpenAI API error - Status: {StatusCode}, Response: {ErrorBody}", response.StatusCode, errorBody);
            throw new Exception($"OpenAI error: {response.StatusCode} - {errorBody}");
        }
        catch (Exception ex) { _logger.LogError(ex, "AI generation failed"); throw; }
    }

    public async Task<string> GenerateConversationResponseAsync(List<ChatMessage> messages, string categoryName, string preferredLanguage, string? systemPrompt = null)
    {
        var apiKey = _configuration["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogWarning("OpenAI API key not configured. Using mock response.");
            await Task.Delay(500);
            var lastMsg = messages.LastOrDefault()?.Content ?? "your question";
            return GenerateMockResponse(lastMsg, categoryName, preferredLanguage);
        }
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            var sysContent = !string.IsNullOrWhiteSpace(systemPrompt)
                ? $"{systemPrompt}\n\nLanguage: {preferredLanguage}. Provide clear educational responses."
                : $"You are EduAssist, an AI education assistant. Category: {categoryName}. Language: {preferredLanguage}. Provide clear educational responses.";
            var allMessages = new List<object> { new { role = "system", content = sysContent } };
            foreach (var msg in messages)
                allMessages.Add(new { role = msg.Role, content = msg.Content });
            var body = new { model = _configuration["OpenAI:Model"] ?? "gpt-3.5-turbo", messages = allMessages, max_tokens = 1500, temperature = 0.7 };
            var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                return doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? "No response.";
            }
            var errorBody = await response.Content.ReadAsStringAsync();
            _logger.LogError("OpenAI API error - Status: {StatusCode}, Response: {ErrorBody}", response.StatusCode, errorBody);
            throw new Exception($"OpenAI error: {response.StatusCode} - {errorBody}");
        }
        catch (Exception ex) { _logger.LogError(ex, "AI conversation generation failed"); throw; }
    }

    public async Task<string> GenerateQuizQuestionsAsync(string topic, string categoryName, int numberOfQuestions, string difficulty = "Medium")
    {
        var apiKey = _configuration["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogWarning("OpenAI API key not configured. Using mock quiz.");
            await Task.Delay(500);
            return GenerateMockQuiz(topic, categoryName, numberOfQuestions);
        }
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            var prompt = $"Generate {numberOfQuestions} {difficulty}-difficulty multiple choice questions about '{topic}' in the category '{categoryName}'. Return as JSON array with objects containing: questionText, optionA, optionB, optionC, optionD, correctOption (A/B/C/D), explanation. Only return the JSON array, no extra text.";
            var body = new { model = _configuration["OpenAI:Model"] ?? "gpt-3.5-turbo", messages = new[] { new { role = "system", content = "You are an educational quiz generator. Always respond with valid JSON." }, new { role = "user", content = prompt } }, max_tokens = 3000, temperature = 0.7 };
            var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                return doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? "[]";
            }
            var errorBody = await response.Content.ReadAsStringAsync();
            _logger.LogError("OpenAI API error - Status: {StatusCode}, Response: {ErrorBody}", response.StatusCode, errorBody);
            throw new Exception($"OpenAI error: {response.StatusCode} - {errorBody}");
        }
        catch (Exception ex) { _logger.LogError(ex, "Quiz generation failed"); throw; }
    }

    private static string GenerateMockResponse(string query, string categoryName, string preferredLanguage) =>
        $"## {categoryName} - AI Response\n\n**Question:** {query}\n\n### Explanation:\nThis is a mock AI response for the **{categoryName}** category. Configure your OpenAI API key in appsettings.json for real AI responses.\n\n### Key Points:\n1. Topic: {categoryName}\n2. Language: {preferredLanguage}\n3. Your question has been saved for review\n\n*Generated by EduAssist AI*";

    private static string GenerateMockQuiz(string topic, string categoryName, int numberOfQuestions)
    {
        var questions = new List<object>();
        for (int i = 1; i <= numberOfQuestions; i++)
        {
            questions.Add(new { questionText = $"Sample question {i} about {topic} in {categoryName}?", optionA = $"Option A for question {i}", optionB = $"Option B for question {i}", optionC = $"Option C for question {i}", optionD = $"Option D for question {i}", correctOption = "A", explanation = $"This is the explanation for question {i}. Option A is correct because it best describes the concept of {topic}." });
        }
        return JsonSerializer.Serialize(questions);
    }
}
