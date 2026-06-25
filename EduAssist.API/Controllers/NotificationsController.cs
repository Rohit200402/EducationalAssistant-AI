using EduAssist.API.Data;
using EduAssist.API.DTOs;
using EduAssist.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EduAssist.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public NotificationsController(ApplicationDbContext context) { _context = context; }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpGet]
    public async Task<ActionResult<List<NotificationDto>>> GetUnread()
    {
        var userId = GetUserId();
        var notifications = await _context.Notifications
            .Where(n => (n.UserId == userId || n.UserId == null) && !n.IsRead)
            .OrderByDescending(n => n.CreatedAt)
            .Take(20)
            .Select(n => new NotificationDto
            {
                NotificationId = n.NotificationId,
                UserId = n.UserId,
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                Type = n.Type
            }).ToListAsync();
        return Ok(notifications);
    }

    [HttpPost("mark-read/{id}")]
    public async Task<IActionResult> MarkRead(int id)
    {
        var userId = GetUserId();
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.NotificationId == id && (n.UserId == userId || n.UserId == null));
        if (notification == null) return NotFound(new { message = "Notification not found." });
        notification.IsRead = true;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Marked as read." });
    }

    [HttpPost("broadcast")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<NotificationDto>> Broadcast([FromBody] NotificationForCreate dto)
    {
        var notification = new Notification
        {
            UserId = null,
            Title = dto.Title,
            Message = dto.Message,
            Type = dto.Type,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
        return Ok(new NotificationDto
        {
            NotificationId = notification.NotificationId,
            UserId = notification.UserId,
            Title = notification.Title,
            Message = notification.Message,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt,
            Type = notification.Type
        });
    }
}
