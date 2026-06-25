namespace EduAssist.API.DTOs;

public record ConversationListDto(int ConversationId, string Title, string CategoryName, DateTime CreatedAt, DateTime UpdatedAt, bool IsActive, int MessageCount);
public record ConversationDetailDto(int ConversationId, string Title, string CategoryName, int CategoryId, DateTime CreatedAt, DateTime UpdatedAt, bool IsActive, List<ConversationMessageDto> Messages);
public record ConversationMessageDto(int MessageId, string Role, string Content, DateTime CreatedAt);
public record ConversationCreateDto(string Title, int CategoryId);
public record ConversationSendMessageDto(string Content);
public record AdminConversationListDto(int ConversationId, string Title, string UserName, string CategoryName, int MessageCount, DateTime CreatedAt, DateTime UpdatedAt, bool IsActive);
