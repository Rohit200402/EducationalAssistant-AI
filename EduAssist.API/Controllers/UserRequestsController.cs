using EduAssist.API.Data;
using EduAssist.API.DTOs;
using EduAssist.API.Models;
using EduAssist.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EduAssist.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserRequestsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAIService _aiService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public UserRequestsController(ApplicationDbContext context, IAIService aiService, UserManager<ApplicationUser> userManager, IConfiguration configuration)
    {
        _context = context;
        _aiService = aiService;
        _userManager = userManager;
        _configuration = configuration;
    }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserRequestForCreate dto)
    {
        var userId = GetUserId();
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);
        var isAdmin = roles.Contains("Admin");

        // Rate limiting for non-admin users
        if (!isAdmin)
        {
            var dailyLimit = int.Parse(_configuration["RateLimiting:StudentDailyLimit"] ?? "20");
            var today = DateTime.UtcNow.Date;
            var todayCount = await _context.UserRequests.CountAsync(r => r.UserId == userId && r.RequestedOn >= today);
            if (todayCount >= dailyLimit)
                return StatusCode(429, new { message = $"Daily limit of {dailyLimit} questions reached. Try again tomorrow.", remainingQuota = 0 });
        }

        var category = await _context.Categories.FindAsync(dto.CategoryId);
        if (category == null) return BadRequest(new { message = "Invalid category." });

        var userRequest = new UserRequest
        {
            Query = dto.Query,
            CategoryId = dto.CategoryId,
            UserId = userId,
            RequestedOn = DateTime.UtcNow
        };
        _context.UserRequests.Add(userRequest);
        await _context.SaveChangesAsync();

        // Try AI generation
        try
        {
            var aiResponseText = await _aiService.GenerateResponseAsync(dto.Query, category.SubjectName, user.PreferredLanguage, string.IsNullOrEmpty(category.SystemPrompt) ? null : category.SystemPrompt);
            var aiResponse = new AIResponse
            {
                Response = aiResponseText,
                UserRequestId = userRequest.UserRequestId,
                CreatedAt = DateTime.UtcNow
            };
            _context.AIResponses.Add(aiResponse);
            user.TotalQueriesAsked++;
            user.LastActiveOn = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);
            await _context.SaveChangesAsync();

            return Ok(new UserRequestDto
            {
                UserRequestId = userRequest.UserRequestId,
                Query = userRequest.Query,
                CategoryId = userRequest.CategoryId,
                CategoryName = category.SubjectName,
                UserId = userId,
                RequestedOn = userRequest.RequestedOn,
                AIResponse = new AIResponseBriefDto
                {
                    AIResponseId = aiResponse.AIResponseId,
                    Response = aiResponse.Response,
                    CreatedAt = aiResponse.CreatedAt
                }
            });
        }
        catch (Exception ex)
        {
            user.TotalQueriesAsked++;
            user.LastActiveOn = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);
            return StatusCode(503, new { message = "AI service temporarily unavailable. Your question has been saved.", detail = ex.Message, userRequestId = userRequest.UserRequestId });
        }
    }

    [HttpPost("{id}/regenerate")]
    public async Task<IActionResult> Regenerate(int id)
    {
        var userId = GetUserId();
        var userRequest = await _context.UserRequests.Include(r => r.Category).FirstOrDefaultAsync(r => r.UserRequestId == id && r.UserId == userId);
        if (userRequest == null) return NotFound(new { message = "Request not found." });

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return Unauthorized();

        try
        {
            var aiResponseText = await _aiService.GenerateResponseAsync(userRequest.Query, userRequest.Category.SubjectName, user.PreferredLanguage, string.IsNullOrEmpty(userRequest.Category.SystemPrompt) ? null : userRequest.Category.SystemPrompt);
            var aiResponse = new AIResponse
            {
                Response = aiResponseText,
                UserRequestId = userRequest.UserRequestId,
                CreatedAt = DateTime.UtcNow
            };
            _context.AIResponses.Add(aiResponse);
            await _context.SaveChangesAsync();

            return Ok(new AIResponseBriefDto
            {
                AIResponseId = aiResponse.AIResponseId,
                Response = aiResponse.Response,
                CreatedAt = aiResponse.CreatedAt
            });
        }
        catch (Exception ex)
        {
            return StatusCode(503, new { message = "AI service temporarily unavailable. Please try again later.", detail = ex.Message, userRequestId = id });
        }
    }

    [HttpGet("my-requests")]
    public async Task<ActionResult<PaginatedResponse<UserRequestDto>>> GetMyRequests([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5, [FromQuery] string? search = null)
    {
        var userId = GetUserId();
        var query = _context.UserRequests.Include(r => r.Category).Include(r => r.AIResponses)
            .Where(r => r.UserId == userId);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(r => r.Query.Contains(search) || r.Category.SubjectName.Contains(search));

        var totalCount = await query.CountAsync();
        var items = await query.OrderByDescending(r => r.RequestedOn).Skip((pageNumber - 1) * pageSize).Take(pageSize)
            .Select(r => new UserRequestDto
            {
                UserRequestId = r.UserRequestId,
                Query = r.Query,
                CategoryId = r.CategoryId,
                CategoryName = r.Category.SubjectName,
                UserId = r.UserId,
                RequestedOn = r.RequestedOn,
                AIResponse = r.AIResponses.OrderByDescending(a => a.CreatedAt).Select(a => new AIResponseBriefDto
                {
                    AIResponseId = a.AIResponseId,
                    Response = a.Response,
                    CreatedAt = a.CreatedAt
                }).FirstOrDefault()
            }).ToListAsync();

        return Ok(new PaginatedResponse<UserRequestDto>(items, totalCount, pageNumber, pageSize));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PaginatedResponse<UserRequestDto>>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5, [FromQuery] string? search = null)
    {
        var query = _context.UserRequests.Include(r => r.Category).Include(r => r.AIResponses).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(r => r.Query.Contains(search) || r.Category.SubjectName.Contains(search));

        var totalCount = await query.CountAsync();
        var items = await query.OrderByDescending(r => r.RequestedOn).Skip((pageNumber - 1) * pageSize).Take(pageSize)
            .Select(r => new UserRequestDto
            {
                UserRequestId = r.UserRequestId,
                Query = r.Query,
                CategoryId = r.CategoryId,
                CategoryName = r.Category.SubjectName,
                UserId = r.UserId,
                RequestedOn = r.RequestedOn,
                AIResponse = r.AIResponses.OrderByDescending(a => a.CreatedAt).Select(a => new AIResponseBriefDto
                {
                    AIResponseId = a.AIResponseId,
                    Response = a.Response,
                    CreatedAt = a.CreatedAt
                }).FirstOrDefault()
            }).ToListAsync();

        return Ok(new PaginatedResponse<UserRequestDto>(items, totalCount, pageNumber, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserRequestDto>> GetById(int id)
    {
        var userId = GetUserId();
        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        var query = _context.UserRequests.Include(r => r.Category).Include(r => r.AIResponses).AsQueryable();

        if (!roles.Contains("Admin"))
            query = query.Where(r => r.UserId == userId);

        var request = await query.Where(r => r.UserRequestId == id)
            .Select(r => new UserRequestDto
            {
                UserRequestId = r.UserRequestId,
                Query = r.Query,
                CategoryId = r.CategoryId,
                CategoryName = r.Category.SubjectName,
                UserId = r.UserId,
                RequestedOn = r.RequestedOn,
                AIResponse = r.AIResponses.OrderByDescending(a => a.CreatedAt).Select(a => new AIResponseBriefDto
                {
                    AIResponseId = a.AIResponseId,
                    Response = a.Response,
                    CreatedAt = a.CreatedAt
                }).FirstOrDefault()
            }).FirstOrDefaultAsync();

        if (request == null) return NotFound(new { message = "Request not found." });
        return Ok(request);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var request = await _context.UserRequests.FindAsync(id);
        if (request == null) return NotFound(new { message = "Request not found." });
        _context.UserRequests.Remove(request);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
