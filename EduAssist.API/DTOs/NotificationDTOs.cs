namespace EduAssist.API.DTOs;

public class NotificationDto
{
    public int NotificationId { get; set; }
    public string? UserId { get; set; }
    public string Title { get; set; } = "";
    public string Message { get; set; } = "";
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Type { get; set; } = "info";
}

public record NotificationForCreate(string Title, string Message, string Type = "announcement");
public record NotificationMarkRead(int NotificationId);
