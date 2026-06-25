using EduAssist.API.Data;
using EduAssist.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EduAssist.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AIResponsesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public AIResponsesController(ApplicationDbContext context) { _context = context; }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpGet("my-responses")]
    public async Task<ActionResult<PaginatedResponse<AIResponseDto>>> GetMyResponses([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5, [FromQuery] string? search = null)
    {
        var userId = GetUserId();
        var query = _context.AIResponses.Include(a => a.UserRequest).ThenInclude(r => r.Category)
            .Where(a => a.UserRequest.UserId == userId);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(a => a.Response.Contains(search) || a.UserRequest.Query.Contains(search));

        var totalCount = await query.CountAsync();
        var items = await query.OrderByDescending(a => a.CreatedAt).Skip((pageNumber - 1) * pageSize).Take(pageSize)
            .Select(a => new AIResponseDto
            {
                AIResponseId = a.AIResponseId,
                Response = a.Response,
                CreatedAt = a.CreatedAt,
                UserRequestId = a.UserRequestId,
                Query = a.UserRequest.Query,
                CategoryName = a.UserRequest.Category.SubjectName
            }).ToListAsync();

        return Ok(new PaginatedResponse<AIResponseDto>(items, totalCount, pageNumber, pageSize));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PaginatedResponse<AIResponseDto>>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5, [FromQuery] string? search = null)
    {
        var query = _context.AIResponses.Include(a => a.UserRequest).ThenInclude(r => r.Category).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(a => a.Response.Contains(search) || a.UserRequest.Query.Contains(search));

        var totalCount = await query.CountAsync();
        var items = await query.OrderByDescending(a => a.CreatedAt).Skip((pageNumber - 1) * pageSize).Take(pageSize)
            .Select(a => new AIResponseDto
            {
                AIResponseId = a.AIResponseId,
                Response = a.Response,
                CreatedAt = a.CreatedAt,
                UserRequestId = a.UserRequestId,
                Query = a.UserRequest.Query,
                CategoryName = a.UserRequest.Category.SubjectName
            }).ToListAsync();

        return Ok(new PaginatedResponse<AIResponseDto>(items, totalCount, pageNumber, pageSize));
    }

    [HttpGet("by-request/{requestId}")]
    public async Task<ActionResult<List<AIResponseDto>>> GetByRequest(int requestId)
    {
        var userId = GetUserId();
        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        var query = _context.AIResponses.Include(a => a.UserRequest).ThenInclude(r => r.Category)
            .Where(a => a.UserRequestId == requestId);

        if (!roles.Contains("Admin"))
            query = query.Where(a => a.UserRequest.UserId == userId);

        var items = await query.OrderByDescending(a => a.CreatedAt)
            .Select(a => new AIResponseDto
            {
                AIResponseId = a.AIResponseId,
                Response = a.Response,
                CreatedAt = a.CreatedAt,
                UserRequestId = a.UserRequestId,
                Query = a.UserRequest.Query,
                CategoryName = a.UserRequest.Category.SubjectName
            }).ToListAsync();

        return Ok(items);
    }
}
