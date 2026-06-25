namespace EduAssist.API.DTOs;

public record QuizListDto(int QuizId, string Title, string CategoryName, int TotalQuestions, string Difficulty, DateTime CreatedAt);
public record QuizDetailDto(int QuizId, string Title, string CategoryName, int TotalQuestions, string Difficulty, DateTime CreatedAt, List<QuizQuestionDto> Questions);
public record QuizQuestionDto(int QuestionId, string QuestionText, string OptionA, string OptionB, string OptionC, string OptionD);
public record QuizQuestionWithAnswerDto(int QuestionId, string QuestionText, string OptionA, string OptionB, string OptionC, string OptionD, string CorrectOption, string Explanation);
public record QuizGenerateDto(int CategoryId, string Topic, int NumberOfQuestions = 5, string Difficulty = "Medium");
public record QuizSubmitDto(List<QuizAnswerDto> Answers);
public record QuizAnswerDto(int QuestionId, string SelectedOption);
public record QuizResultDto(int QuizId, string Title, int Score, int TotalQuestions, double Percentage, DateTime CompletedAt, List<QuizResultQuestionDto> Questions);
public record QuizResultQuestionDto(int QuestionId, string QuestionText, string OptionA, string OptionB, string OptionC, string OptionD, string CorrectOption, string SelectedOption, string Explanation, bool IsCorrect);
public record QuizStatsDto(int TotalQuizzes, double AverageScore, List<QuizCategoryStatDto> QuizzesByCategory, List<QuizTopPerformerDto> TopPerformers);
public record QuizCategoryStatDto(string CategoryName, int Count);
public record QuizTopPerformerDto(string UserName, int QuizzesTaken, double AverageScore);
public record AdminQuizListDto(int QuizId, string Title, string CategoryName, string UserName, int TotalQuestions, string Difficulty, DateTime CreatedAt);
