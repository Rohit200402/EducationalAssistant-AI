using System.Security.Claims;
using EduAssist.API.Data;
using EduAssist.API.DTOs;
using EduAssist.API.Models;
using EduAssist.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduAssist.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConversationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAIService _aiService;
    public ConversationsController(ApplicationDbContext context, IAIService aiService) { _context = context; _aiService = aiService; }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<ConversationListDto>>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var userId = GetUserId();
        var query = _context.Conversations.Include(c => c.Category).Include(c => c.Messages).Where(c => c.UserId == userId);
        var totalCount = await query.CountAsync();
        var items = await query.OrderByDescending(c => c.UpdatedAt).Skip((pageNumber - 1) * pageSize).Take(pageSize)
            .Select(c => new ConversationListDto(c.ConversationId, c.Title, c.Category.SubjectName, c.CreatedAt, c.UpdatedAt, c.IsActive, c.Messages.Count)).ToListAsync();
        return Ok(new PaginatedResponse<ConversationListDto>(items, totalCount, pageNumber, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ConversationDetailDto>> GetById(int id)
    {
        var userId = GetUserId();
        var conversation = await _context.Conversations.Include(c => c.Category).Include(c => c.Messages.OrderBy(m => m.CreatedAt))
            .FirstOrDefaultAsync(c => c.ConversationId == id && c.UserId == userId);
        if (conversation == null) return NotFound(new { message = "Conversation not found." });
        var dto = new ConversationDetailDto(conversation.ConversationId, conversation.Title, conversation.Category.SubjectName, conversation.CategoryId,
            conversation.CreatedAt, conversation.UpdatedAt, conversation.IsActive,
            conversation.Messages.Select(m => new ConversationMessageDto(m.MessageId, m.Role, m.Content, m.CreatedAt)).ToList());
        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<ConversationDetailDto>> Create([FromBody] ConversationCreateDto dto)
    {
        var userId = GetUserId();
        var category = await _context.Categories.FindAsync(dto.CategoryId);
        if (category == null) return BadRequest(new { message = "Category not found." });
        var conversation = new Conversation { Title = dto.Title, UserId = userId, CategoryId = dto.CategoryId };
        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = conversation.ConversationId },
            new ConversationDetailDto(conversation.ConversationId, conversation.Title, category.SubjectName, category.CategoryId, conversation.CreatedAt, conversation.UpdatedAt, conversation.IsActive, new List<ConversationMessageDto>()));
    }

    [HttpPost("{id}/messages")]
    public async Task<ActionResult<ConversationMessageDto>> SendMessage(int id, [FromBody] ConversationSendMessageDto dto)
    {
        var userId = GetUserId();
        var conversation = await _context.Conversations.Include(c => c.Category).Include(c => c.Messages.OrderBy(m => m.CreatedAt))
            .FirstOrDefaultAsync(c => c.ConversationId == id && c.UserId == userId);
        if (conversation == null) return NotFound(new { message = "Conversation not found." });

        // Save user message
        var userMessage = new ConversationMessage { ConversationId = id, Role = "user", Content = dto.Content };
        _context.ConversationMessages.Add(userMessage);
        await _context.SaveChangesAsync();

        // Build context from previous messages
        var chatMessages = conversation.Messages.Select(m => new ChatMessage { Role = m.Role, Content = m.Content }).ToList();
        chatMessages.Add(new ChatMessage { Role = "user", Content = dto.Content });

        // Generate AI response
        var systemPrompt = conversation.Category.SystemPrompt;
        var aiResponseText = await _aiService.GenerateConversationResponseAsync(chatMessages, conversation.Category.SubjectName, "English", string.IsNullOrEmpty(systemPrompt) ? null : systemPrompt);

        var assistantMessage = new ConversationMessage { ConversationId = id, Role = "assistant", Content = aiResponseText };
        _context.ConversationMessages.Add(assistantMessage);
        conversation.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new ConversationMessageDto(assistantMessage.MessageId, assistantMessage.Role, assistantMessage.Content, assistantMessage.CreatedAt));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var conversation = await _context.Conversations.FirstOrDefaultAsync(c => c.ConversationId == id && c.UserId == userId);
        if (conversation == null) return NotFound(new { message = "Conversation not found." });
        _context.Conversations.Remove(conversation);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PaginatedResponse<AdminConversationListDto>>> GetAllAdmin([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
    {
        var query = _context.Conversations.Include(c => c.Category).Include(c => c.Messages).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(c => c.Title.Contains(search) || c.Category.SubjectName.Contains(search));
        }
        var totalCount = await query.CountAsync();
        var items = await query.OrderByDescending(c => c.UpdatedAt).Skip((pageNumber - 1) * pageSize).Take(pageSize)
            .Select(c => new AdminConversationListDto(c.ConversationId, c.Title,
                _context.Users.Where(u => u.Id == c.UserId).Select(u => u.DisplayName).FirstOrDefault() ?? "Unknown",
                c.Category.SubjectName, c.Messages.Count, c.CreatedAt, c.UpdatedAt, c.IsActive)).ToListAsync();
        return Ok(new PaginatedResponse<AdminConversationListDto>(items, totalCount, pageNumber, pageSize));
    }

    [HttpGet("all/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ConversationDetailDto>> GetByIdAdmin(int id)
    {
        var conversation = await _context.Conversations.Include(c => c.Category).Include(c => c.Messages.OrderBy(m => m.CreatedAt))
            .FirstOrDefaultAsync(c => c.ConversationId == id);
        if (conversation == null) return NotFound(new { message = "Conversation not found." });
        var dto = new ConversationDetailDto(conversation.ConversationId, conversation.Title, conversation.Category.SubjectName, conversation.CategoryId,
            conversation.CreatedAt, conversation.UpdatedAt, conversation.IsActive,
            conversation.Messages.Select(m => new ConversationMessageDto(m.MessageId, m.Role, m.Content, m.CreatedAt)).ToList());
        return Ok(dto);
    }
}
