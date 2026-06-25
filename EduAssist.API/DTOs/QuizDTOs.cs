namespace EduAssist.API.DTOs;

public record QuizListDto(int QuizId, string Title, string CategoryName, int TotalQuestions, DateTime CreatedAt);
public record QuizDetailDto(int QuizId, string Title, string CategoryName, int TotalQuestions, DateTime CreatedAt, List<QuizQuestionDto> Questions);
public record QuizQuestionDto(int QuestionId, string QuestionText, string OptionA, string OptionB, string OptionC, string OptionD);
public record QuizQuestionWithAnswerDto(int QuestionId, string QuestionText, string OptionA, string OptionB, string OptionC, string OptionD, string CorrectOption, string Explanation);
public record QuizGenerateDto(int CategoryId, string Topic, int NumberOfQuestions = 5);
public record QuizSubmitDto(List<QuizAnswerDto> Answers);
public record QuizAnswerDto(int QuestionId, string SelectedOption);
public record QuizResultDto(int QuizId, string Title, int Score, int TotalQuestions, double Percentage, DateTime CompletedAt, List<QuizResultQuestionDto> Questions);
public record QuizResultQuestionDto(int QuestionId, string QuestionText, string OptionA, string OptionB, string OptionC, string OptionD, string CorrectOption, string SelectedOption, string Explanation, bool IsCorrect);
