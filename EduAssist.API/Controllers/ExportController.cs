using System.Security.Claims;
using System.Text;
using EduAssist.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduAssist.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExportController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public ExportController(ApplicationDbContext context) { _context = context; }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpGet("response/{id}")]
    public async Task<IActionResult> ExportResponse(int id)
    {
        var userId = GetUserId();
        var response = await _context.AIResponses.Include(ar => ar.UserRequest).ThenInclude(ur => ur.Category)
            .FirstOrDefaultAsync(ar => ar.AIResponseId == id && ar.UserRequest.UserId == userId);
        if (response == null) return NotFound(new { message = "Response not found." });

        var html = GenerateHtml("EduAssist - Response Export", new[] { (response.UserRequest.Query, response.Response, response.UserRequest.Category.SubjectName, response.CreatedAt) });
        return Content(html, "text/html", Encoding.UTF8);
    }

    [HttpGet("responses")]
    public async Task<IActionResult> ExportResponses([FromQuery] string ids = "")
    {
        var userId = GetUserId();
        var idList = ids.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList();
        if (!idList.Any()) return BadRequest(new { message = "No response IDs provided." });

        var responses = await _context.AIResponses.Include(ar => ar.UserRequest).ThenInclude(ur => ur.Category)
            .Where(ar => idList.Contains(ar.AIResponseId) && ar.UserRequest.UserId == userId)
            .OrderByDescending(ar => ar.CreatedAt).ToListAsync();

        var items = responses.Select(r => (r.UserRequest.Query, r.Response, r.UserRequest.Category.SubjectName, r.CreatedAt)).ToArray();
        var html = GenerateHtml("EduAssist - Multiple Responses Export", items);
        return Content(html, "text/html", Encoding.UTF8);
    }

    [HttpGet("conversation/{id}")]
    public async Task<IActionResult> ExportConversation(int id)
    {
        var userId = GetUserId();
        var conversation = await _context.Conversations.Include(c => c.Category).Include(c => c.Messages.OrderBy(m => m.CreatedAt))
            .FirstOrDefaultAsync(c => c.ConversationId == id && c.UserId == userId);
        if (conversation == null) return NotFound(new { message = "Conversation not found." });

        var sb = new StringBuilder();
        sb.AppendLine("<!DOCTYPE html><html><head><meta charset='utf-8'>");
        sb.AppendLine("<title>EduAssist - Conversation Export</title>");
        sb.AppendLine("<style>body{font-family:'Segoe UI',sans-serif;max-width:800px;margin:0 auto;padding:40px;background:#f5f5f5;} .header{background:#4a90d9;color:white;padding:20px;border-radius:8px;margin-bottom:30px;} .message{padding:15px;margin:10px 0;border-radius:8px;} .user-msg{background:#e3f2fd;border-left:4px solid #2196F3;} .assistant-msg{background:#f1f8e9;border-left:4px solid #4CAF50;} .role{font-weight:bold;margin-bottom:5px;} .time{color:#666;font-size:0.85em;} @media print{body{background:white;padding:20px;}}</style>");
        sb.AppendLine("</head><body>");
        sb.AppendLine($"<div class='header'><h1>{System.Net.WebUtility.HtmlEncode(conversation.Title)}</h1><p>Category: {System.Net.WebUtility.HtmlEncode(conversation.Category.SubjectName)} | Created: {conversation.CreatedAt:yyyy-MM-dd HH:mm}</p></div>");

        foreach (var msg in conversation.Messages)
        {
            var cssClass = msg.Role == "user" ? "user-msg" : "assistant-msg";
            var roleName = msg.Role == "user" ? "You" : "AI Assistant";
            sb.AppendLine($"<div class='message {cssClass}'><div class='role'>{roleName}</div><div>{System.Net.WebUtility.HtmlEncode(msg.Content)}</div><div class='time'>{msg.CreatedAt:yyyy-MM-dd HH:mm}</div></div>");
        }

        sb.AppendLine("<hr><p style='text-align:center;color:#666;'>Exported from EduAssist</p></body></html>");
        return Content(sb.ToString(), "text/html", Encoding.UTF8);
    }

    private static string GenerateHtml(string title, (string Query, string Response, string Category, DateTime Date)[] items)
    {
        var sb = new StringBuilder();
        sb.AppendLine("<!DOCTYPE html><html><head><meta charset='utf-8'>");
        sb.AppendLine($"<title>{System.Net.WebUtility.HtmlEncode(title)}</title>");
        sb.AppendLine("<style>body{font-family:'Segoe UI',sans-serif;max-width:800px;margin:0 auto;padding:40px;background:#f5f5f5;} .header{background:#4a90d9;color:white;padding:20px;border-radius:8px;margin-bottom:30px;} .card{background:white;border-radius:8px;padding:20px;margin:15px 0;box-shadow:0 2px 4px rgba(0,0,0,0.1);} .question{color:#1a73e8;font-size:1.1em;font-weight:bold;margin-bottom:10px;} .category{display:inline-block;background:#e8f0fe;color:#1a73e8;padding:3px 10px;border-radius:12px;font-size:0.85em;} .date{color:#666;font-size:0.85em;} .response{margin-top:15px;line-height:1.6;white-space:pre-wrap;} @media print{body{background:white;padding:20px;}.card{box-shadow:none;border:1px solid #ddd;}}</style>");
        sb.AppendLine("</head><body>");
        sb.AppendLine($"<div class='header'><h1>{System.Net.WebUtility.HtmlEncode(title)}</h1><p>Exported: {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC</p></div>");

        foreach (var item in items)
        {
            sb.AppendLine("<div class='card'>");
            sb.AppendLine($"<div class='question'>{System.Net.WebUtility.HtmlEncode(item.Query)}</div>");
            sb.AppendLine($"<span class='category'>{System.Net.WebUtility.HtmlEncode(item.Category)}</span> <span class='date'>{item.Date:yyyy-MM-dd HH:mm}</span>");
            sb.AppendLine($"<div class='response'>{System.Net.WebUtility.HtmlEncode(item.Response)}</div>");
            sb.AppendLine("</div>");
        }

        sb.AppendLine("<hr><p style='text-align:center;color:#666;'>Exported from EduAssist</p></body></html>");
        return sb.ToString();
    }
}
