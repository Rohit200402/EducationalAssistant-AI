using System.Text.Json;
using EduAssist.API.Data;
using EduAssist.API.DTOs;
using EduAssist.API.Models;
using Microsoft.EntityFrameworkCore;
namespace EduAssist.API.Services;
public class QuizService : IQuizService
{
    private readonly ApplicationDbContext _context;
    private readonly IAIService _aiService;
    public QuizService(ApplicationDbContext context, IAIService aiService) { _context = context; _aiService = aiService; }

    public async Task<QuizDetailDto> GenerateQuizAsync(string userId, int categoryId, string topic, int numberOfQuestions)
    {
        var category = await _context.Categories.FindAsync(categoryId);
        var categoryName = category?.SubjectName ?? "General";
        var jsonResponse = await _aiService.GenerateQuizQuestionsAsync(topic, categoryName, numberOfQuestions);

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var questions = JsonSerializer.Deserialize<List<QuizQuestionJson>>(jsonResponse, options) ?? new List<QuizQuestionJson>();

        var quiz = new Quiz
        {
            Title = $"{topic} - {categoryName} Quiz",
            CategoryId = categoryId,
            UserId = userId,
            TotalQuestions = questions.Count
        };
        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();

        foreach (var q in questions)
        {
            _context.QuizQuestions.Add(new QuizQuestion
            {
                QuizId = quiz.QuizId,
                QuestionText = q.QuestionText ?? "",
                OptionA = q.OptionA ?? "",
                OptionB = q.OptionB ?? "",
                OptionC = q.OptionC ?? "",
                OptionD = q.OptionD ?? "",
                CorrectOption = q.CorrectOption ?? "A",
                Explanation = q.Explanation ?? ""
            });
        }
        await _context.SaveChangesAsync();

        var savedQuestions = await _context.QuizQuestions.Where(qq => qq.QuizId == quiz.QuizId).ToListAsync();
        return new QuizDetailDto(quiz.QuizId, quiz.Title, categoryName, quiz.TotalQuestions, quiz.CreatedAt,
            savedQuestions.Select(qq => new QuizQuestionDto(qq.QuestionId, qq.QuestionText, qq.OptionA, qq.OptionB, qq.OptionC, qq.OptionD)).ToList());
    }

    public async Task<PaginatedResponse<QuizListDto>> GetUserQuizzesAsync(string userId, int pageNumber, int pageSize)
    {
        var query = _context.Quizzes.Include(q => q.Category).Where(q => q.UserId == userId);
        var totalCount = await query.CountAsync();
        var items = await query.OrderByDescending(q => q.CreatedAt).Skip((pageNumber - 1) * pageSize).Take(pageSize)
            .Select(q => new QuizListDto(q.QuizId, q.Title, q.Category.SubjectName, q.TotalQuestions, q.CreatedAt)).ToListAsync();
        return new PaginatedResponse<QuizListDto>(items, totalCount, pageNumber, pageSize);
    }

    public async Task<QuizDetailDto?> GetQuizByIdAsync(int quizId, string userId)
    {
        var quiz = await _context.Quizzes.Include(q => q.Category).Include(q => q.Questions).FirstOrDefaultAsync(q => q.QuizId == quizId && q.UserId == userId);
        if (quiz == null) return null;
        return new QuizDetailDto(quiz.QuizId, quiz.Title, quiz.Category.SubjectName, quiz.TotalQuestions, quiz.CreatedAt,
            quiz.Questions.Select(qq => new QuizQuestionDto(qq.QuestionId, qq.QuestionText, qq.OptionA, qq.OptionB, qq.OptionC, qq.OptionD)).ToList());
    }

    public async Task<QuizResultDto?> SubmitQuizAsync(int quizId, string userId, QuizSubmitDto submission)
    {
        var quiz = await _context.Quizzes.Include(q => q.Questions).FirstOrDefaultAsync(q => q.QuizId == quizId && q.UserId == userId);
        if (quiz == null) return null;

        int score = 0;
        var resultQuestions = new List<QuizResultQuestionDto>();
        foreach (var question in quiz.Questions)
        {
            var answer = submission.Answers.FirstOrDefault(a => a.QuestionId == question.QuestionId);
            var selected = answer?.SelectedOption ?? "";
            var isCorrect = string.Equals(selected, question.CorrectOption, StringComparison.OrdinalIgnoreCase);
            if (isCorrect) score++;
            resultQuestions.Add(new QuizResultQuestionDto(question.QuestionId, question.QuestionText, question.OptionA, question.OptionB, question.OptionC, question.OptionD, question.CorrectOption, selected, question.Explanation, isCorrect));
        }

        var attempt = new QuizAttempt
        {
            QuizId = quizId,
            UserId = userId,
            Score = score,
            TotalQuestions = quiz.TotalQuestions,
            Answers = JsonSerializer.Serialize(submission.Answers)
        };
        _context.QuizAttempts.Add(attempt);
        await _context.SaveChangesAsync();

        var percentage = quiz.TotalQuestions > 0 ? (double)score / quiz.TotalQuestions * 100 : 0;
        return new QuizResultDto(quiz.QuizId, quiz.Title, score, quiz.TotalQuestions, Math.Round(percentage, 1), attempt.CompletedAt, resultQuestions);
    }

    public async Task<QuizResultDto?> GetQuizResultsAsync(int quizId, string userId)
    {
        var attempt = await _context.QuizAttempts.Where(a => a.QuizId == quizId && a.UserId == userId).OrderByDescending(a => a.CompletedAt).FirstOrDefaultAsync();
        if (attempt == null) return null;
        var quiz = await _context.Quizzes.Include(q => q.Questions).FirstOrDefaultAsync(q => q.QuizId == quizId);
        if (quiz == null) return null;

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var savedAnswers = JsonSerializer.Deserialize<List<QuizAnswerDto>>(attempt.Answers, options) ?? new List<QuizAnswerDto>();
        var resultQuestions = quiz.Questions.Select(q =>
        {
            var answer = savedAnswers.FirstOrDefault(a => a.QuestionId == q.QuestionId);
            var selected = answer?.SelectedOption ?? "";
            return new QuizResultQuestionDto(q.QuestionId, q.QuestionText, q.OptionA, q.OptionB, q.OptionC, q.OptionD, q.CorrectOption, selected, q.Explanation, string.Equals(selected, q.CorrectOption, StringComparison.OrdinalIgnoreCase));
        }).ToList();

        var percentage = attempt.TotalQuestions > 0 ? (double)attempt.Score / attempt.TotalQuestions * 100 : 0;
        return new QuizResultDto(quiz.QuizId, quiz.Title, attempt.Score, attempt.TotalQuestions, Math.Round(percentage, 1), attempt.CompletedAt, resultQuestions);
    }

    private class QuizQuestionJson
    {
        public string? QuestionText { get; set; }
        public string? OptionA { get; set; }
        public string? OptionB { get; set; }
        public string? OptionC { get; set; }
        public string? OptionD { get; set; }
        public string? CorrectOption { get; set; }
        public string? Explanation { get; set; }
    }
}
