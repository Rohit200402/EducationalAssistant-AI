using EduAssist.API.DTOs;
namespace EduAssist.API.Services;
public interface IQuizService
{
    Task<QuizDetailDto> GenerateQuizAsync(string userId, int categoryId, string topic, int numberOfQuestions);
    Task<PaginatedResponse<QuizListDto>> GetUserQuizzesAsync(string userId, int pageNumber, int pageSize);
    Task<QuizDetailDto?> GetQuizByIdAsync(int quizId, string userId);
    Task<QuizResultDto?> SubmitQuizAsync(int quizId, string userId, QuizSubmitDto submission);
    Task<QuizResultDto?> GetQuizResultsAsync(int quizId, string userId);
}
