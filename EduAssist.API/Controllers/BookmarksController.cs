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
public class BookmarksController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public BookmarksController(ApplicationDbContext context) { _context = context; }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<BookmarkDto>>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5, [FromQuery] string? search = null)
    {
        var userId = GetUserId();
        var query = _context.Bookmarks.Include(b => b.AIResponse).ThenInclude(a => a.UserRequest).ThenInclude(r => r.Category)
            .Where(b => b.UserId == userId);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(b => b.Notes.Contains(search) || b.AIResponse.Response.Contains(search));

        var totalCount = await query.CountAsync();
        var items = await query.OrderByDescending(b => b.BookmarkedOn).Skip((pageNumber - 1) * pageSize).Take(pageSize)
            .Select(b => new BookmarkDto
            {
                BookmarkId = b.BookmarkId,
                UserId = b.UserId,
                AIResponseId = b.AIResponseId,
                BookmarkedOn = b.BookmarkedOn,
                Notes = b.Notes,
                AIResponse = new BookmarkAIResponseDto
                {
                    AIResponseId = b.AIResponse.AIResponseId,
                    Response = b.AIResponse.Response,
                    CreatedAt = b.AIResponse.CreatedAt,
                    Query = b.AIResponse.UserRequest.Query,
                    CategoryName = b.AIResponse.UserRequest.Category.SubjectName
                }
            }).ToListAsync();

        return Ok(new PaginatedResponse<BookmarkDto>(items, totalCount, pageNumber, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookmarkDto>> GetById(int id)
    {
        var userId = GetUserId();
        var bookmark = await _context.Bookmarks.Include(b => b.AIResponse).ThenInclude(a => a.UserRequest).ThenInclude(r => r.Category)
            .Where(b => b.BookmarkId == id && b.UserId == userId)
            .Select(b => new BookmarkDto
            {
                BookmarkId = b.BookmarkId,
                UserId = b.UserId,
                AIResponseId = b.AIResponseId,
                BookmarkedOn = b.BookmarkedOn,
                Notes = b.Notes,
                AIResponse = new BookmarkAIResponseDto
                {
                    AIResponseId = b.AIResponse.AIResponseId,
                    Response = b.AIResponse.Response,
                    CreatedAt = b.AIResponse.CreatedAt,
                    Query = b.AIResponse.UserRequest.Query,
                    CategoryName = b.AIResponse.UserRequest.Category.SubjectName
                }
            }).FirstOrDefaultAsync();

        if (bookmark == null) return NotFound(new { message = "Bookmark not found." });
        return Ok(bookmark);
    }

    [HttpPost]
    public async Task<ActionResult<BookmarkDto>> Create([FromBody] BookmarkForCreate dto)
    {
        var userId = GetUserId();
        if (await _context.Bookmarks.AnyAsync(b => b.UserId == userId && b.AIResponseId == dto.AIResponseId))
            return BadRequest(new { message = "Already bookmarked." });

        var bookmark = new Bookmark
        {
            UserId = userId,
            AIResponseId = dto.AIResponseId,
            Notes = dto.Notes,
            BookmarkedOn = DateTime.UtcNow
        };
        _context.Bookmarks.Add(bookmark);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = bookmark.BookmarkId }, new BookmarkDto
        {
            BookmarkId = bookmark.BookmarkId,
            UserId = bookmark.UserId,
            AIResponseId = bookmark.AIResponseId,
            BookmarkedOn = bookmark.BookmarkedOn,
            Notes = bookmark.Notes
        });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BookmarkDto>> Update(int id, [FromBody] BookmarkForUpdate dto)
    {
        var userId = GetUserId();
        var bookmark = await _context.Bookmarks.FirstOrDefaultAsync(b => b.BookmarkId == id && b.UserId == userId);
        if (bookmark == null) return NotFound(new { message = "Bookmark not found." });
        bookmark.Notes = dto.Notes;
        await _context.SaveChangesAsync();
        return Ok(new BookmarkDto { BookmarkId = bookmark.BookmarkId, UserId = bookmark.UserId, AIResponseId = bookmark.AIResponseId, BookmarkedOn = bookmark.BookmarkedOn, Notes = bookmark.Notes });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var bookmark = await _context.Bookmarks.FirstOrDefaultAsync(b => b.BookmarkId == id && b.UserId == userId);
        if (bookmark == null) return NotFound(new { message = "Bookmark not found." });
        _context.Bookmarks.Remove(bookmark);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("check/{aiResponseId}")]
    public async Task<ActionResult<object>> Check(int aiResponseId)
    {
        var userId = GetUserId();
        var bookmark = await _context.Bookmarks.FirstOrDefaultAsync(b => b.UserId == userId && b.AIResponseId == aiResponseId);
        return Ok(new { isBookmarked = bookmark != null, bookmarkId = bookmark?.BookmarkId });
    }
}
